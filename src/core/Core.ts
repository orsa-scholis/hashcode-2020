import { Parser } from './Parser';
import { Outputter } from './Outputter';
import { BookDuplicateCounter } from './BookDuplicateCounter';

export class Core {
  constructor(private input: string) {}

  compute() {
    const parser = new Parser(this.input);
    const context = parser.parse();
    const duplicates = BookDuplicateCounter.bookDuplicates(context);
    const libs = context.libraries.map(library =>
      library.calculateScore(duplicates)
    );
    const sorted = libs.sort((a, b) => b.score - a.score);
    return Outputter.convertOutput(sorted);
  }
}
