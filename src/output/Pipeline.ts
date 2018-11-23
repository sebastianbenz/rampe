import { FileSystem } from '../content/Filesystem';
import PipelineStep from './PipelineStep';
import { TargetFile } from './TargetFile';
import { validate } from './validate';
import { optimize } from './optimize';
import { Config } from '../Config';

const DEFAULT_PIPELINE = [validate, optimize];

export class Pipeline {
  static create(config: Config, steps: PipelineStep[] = DEFAULT_PIPELINE): Pipeline {
    return new Pipeline(new FileSystem(config.dir.dist), config, steps);
  }

  constructor(private readonly fileSystem: FileSystem, public readonly config: Config, private readonly steps: PipelineStep[]) {}

  public async add(targetFile: TargetFile) {
    for (const step of this.steps) {
      targetFile = await step(this, targetFile, this.config);
    }
    return this.fileSystem.writeFile(targetFile.path, targetFile.content);
  }
}
