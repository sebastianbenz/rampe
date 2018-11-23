export interface Config {
  dir: Directories;
  port: number;
}

interface Directories {
  assets: string;
  templates: string;
  content: string;
  dist: string;
}
