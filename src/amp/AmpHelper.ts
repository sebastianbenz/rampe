import { Parser } from 'htmlparser2';

export function isAmp(htmlString: string): Promise<boolean> {
  return new Promise<boolean>(resolve => {
    let result = false;
    const parser = new Parser({
      onopentag: (name, attribs) => {
        if (name === 'html' && (attribs.hasOwnProperty('amp') || attribs.hasOwnProperty('⚡'))) {
          result = true;
          parser.end();
        }
      },

      onend: () => {
        resolve(result);
      },
    });
    parser.write(htmlString);
    parser.end();
  });
}
