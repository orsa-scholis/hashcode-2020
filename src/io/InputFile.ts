import { HashcodeFile } from './HashcodeFile';
import Logger from "./Logger";

export class InputFile extends HashcodeFile {
  constructor(fileName: string) {
    super(`data/${fileName}`);
  }

  async read() {
    Logger.info(`Reading ${this.path.gray}`);
    return super.read();
  }
}
