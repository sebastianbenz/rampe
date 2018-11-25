export interface Config {
  host: string;
  favicon: string;
  copyright: string;
  defaultLayout: 'post';
  author: Author;
  dir: Directories;
  optimizer: Optimizer;
  port: number;
}
interface Author {
  name: string,
  email?: string,
  link?: string,

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
