import log from './log';
import minimist from 'minimist';

import Build from './build';
import { Config } from './Config';
import { serve } from './serve';
import theConfig from './config.json';

export class Cli {
  private build: Build;
  constructor(private config: Config) {
    this.build = new Build(config);
  }
  public run(argv = process.argv.slice(2)) {
    const args = minimist(argv);
    const command = args._[0] || 'help';
    switch (command) {
      case 'build':
        this.build.all();
        break;
      case 'serve':
        serve(this.config.port);
        break;
      default:
        log.error(`"${command}" is not a valid command!`);
    }
  }
}
