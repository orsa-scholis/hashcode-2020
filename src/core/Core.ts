import { Parser } from './Parser';
import { Outputter } from './Outputter';
import { BookDuplicateCounter } from './BookDuplicateCounter';
import { FilterService } from './FilterService';

export class Core {
  constructor(private input: string) {}

  compute() {
    const parser = new Parser(this.input);
    const context = parser.parse();
    const duplicates = BookDuplicateCounter.bookDuplicates(context);
    const libs = context.libraries.map(library =>
      library.calculateScore(duplicates)
    );
    let sorted = libs.sort((a, b) => b.score - a.score);
    sorted = FilterService.filterDuplicates(sorted);
    return Outputter.convertOutput(sorted);
  }
}
