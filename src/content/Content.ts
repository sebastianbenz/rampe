import glob from 'glob';
import { promisify } from 'util';
import { File } from './File';

const globAsync = promisify(glob);

export class Content {
  private result: Promise<File[]> | null = null;
  constructor(private globPattern: string, options = {}) {}
}
