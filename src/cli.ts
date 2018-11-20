import minimist from 'minimist';

import Build from './build';
import theConfig from './config.json';

class Cli {
  private build: Build;
  constructor(config: {}) {
    this.build = new Build(config);
  }
  public run(argv = process.argv) {
    const args = minimist(argv);
    const command = args._[0] || 'help';
    switch (command) {
      case 'build':
        return this.build.all();
      default:
        return Promise.reject(new Error(`"${command}" is not a valid command!`));
    }
  }
}

export default new Cli(theConfig);
