declare module 'serve-handler' {
  import * as http from 'http';
  export default function(request: http.IncomingMessage, response: http.ServerResponse, config: {}): any;
}
