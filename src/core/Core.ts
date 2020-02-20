import { Parser } from './Parser';
import { Outputter } from './Outputter';

export class Core {
  constructor(private input: string) {}

  compute() {
    const parser = new Parser(this.input);
    const context = parser.parse();
    console.log(context);
    return Outputter.convertOutput(context.libraries);
  }
}
