class Log {
  private prefix: string;
  constructor(private tag = '', public verbose = false, private output = console) {
    this.prefix = this.inverse(tag);
  }

  public debug(message: string, ...args: any): void {
    if (!this.verbose) {
      return;
    }
    this.log(this.dim(message), args);
  }

  public info(message: string, ...args: any): void {
    this.log(message, args);
  }

  public warn(message: string, ...args: any): void {
    this.log(this.yellow('WARNING ' + message), args);
  }

  public error(message: string, ...args: any): void {
    this.output.log('\n');
    this.log(this.red('ERROR ' + message), args);
    this.output.log('\n');
  }

  private log(message: string, args: any) {
    if (this.prefix) {
      message = this.prefix + ' ' + message;
    }
    if (args) {
      this.output.log(message, ...args);
    } else {
      this.output.log(message);
    }
  }

  private inverse(s: string) {
    return `\x1b[7m${s}\x1b[0m`;
  }

  private dim(s: string) {
    return `\x1b[36m${s}\x1b[0m`;
  }

  private yellow(s: string) {
    return `\x1b[33m${s}\x1b[0m`;
  }

  private red(s: string) {
    return `\x1b[31m${s}\x1b[0m`;
  }
}

export default new Log('Rampe');
