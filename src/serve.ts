import http from 'http';
import handler from 'serve-handler';

import log from './log';

export const serve = (port: number) => {
  const server = http.createServer((request: any, response: any) => {
    return handler(request, response, {
      public: 'public',
    });
  });

  server.listen(port, () => {
    log.info(`Running at http://localhost:${port}`);
  });
};
