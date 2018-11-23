import { Pipeline } from './Pipeline';
import { TargetFile } from './TargetFile';
import { Config } from '../Config';

export default interface PipelineStep {
  (pipeline: Pipeline, file: TargetFile, config: Config): Promise<TargetFile>;
}
