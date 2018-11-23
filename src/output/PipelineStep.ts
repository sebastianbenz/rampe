import { Pipeline } from './Pipeline';
import { TargetFile } from './TargetFile';

export default interface PipelineStep {
  (pipeline: Pipeline, file: TargetFile): Promise<TargetFile>;
}
