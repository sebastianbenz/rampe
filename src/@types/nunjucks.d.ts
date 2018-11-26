declare module 'nunjucks' {
  export function configure(path: string, opts: any): any;
  export function render(path: string, opts: any): string;
  export function renderString(path: string, opts: any): string;
  export class Environment {
    constructor(loader: any);
    addFilter(name: string, filter: any): void;
    configure(path: string, opts: any): any;
    render(path: string, opts: any): string;
    renderString(path: string, opts: any): string;
  }
  export class FileSystemLoader {
    constructor(path: string);
  }
}
