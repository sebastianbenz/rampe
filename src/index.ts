import { Cli } from './Cli';
import { Config } from './Config';
import config from './config.json';

const cli = new Cli((config as unknown) as Config);
cli.run();
