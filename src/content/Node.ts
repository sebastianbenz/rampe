import { basename } from 'path';
import { parse } from 'path';
import { FileSystem } from './Filesystem';

export abstract class Node {
  readonly ext: string;
  readonly dir: string;
  readonly name: string;

  constructor(protected readonly fileSystem: FileSystem, readonly path: string) {
    const parsedPath = parse(path);
    this.ext = parsedPath.ext ? parsedPath.ext.substring(1) : '';
    this.dir = parsedPath.dir;
    this.name = parsedPath.name;
  }

  abstract get children(): Node[];

  isFile() {
    return false;
  }

  get(path: string): Node[] {
    return [];
  }
}
