import { basename } from 'path';
import { FileSystem } from './Filesystem';
import { parse } from 'path';

export abstract class Node {
  public readonly ext: string;
  public readonly dir: string;
  public readonly name: string;

  constructor(protected readonly fileSystem: FileSystem, public readonly path: string) {
    const parsedPath = parse(path);
    this.ext = parsedPath.ext ? parsedPath.ext.substring(1) : '';
    this.dir = parsedPath.dir;
    this.name = parsedPath.name;
  }

  public abstract get children(): Node[];

  public isFile() {
    return false;
  }

  public get(path: string): Node[] {
    return [];
  }
}
