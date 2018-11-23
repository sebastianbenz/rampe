import { readdirSync, readFileSync, Dirent, writeFile } from 'fs';
import { promisify } from 'util';
import { join, extname, dirname } from 'path';
import { Node } from './Node';
import { File } from './File';
import { Directory } from './Directory';
import mkdirp from 'mkdirp';

const writeFileAsync = promisify(writeFile);
const mkdirpAsync = promisify(mkdirp);

const validExtensions = new Set(['json', 'md', 'html']);

export class FileSystem {
  constructor(private rootDir='') {}

  public readDir(path: string): Node[] {
    const files = readdirSync(join(this.rootDir, path), { withFileTypes: true });
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

  public readFile(path: string): string {
    return readFileSync(join(this.rootDir, path), 'utf-8');
  }

  public async writeFile(path: string, content: string) {
    const filePath = join(this.rootDir, path);
    await mkdirpAsync(dirname(filePath));
    return writeFileAsync(filePath, content, 'utf-8');
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
