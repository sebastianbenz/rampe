import { Cli } from './Cli';
import config from './config.json';
import { Config } from './Config';

const cli = new Cli((config as unknown) as Config);
cli.run();
