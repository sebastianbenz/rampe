import log from './log';
import { join } from 'path';
import { Content } from './content/Content';
import { Config } from './Config';
import { Pipeline } from './output/Pipeline';
import { File } from './content/File';
import { ncp } from 'ncp';
import nunjucks from 'nunjucks';

import { promisify } from 'util';
import { TargetFile } from './output/TargetFile';

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
  public feed(putput: Pipeline): void {
    log.info('Building feed');
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
}

export default Build;
