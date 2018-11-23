export interface Config {
  dir: Directories;
  optimizer: Optimizer;
  port: number;
}
interface Optimizer {
  ampUrl: string;
  imageBasePath: string;
  versionedRuntime: boolean;
}
interface Directories {
  assets: string;
  templates: string;
  content: string;
  dist: string;
}
