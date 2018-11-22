import { readFile } from 'fs';
import { promisify } from 'util';
import { join } from 'path';
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

  public readonly url: string
  public readonly layout: string | undefined
  public readonly content: string

  constructor(protected readonly fileSystem: FileSystem, public readonly path: string) {
    super(fileSystem, path);
    this.url = join(this.dir, this.name)
    const fileString = this.fileSystem.readFile(this.path);
    switch (this.ext) {
      case 'json':
        this.addProperties(JSON.parse(fileString));
        this.content = '';
        break;
      case 'html':
        this.content = fileString;
      case 'md':
        const segments = this.parseFrontMatter(fileString)
        this.addProperties(segments.frontMatter);
        this.content = marked(segments.content as string);
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
    return {
      content: fileContent.substring(frontMatterEnd + FRONT_MATTER_END.length),
      frontMatter: yaml.safeLoad(frontMatterString),
    }
  }

  private addProperties(obj: {}) {
    Object.assign(this, obj);
  }
}
