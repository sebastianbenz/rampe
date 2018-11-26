import log from './log';
import minimist from 'minimist';
import chokidar from 'chokidar';

import Build from './build';
import { FileSystem } from './content/Filesystem';
import { Config } from './Config';
import { serve } from './serve';
import { createContent } from './create';
import { Pipeline } from './output/Pipeline';

export class Cli {
  private output: Pipeline;
  constructor(private config: Config) {
    this.output = Pipeline.create(this.config);
  }
  public async run(argv = process.argv.slice(2)) {
    const args = minimist(argv);
    const command = args._[0] || 'build';
    log.verbose = args.verbose;
    switch (command) {
      case 'build':
        this.buildAll();
        break;
      case 'create':
        const title = args._[1];
        if (!title) {
          log.error('title missing');
          return;
        }
        const dir = args.d || args.dir || '';
        createContent(new FileSystem(), title, dir, this.config);
        break;
      case 'serve':
        serve(this.config.port);
        break;
      case 'watch':
        await this.buildAll();
        serve(this.config.port);
        this.watch();
        break;
      default:
        log.error(`"${command}" is not a valid command!`);
    }
  }

  async buildAll() {
    const build = new Build(this.config);
    try {
      await build.all(this.output);
    } catch (err) {
      log.error('Build failed', err);
    }
  }

  watch() {
    log.info('waiting for changes ');
    const opts = {
      ignored: /(^|[\/\\])\../,
      ignoreInitial: true,
    };
    chokidar.watch(this.config.dir.assets, opts).on('all', (event, path) => {
      log.debug('new event', event, path);
      try {
        const build = new Build(this.config);
        build.copyAssets();
      } catch (err) {
        log.error('Build failed', err);
      }
    });
    chokidar.watch([this.config.dir.templates, this.config.dir.content], opts).on('all', async (event, path) => {
      log.debug('new event', event, path);
      try {
        const build = new Build(this.config);
        await build.render(this.output);
        build.feed(this.output);
      } catch (err) {
        log.error('Build failed', err);
      }
    });
  }
}
