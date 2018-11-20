import { readFile } from 'fs';
import { promisify } from 'util';

const readFileAsync = promisify(readFile);

export class File {
  private mContent: Promise<string> | null;

  constructor(public path: string, content: string | null = null) {
    if (content == null) {
      this.mContent = null;
    } else {
      this.mContent = Promise.resolve(content);
    }
  }

  get content(): Promise<string> {
    if (!this.mContent) {
      this.mContent = readFileAsync(this.path, 'utf-8');
    }
    return this.mContent;
  }
}
