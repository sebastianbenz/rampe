import path from 'path';
import { FileSystem } from './Filesystem';

export abstract class Node {
  constructor(protected fileSystem: FileSystem, public path: string) {}
}
