import log from './log';
import { join } from 'path';
import { Content } from './content/Content';
import { Config } from './Config';
import { Output } from './Output';
import { File } from './content/File';
import swig from 'swig-templates';
swig.setDefaults({ cache: false });

class Build {
  private readonly contents: Content;

  constructor(private config: Config) {
    this.contents = Content.create(config.dir.content);
  }

  public all(output: Output): void {
    this.render(output);
    this.feed(output);
  }
  public feed(putput: Output): void {
    log.info('Building feed');
  }

  public async render(output: Output) {
    for await (const file of this.contents.files()) {
      this.renderFile(output, file);
    }
  }

  private renderFile(output: Output, file: File) {
    if (file.layout.length <= 0) {
      log.warn('missing layout:', file.path);
      return;
    }
    const config = this.config;
    const templateFile = join(this.config.dir.templates, file.layout) + '.html';
    const renderedFile = swig.renderFile(templateFile, {
      config,
      file,
    });
    const outputPath = join(file.dir, file.name) + '.html';
    log.info('rendering ', outputPath, renderedFile);
    output.add(outputPath, renderedFile);
  }
}

export default Build;
