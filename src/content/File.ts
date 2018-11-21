import { readFile } from 'fs';
import { promisify } from 'util';
import { Node } from './Node';

const readFileAsync = promisify(readFile);

export class File extends Node {
  private _content: Promise<string> | null = null;

  get content(): Promise<string> {
    if (this._content == null) {
      this._content = this.fileSystem.readFile(this.path);
    }
    return this._content;
  }
}
