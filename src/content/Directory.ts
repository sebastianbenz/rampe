import { Node } from './Node';
import { FileSystem } from './Filesystem';

export class Directory extends Node {
  private _children: Node[] | null = null;

  public static createRoot(rootDir: string) {
    return new Directory(new FileSystem(rootDir), '');
  }

  public get children(): Node[] {
    if (this._children == null) {
      this._children = this.fileSystem.readDir(this.path);
    }
    return this._children;
  }

  public get(path: string) {
    const segments = path.split('/');
    if (segments.length === 0) {
      return [];
    }
    const child = this.children.find(child => !child.isFile() && child.name === segments[0]);
    if (child === undefined) {
      return [];
    }
    if (segments.length === 1) {
      return child.children.filter(child => child.isFile());
    }
    return child.get(segments.splice(1).join('/'));
  }
}
