import { FileSystem } from './Filesystem';
import { Node } from './Node';

export class Directory extends Node {
  get children(): Node[] {
    if (this._children == null) {
      this._children = this.fileSystem.readDir(this.path);
    }
    return this._children;
  }

  static createRoot(rootDir: string) {
    return new Directory(new FileSystem(rootDir), '');
  }
  private _children: Node[] | null = null;

  get(path: string) {
    const segments = path.split('/');
    if (segments.length === 0) {
      return [];
    }
    const child = this.children.find(c => !c.isFile() && c.name === segments[0]);
    if (child === undefined) {
      return [];
    }
    if (segments.length === 1) {
      return child.children.filter(c => c.isFile());
    }
    return child.get(segments.splice(1).join('/'));
  }
}
