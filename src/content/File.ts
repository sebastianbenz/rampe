import { readFile } from 'fs';
import { promisify } from 'util';
import { join, extname } from 'path';
import { Node } from './Node';
import marked from 'marked';
import hljs from 'highlight.js';
import yaml from 'js-yaml';
import { FileSystem } from './Filesystem';
import log from '../log';

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
  static isSupported(fileName: string): any {
    return VALID_EXTENSIONS.has(extname(fileName));
  }

  public readonly url: string;
  public readonly title = '';
  public readonly description = '';
  public readonly image = '';
  public readonly date: Date;
  public readonly layout: string | undefined;
  public readonly content: string;
  public readonly validate = true;

  constructor(protected readonly fileSystem: FileSystem, public readonly path: string) {
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

  public get children() {
    return [];
  }

  public isFile() {
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
