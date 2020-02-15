import { Parser } from './Parser';

export class Core {
  constructor(private input: string) {
  }

  compute() {
    const parser = new Parser(this.input);
    console.log(parser.parse());
    return 'this was computed';
  }
}
