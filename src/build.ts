import log from './log';
import { join } from 'path';
import { Content } from './content/Content';
import { Config } from './Config';
import { Output } from './Output';
import { File } from './content/File';
import nunjucks from 'nunjucks';

class Build {
  private readonly contents: Content;

  constructor(private config: Config) {
    this.contents = Content.create(config.dir.content);
    nunjucks.configure(config.dir.templates, { autoescape: true });
  }

  public all(output: Output): void {
    this.render(output);
    this.feed(output);
  }
  public feed(putput: Output): void {
    log.info('Building feed');
  }

  public render(output: Output) {
    log.info('Building site');
    for (const file of this.contents.files()) {
      this.renderFile(output, file);
    }
  }

  private renderFile(output: Output, file: File) {
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
    let outputPath
    if (file.name === 'index') {
      outputPath = join(file.dir, file.name + '.html');
    } else {
      outputPath = join(file.dir, file.name, 'index.html');
    }
    output.add(outputPath, renderedFile);
  }
}

export default Build;
