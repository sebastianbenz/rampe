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

  readonly content: string;
  readonly date: Date;
  readonly description = '';
  readonly image = '';
  readonly layout: string | undefined;
  readonly url: string;
  readonly title = '';
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
    const frontMatterProperties = yaml.safeLoad(frontMatterString);
    if (frontMatterProperties.date !== undefined) {
      frontMatterProperties.date = this.parseDate(frontMatterProperties.date, true);
    }
    return {
      content: fileContent.substring(frontMatterEnd + FRONT_MATTER_END.length),
      frontMatter: frontMatterProperties,
    };
  }

  private addProperties(obj: {}) {
    Object.assign(this, obj);
  }

  private initDate(fileName: string) {
    const dateString = fileName.substring(0, DATE_STRING_LENGTH);
    return this.parseDate(dateString);
  }

  private parseDate(dateString: string, showErrorIfInvalid=false) {
    const timestamp = Date.parse(dateString);
    if (!isNaN(timestamp)) {
      return new Date(timestamp);
    }
    if (showErrorIfInvalid) {
      log.error('Invalid date', dateString, this.path);
    }
    // fallback to current date
    return new Date();
  }
}
