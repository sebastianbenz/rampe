import { readFile } from 'fs';
import { promisify } from 'util';
import { Node } from './Node';

const readFileAsync = promisify(readFile);

export class File extends Node {
  private _content: Promise<string> | null = null;

  get title() {
    return 'The Title';
  }
  get layout() {
    return 'index';
  }
  get content(): Promise<string> {
    if (this._content == null) {
      this._content = this.fileSystem.readFile(this.path);
    }
    return this._content;
  }

  public children(): Promise<Node[]> {
    return Promise.resolve([]);
  }

  public isFile() {
    return true;
  }
}
