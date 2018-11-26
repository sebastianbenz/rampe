import { Feed } from 'feed';
import { ncp } from 'ncp';
import nunjucks from 'nunjucks';
import { join } from 'path';
import { Config } from './Config';
import { Content } from './content/Content';
import { File } from './content/File';
import { log } from './log';
import { Pipeline } from './output/Pipeline';

import { pipeline } from 'stream';
import { promisify } from 'util';
import { Directory } from './content/Directory';
import { TargetFile } from './output/TargetFile';

const ncpAsync = promisify(ncp);

export class Build {
  private readonly contents: Content;
  private readonly env: nunjucks.Environment;

  constructor(private config: Config) {
    this.contents = Content.create(config.dir.content);
    this.env = new nunjucks.Environment(new nunjucks.FileSystemLoader(this.config.dir.templates));

    this.env.addFilter('dateFormat', (date: Date) => {
      if (date === undefined || !(date instanceof Date)) {
        return '';
      }
      return date.toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'long',
        weekday: 'long',
        year: 'numeric',
      });
    });
  }

  async all(output: Pipeline) {
    await this.render(output);
    this.feed(output);
    this.copyAssets();
  }

  feed(output: Pipeline): void {
    log.info('Building feed');
    for (const dir of this.contents.directories()) {
      this.feedForDirectory(dir, output);
    }
  }

  render(output: Pipeline) {
    log.info('Building site');
    const result: Array<Promise<void>> = [];
    for (const file of this.contents.files()) {
      result.push(this.renderFile(output, file));
    }
    return Promise.all(result);
  }

  copyAssets() {
    return ncpAsync(this.config.dir.assets, this.config.dir.dist);
  }

  private renderFile(output: Pipeline, file: File): Promise<void> {
    if (file.layout === undefined && file.ext !== 'html') {
      log.warn('missing layout:', file.path);
      return Promise.resolve();
    }
    const templateFile = file.layout + '.html';
    let renderedFile = '';
    const locals = {
      config: this.config,
      content: this.contents.root,
      file,
    };
    if (file.ext === 'html') {
      renderedFile = this.env.renderString(file.content, locals);
    } else {
      renderedFile = this.env.render(templateFile, locals);
    }
    let outputPath;
    if (file.name === 'index') {
      outputPath = join(file.dir, file.name + '.html');
    } else {
      outputPath = join(file.dir, file.name, 'index.html');
    }
    return output.add(TargetFile.create(outputPath, renderedFile, file));
  }

  private feedForDirectory(dir: Directory, output: Pipeline) {
    const link = join(this.config.host, dir.path);
    const feedOptions = {
      category: 'Feed Category',
      description: 'Feed Description',
      favicon: join(this.config.host, this.config.favicon),
      image: join(this.config.host, 'feed.png'),
      links: {
        atom: 'atom.xml',
        json: 'feed.json',
        rss: 'rss.xml',
      },
      title: 'Feed Title',
    };
    const feed = new Feed({
      author: {
        email: this.config.author.email,
        link: this.config.author.link,
        name: this.config.author.name,
      },
      copyright: this.config.copyright,
      description: 'This is my personal feed!',
      favicon: feedOptions.favicon,
      feed: '',
      feedLinks: {
        atom: join(this.config.host, dir.path, feedOptions.links.atom),
        json: join(this.config.host, dir.path, feedOptions.links.json),
        rss: join(this.config.host, dir.path, feedOptions.links.rss),
      },
      id: link,
      image: feedOptions.image,
      link,
      title: 'Feed Title',
    });

    dir.children
      .filter(child => child.isFile())
      .forEach(child => {
        const feedItem = child as File;
        feed.addItem({
          author: [
            {
              email: this.config.author.email,
              link: this.config.author.link,
              name: this.config.author.name,
            },
          ],
          content: feedItem.content,
          date: feedItem.date,
          description: feedItem.description,
          id: feedItem.url,
          image: feedItem.image,
          link: feedItem.url,
          title: feedItem.title,
        });
      });

    feed.addCategory(feedOptions.category);

    const feedOutputs = [
      { format: feedOptions.links.json, generator: feed.json1 },
      { format: feedOptions.links.atom, generator: feed.atom1 },
      { format: feedOptions.links.rss, generator: feed.rss2 },
    ].forEach(feedOuput => {
      const feedPath = join(dir.path, feedOuput.format);
      log.debug('Generating feed: ', feedPath);
      output.add(TargetFile.create(feedPath, feedOuput.generator(), dir));
    });
  }
}
