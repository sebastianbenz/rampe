import { readdir } from 'fs';
import { promisify } from 'util';
import { Node } from './Node';
import { FileSystem } from './Filesystem';

const readDirAsync = promisify(readdir);

export class Root extends Node {
  public static create(rootDir: string) {
    return new Root(new FileSystem(rootDir), '');
  }
}
