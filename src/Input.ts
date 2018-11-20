import glob from 'glob';
import { promisify } from 'util';
import { File } from './File';

const globAsync = promisify(glob);

export class Input {
  private result: Promise<File[]> | null = null;
  constructor(private globPattern: string, options = {}) {}

  public async all(): Promise<File[]> {
    if (this.result == null) {
      const fileNames = await globAsync('**/*.js', {});
      this.result = Promise.resolve(fileNames.map(fileName => new File(fileName)));
    }
    return this.result;
  }
}
