import { Directory } from './Directory';
import { File } from './File';
import { Node } from './Node';

export class Content {
  static create(rootDir: string): Content {
    return new Content(Directory.createRoot(rootDir));
  }
  constructor(readonly root: Node) {}

  //  [Symbol.asyncIterator]() {
  *files(): IterableIterator<File> {
    const stack = [this.root];
    while (stack.length > 0) {
      const node = stack.pop();
      if (node == null) {
        return;
      }
      if (node.isFile()) {
        yield node as File;
      }
      const children = node.children;
      for (const child of children) {
        stack.push(child);
      }
    }
  }

  *directories(): IterableIterator<Directory> {
    const stack = [this.root];
    while (stack.length > 0) {
      const node = stack.pop();
      if (node == null) {
        return;
      }
      if (node instanceof Directory) {
        yield node as Directory;
      }
      const children = node.children;
      for (const child of children) {
        stack.push(child);
      }
    }
  }
}
