import { File } from '../content/File';
import { isAmp } from '../amp/AmpHelper';
import { Node } from '../content/Node';

export class TargetFile {
  static create(path: string, content: string, source: Node): TargetFile {
    return new TargetFile(path, content, source);
  }

  isAmp: Promise<boolean>;

  constructor(public path: string, public content: string, readonly source: Node) {
    this.isAmp = isAmp(content);
  }
}
