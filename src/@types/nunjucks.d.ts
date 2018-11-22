declare module 'nunjucks' {
  export function configure(path: string, opts: any): any;
  export function render(path: string, opts: any): string;
  export function renderString(path: string, opts: any): string;
}
