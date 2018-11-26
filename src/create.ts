import slugify from '@sindresorhus/slugify';
import { join } from 'path';
import { Config } from './Config';
import { DATE_STRING_LENGTH } from './content/File';
import { FileSystem } from './content/Filesystem';
import { log } from './log';

export function createContent(fileSystem: FileSystem, title: string, dir: string, config: Config) {
  const date = new Date().toISOString().substring(0, DATE_STRING_LENGTH);
  const fileName = date + '-' + slugify(title) + '.md';

  const content = `title: ${title}
date: ${date}
layout: ${config.defaultLayout}
---

Here we go ...`;
  const filePath = join(dir, fileName);
  fileSystem.writeFile(filePath, content);
  log.info('creating', filePath);
}
