import { FileSystem } from '../content/Filesystem';
import PipelineStep from './PipelineStep';
import { TargetFile } from './TargetFile';
import { validate } from './Validation';

const DEFAULT_PIPELINE = [validate];

export class Pipeline {
  static create(destDir: string, steps: PipelineStep[] = DEFAULT_PIPELINE): Pipeline {
    return new Pipeline(new FileSystem(destDir), steps);
  }

  constructor(private readonly fileSystem: FileSystem, private readonly steps: PipelineStep[]) {}

  public async add(targetFile: TargetFile) {
    for (const step of this.steps) {
      targetFile = await step(this, targetFile);
    }
    return this.fileSystem.writeFile(targetFile.path, targetFile.content);
  }
}
