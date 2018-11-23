import { File } from '../content/File';
import { isAmp } from '../amp/AmpHelper';
import log from '../log';

export class TargetFile {
  static create(path: string, content: string, source: File): TargetFile {
    return new TargetFile(path, content, source);
  }

  public isAmp: Promise<boolean>;

  constructor(public readonly path: string, public readonly content: string, public readonly source: File) {
    this.isAmp = isAmp(content);
  }
}
