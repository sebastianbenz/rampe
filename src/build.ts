import log from './log';
import { Content } from './content/Content';
import { Config } from './Config';

class Build {
  private readonly contents: Content;

  constructor(private config: Config) {
    this.contents = Content.create(config.dir.content);
  }

  public all(): void {
    this.render();
    this.feed();
  }
  public feed(): void {
    log.info('Building feed');
  }
  public async render() {
    for await (const node of this.contents.loop()) {
      log.info('rendering ', node.path);
      console.log(node.path)
    }
  }
}

export default Build;
