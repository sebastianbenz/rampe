export interface Config {
  dir: Directories;
  port: number;
}

interface Directories {
  templates: string;
  content: string;
  dist: string;
}
