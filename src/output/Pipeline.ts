import { Config } from '../Config';
import { FileSystem } from '../content/Filesystem';
import { optimize } from './optimize';
import { TargetFile } from './TargetFile';
import { validate } from './validate';

const DEFAULT_PIPELINE = [validate, optimize];

export class Pipeline {
  static create(config: Config, steps: pipelineStep[] = DEFAULT_PIPELINE): Pipeline {
    return new Pipeline(new FileSystem(config.dir.dist), config, steps);
  }

  constructor(private readonly fileSystem: FileSystem, readonly config: Config, private readonly steps: pipelineStep[]) {}

  async add(targetFile: TargetFile) {
    for (const step of this.steps) {
      targetFile = await step(this, targetFile, this.config);
    }
    return this.fileSystem.writeFile(targetFile.path, targetFile.content);
  }
}

export type pipelineStep = (pipeline: Pipeline, file: TargetFile, config: Config) => Promise<TargetFile>;
