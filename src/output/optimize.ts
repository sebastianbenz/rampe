import { Pipeline } from './Pipeline';
import { TargetFile } from './TargetFile';
import { Config } from '../Config';
import { join, dirname } from 'path';
import log from '../log';

import ampOptimizer from 'amp-toolbox-optimizer';
import runtimeVersion from 'amp-toolbox-runtime-version';
import { File } from '../content/File';

const AMP_PATH = 'amp';

export async function optimize(pipeline: Pipeline, file: TargetFile, config: Config): Promise<TargetFile> {
  if (!(await file.isAmp)) {
    return file;
  }
  const canonicalPath = file.path;
  file.path = join(dirname(canonicalPath), config.optimizer.ampUrl || 'amp', 'index.html');
  const ampUrl = join((file.source as File).url, config.optimizer.ampUrl || 'amp');
  const ampRuntimeVersion = await runtimeVersion.currentVersion();

  const optimizedContent = await ampOptimizer.transformHtml(file.content, {
    ampUrl,
    ampRuntimeVersion,
    imageBasePath: config.optimizer.imageBasePath || config.dir.assets,
  });
  const optimized = TargetFile.create(canonicalPath, optimizedContent, file.source);
  log.debug('Serving optimized AMP from', optimized.path);
  pipeline.add(optimized);
  log.debug('Serving valid     AMP from', file.path);
  return file;
}
