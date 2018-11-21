export interface Config {
  dir: Directories;
  port: number;
}

interface Directories {
  template: string;
  content: string;
  dist: string;
}
