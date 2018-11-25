import { Pipeline } from './Pipeline';
import { TargetFile } from './TargetFile';
import log from '../log';

import amphtmlValidator from 'amphtml-validator';
import { File } from '../content/File';

export async function validate(pipeline: Pipeline, file: TargetFile): Promise<TargetFile> {
  if (!(await file.isAmp)) {
    return file;
  }
  if (file.source.isFile() && !(file.source as File).validate) {
    return file
  }
  const validator = await amphtmlValidator.getInstance();
  const result = validator.validateString(file.content);
  if (result.status !== 'PASS') {
     log.error('validation for', file.path, result.status);
  }
  let hasError = false;
  for (let i = 0; i < result.errors.length; i++) {
    const error = result.errors[i];
    let msg = 'line ' + error.line + ', col ' + error.col + ': ' + error.message;
    if (error.specUrl !== null) {
      msg += ' (see ' + error.specUrl + ')';
    }
    if (error.severity === 'ERROR') {
      log.error(msg);
      hasError = true;
    } else {
      log.warn(msg);
    }
  }
  return file;
}
