import { File } from './File';
import { Node } from './Node';
import { Directory } from './Directory';

export class Content {
  static create(rootDir: string): any {
      return new Content(Directory.createRoot(rootDir))
  }
  constructor(private root: Node) {}

//  [Symbol.asyncIterator]() {
    public async * loop() : AsyncIterableIterator<Node> {
      const stack = [this.root];
      while (stack.length > 0) {
        const node = stack.pop()
        if (node == null) {
          return
        }
        if (node.isFile()) {
          yield node
        }
        const children = await node.children()
        for (let i = 0; i <  children.length; i++) {
          stack.push(children[i])
        }

      }
    }
   }


