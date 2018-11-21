import {basename} from 'path';
import { FileSystem } from './Filesystem';

export abstract class Node {
  constructor(
    protected readonly fileSystem: FileSystem, 
    public readonly path: string
    ) {}

  get name() {
    return basename(this.path)
  }

  public abstract children(): Promise<Node[]>

  public isFile() {
    return false
  }
}
