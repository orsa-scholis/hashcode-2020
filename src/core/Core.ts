import { Parser } from './Parser';

export class Core {
  constructor(private input: string) {}

  compute() {
    const parser = new Parser(this.input);
    const context = parser.parse();
    console.log(context);
    context.libraries.map((lib) => console.log(lib.books));
    return 'this was computed';
  }
}
