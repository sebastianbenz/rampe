import { FileSystem } from './content/Filesystem';

export class Output {
  static create(destDir: string): any {
    return new Output(new FileSystem(destDir));
  }

  constructor(private fileSystem: FileSystem) {}

  add(path: string, content: string) {
    this.fileSystem.writeFile(path, content);
  }
}
