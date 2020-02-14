import { HashcodeFile } from './HashcodeFile';
import Logger from './Logger';

export class OutputFile extends HashcodeFile {
  constructor(fileName: string) {
    super(`out/${fileName}`);
  }

  write(content: string): Promise<unknown> {
    Logger.info(`Writing ${this.path.gray}`);
    return super.write(content);
  }
}
