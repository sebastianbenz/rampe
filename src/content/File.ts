import { readFile } from 'fs';
import hljs from 'highlight.js';
import yaml from 'js-yaml';
import marked from 'marked';
import { extname, join } from 'path';
import { promisify } from 'util';
import { log } from '../log';
import { FileSystem } from './Filesystem';
import { Node } from './Node';

const FRONT_MATTER_END = '---';
export const DATE_STRING_LENGTH = '2018-11-26T09:59'.length;
const VALID_EXTENSIONS = new Set(['.json', '.md', '.html']);

marked.setOptions({
  highlight: (code, lang) => {
    if (lang) {
      return hljs.highlight(lang, code).value;
    } else {
      return hljs.highlightAuto(code).value;
    }
  },
});

const readFileAsync = promisify(readFile);

export class File extends Node {
  static isSupported(fileName: string) {
    return VALID_EXTENSIONS.has(extname(fileName));
  }

  readonly url: string;
  readonly title = '';
  readonly description = '';
  readonly image = '';
  readonly date: Date;
  readonly layout: string | undefined;
  readonly content: string;
  readonly validate = true;

  constructor(protected readonly fileSystem: FileSystem, readonly path: string) {
    super(fileSystem, path);
    this.url = '/' + join(this.dir, this.name);
    const fileString = this.fileSystem.readFile(path);
    this.date = this.initDate(path);
    switch (this.ext) {
      case 'json':
        this.content = '';
        this.addProperties(JSON.parse(fileString));
        break;
      case 'html':
        this.content = fileString;
      case 'md':
        const segments = this.parseFrontMatter(fileString);
        this.content = fileString ? marked(segments.content as string) : '';
        this.addProperties(segments.frontMatter);
        break;
      default:
        throw new Error('Unsupported file type');
    }
  }

  get children() {
    return [];
  }

  isFile() {
    return true;
  }

  private parseFrontMatter(fileContent: string) {
    const frontMatterEnd = fileContent.indexOf(FRONT_MATTER_END);
    if (frontMatterEnd === -1) {
      return {
        content: fileContent,
        frontMatter: {},
      };
    }
    const frontMatterString = fileContent.substring(0, frontMatterEnd);
    return {
      content: fileContent.substring(frontMatterEnd + FRONT_MATTER_END.length),
      frontMatter: yaml.safeLoad(frontMatterString),
    };
  }

  private addProperties(obj: {}) {
    Object.assign(this, obj);
  }

  private initDate(fileName: string) {
    const dateString = fileName.substring(0, DATE_STRING_LENGTH);
    const timestamp = Date.parse(dateString);
    if (isNaN(timestamp)) {
      log.debug('No valid date', this.path);
      return new Date();
    }
    return new Date(timestamp);
  }
}
