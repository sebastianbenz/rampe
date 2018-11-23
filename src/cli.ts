import log from './log';
import minimist from 'minimist';
import chokidar from 'chokidar';

import Build from './build';
import { Config } from './Config';
import { serve } from './serve';
import { Pipeline } from './output/Pipeline';

export class Cli {
  private output: Pipeline;
  constructor(private config: Config) {
    this.output = Pipeline.create(this.config);
  }
  public run(argv = process.argv.slice(2)) {
    const args = minimist(argv);
    const command = args._[0] || 'build';
    log.verbose = args.verbose;
    switch (command) {
      case 'build':
        this.buildAll();
        break;
      case 'serve':
        serve(this.config.port);
        break;
      case 'watch':
        this.buildAll();
        serve(this.config.port);
        this.watch();
        break;
      default:
        log.error(`"${command}" is not a valid command!`);
    }
  }

  buildAll() {
    const build = new Build(this.config);
    build.all(this.output);
  }

  watch() {
    log.info('waiting for changes ');
    const opts = {
      ignored: /(^|[\/\\])\../,
      ignoreInitial: true,
    };
    chokidar.watch(this.config.dir.assets, opts).on('all', (event, path) => {
      log.debug('new event', event, path);
      const build = new Build(this.config);
      build.copyAssets();
    });
    chokidar.watch([this.config.dir.templates, this.config.dir.content], opts).on('all', (event, path) => {
      log.debug('new event', event, path);
      const build = new Build(this.config);
      build.render(this.output);
      build.feed(this.output);
    });
  }
}
