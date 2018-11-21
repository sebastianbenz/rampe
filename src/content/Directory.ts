import { Node } from './Node';
import { FileSystem } from './Filesystem';

export class Directory extends Node {
  private _children: Promise<Node[]> | null = null;

  public static createRoot(rootDir: string) {
    return new Directory(new FileSystem(rootDir), '');
  }

  public children(): Promise<Node[]> {
    if (this._children == null) {
      this._children = this.fileSystem.readDir(this.path);
    }
    return this._children;
  }
}
