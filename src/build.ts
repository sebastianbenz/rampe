import log from './log';
import { join } from 'path';
import { Content } from './content/Content';
import { Config } from './Config';
import { Pipeline } from './output/Pipeline';
import { File } from './content/File';
import { ncp } from 'ncp';
import { Feed } from 'feed';
import nunjucks from 'nunjucks';

import { promisify } from 'util';
import { TargetFile } from './output/TargetFile';
import { Directory } from './content/Directory';
import { pipeline } from 'stream';

const ncpAsync = promisify(ncp);

class Build {
  private readonly contents: Content;

  constructor(private config: Config) {
    this.contents = Content.create(config.dir.content);
    nunjucks.configure(config.dir.templates, { autoescape: true });
  }

  public all(output: Pipeline): void {
    this.render(output);
    this.feed(output);
    this.copyAssets();
  }
  public feed(output: Pipeline): void {
    log.info('Building feed');

    for (const dir of this.contents.directories()) {
      this.feedForDirectory(dir, output)
    }

  }

  public render(output: Pipeline) {
    log.info('Building site');
    for (const file of this.contents.files()) {
      this.renderFile(output, file);
    }
  }

  public copyAssets() {
    return ncpAsync(this.config.dir.assets, this.config.dir.dist);
  }

  private renderFile(output: Pipeline, file: File) {
    if (file.layout === undefined) {
      log.warn('missing layout:', file.path);
      return;
    }
    const templateFile = file.layout + '.html';
    let renderedFile = '';
    const locals = {
      config: this.config,
      file,
      content: this.contents.root,
    };
    if (file.ext === 'html') {
      renderedFile = nunjucks.renderString(file.content, locals);
    } else {
      renderedFile = nunjucks.render(templateFile, locals);
    }
    let outputPath;
    if (file.name === 'index') {
      outputPath = join(file.dir, file.name + '.html');
    } else {
      outputPath = join(file.dir, file.name, 'index.html');
    }
    output.add(TargetFile.create(outputPath, renderedFile, file));
  }

  private feedForDirectory(dir: Directory, output: Pipeline) {
    const link = join(this.config.host, dir.path);
    const feedOptions = {
      image: join(this.config.host, 'feed.png'),
      favicon: join(this.config.host, this.config.favicon),
      title: "Feed Title",
      description: "Feed Description",
      category: "Feed Category",
      links: {
        json: 'feed.json',
        atom: 'atom.xml',
        rss: 'rss.xml',
      }
    }
    const feed = new Feed({
      title: "Feed Title",
      description: "This is my personal feed!",
      id: link,
      link,
      feed: '',
      image: feedOptions.image,
      favicon: feedOptions.favicon,
      copyright: this.config.copyright,
      feedLinks: {
        json: join(this.config.host, dir.path, feedOptions.links.json),
        atom: join(this.config.host, dir.path, feedOptions.links.atom),
        rss: join(this.config.host, dir.path, feedOptions.links.rss),
      },
      author: {
        name: this.config.author.name,
        email: this.config.author.email,
        link: this.config.author.link,
      }
    });

    dir.children.filter(child => child.isFile()).forEach(child => {
      const feedItem = child as File
      feed.addItem({
        title: feedItem.title,
        id: feedItem.url,
        link: feedItem.url,
        description: feedItem.description,
        content: feedItem.content,
        author: [{
          name: this.config.author.name,
          email: this.config.author.email,
          link: this.config.author.link,
        }],
        date: feedItem.date,
        image: feedItem.image
      });
    });

    feed.addCategory(feedOptions.category);

    output.add(TargetFile.create(join(dir.path, feedOptions.links.json), feed.json1(), dir))
    output.add(TargetFile.create(join(dir.path, feedOptions.links.atom), feed.atom1(), dir))
    output.add(TargetFile.create(join(dir.path, feedOptions.links.rss), feed.rss2(), dir))
  }
}

export default Build;
