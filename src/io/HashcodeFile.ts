import * as fs from 'fs';
import * as glob from 'glob';

export class HashcodeFile {
  constructor(public path: string) {
  }

  static glob(pattern: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      glob(pattern, (err, files) => {
        err ? reject(err) : resolve(files);
      });
    });
  }

  read() {
    return new Promise<string>((resolve, reject) => {
      fs.readFile(this.path, (err, data) => err ? reject(err) : resolve(data.toString()));
    });
  }

  write(content: string) {
    return new Promise(((resolve, reject) => {
      fs.writeFile(this.path, content, err => err ? reject(err) : resolve());
    }));
  }
}
