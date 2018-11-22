import { readFile } from 'fs';
import { promisify } from 'util';
import { Node } from './Node';
import marked from 'marked';
import hljs from 'highlight.js';
import yaml from 'js-yaml';
import { FileSystem } from './Filesystem';

const FRONT_MATTER_END = '---';

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
  [key: string]: any;

  constructor(protected readonly fileSystem: FileSystem, public readonly path: string) {
    super(fileSystem, path);
    this.loadContent();
    this.url = path;
  }

  private loadContent(): void {
    const fileString = this.fileSystem.readFile(this.path);
    switch (this.ext) {
      case 'json':
        this.addProperties(JSON.parse(fileString));
        this.content = '';
        break;
      case 'html':
        this.content = fileString;
      case 'md':
        this.addProperties(this.parseFrontMatter(fileString));
        this.content = marked(fileString);
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
      return {};
    }
    const frontMatterString = fileContent.substring(0, frontMatterEnd);
    return yaml.safeLoad(frontMatterString);
  }

  private addProperties(obj: {}) {
    Object.assign(this, obj);
    console.log(this.path, this.layout);
  }
}
