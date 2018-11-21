import { readdir, readFile, Dirent } from 'fs';
import { promisify } from 'util';
import { join, extname } from 'path';
import { Node } from './Node';
import { File } from './File';
import { Directory } from './Directory';

const readDirAsync = promisify(readdir);
const readFileAsync = promisify(readFile);

const validExtensions = new Set(['json', 'md', 'html']);

export class FileSystem {
  constructor(private rootDir: string) {}

  public async readDir(path: string): Promise<Node[]> {
    const files = await readDirAsync(join(this.rootDir, path), { withFileTypes: true });
    const nodes = files.filter(this.isSupported).map(
      (file): Node => {
        if (file.isDirectory()) {
          return new Directory(this, join(path, file.name));
        }
        if (file.isFile()) {
          return new File(this, join(path, file.name));
        }
        throw new Error(`Unsupported file type ${file}. This should not happen.`);
      },
    );
    return nodes;
  }

  readFile(path: string): Promise<string> {
    return readFileAsync(join(this.rootDir, path), 'utf-8');
  }

  private isSupported(file: Dirent) {
    if (file.isDirectory()) {
      return true;
    }
    if (!file.isFile()) {
      return false;
    }
    if (file.name.startsWith('.')) {
      return false;
    }
    return validExtensions.has(extname(file.name).substring(1));
  }
}
