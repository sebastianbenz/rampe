import log from './log';
import { Directory } from './content/Directory';
import { Config } from './Config';

class Build {
  content: any;

  constructor(private config: Config) {
    this.content = Directory.createRoot(config.dir.content);
  }

  public all(): void {
    this.render();
    this.feed();
  }
  public feed(): void {
    this.content.children();
    log.info('Building feed');
  }
  public render(): void {
    log.info('Building site');
  }
}

export default Build;
