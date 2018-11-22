import { File } from './File';
import { Node } from './Node';
import { Directory } from './Directory';

export class Content {
  static create(rootDir: string): any {
    return new Content(Directory.createRoot(rootDir));
  }
  constructor(public readonly root: Node) {}

  //  [Symbol.asyncIterator]() {
  public *files(): IterableIterator<File> {
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
      for (let i = 0; i < children.length; i++) {
        stack.push(children[i]);
      }
    }
  }
}
