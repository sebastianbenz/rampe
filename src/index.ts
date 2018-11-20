import log from './log';
log.verbose = true;
log.info('info');
log.warn('warn');
log.error('error');
log.debug('debug');
log.debug('debug', { test: 'asdfasd' });

import { Input } from './Input';

const input = new Input('**/*.*');

input.all().then(files => {
  files.forEach(async f => {
    log.info(f.path);
    log.info(await f.content);
  });
});
