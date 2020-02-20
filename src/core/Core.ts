import { Parser } from './Parser';
import { Outputter } from './Outputter';
import { BookDuplicateCounter } from './BookDuplicateCounter';
import { FilterService } from './FilterService';
import { LibraryStatistics } from './LibraryStatistics';

export class Core {
  constructor(private input: string) {}

  compute() {
    const parser = new Parser(this.input);
    const context = parser.parse();
    const duplicates = BookDuplicateCounter.bookDuplicates(context);
    const signupAverage = LibraryStatistics.averageSignUpTime(context);
    const libs = context.libraries.map(library =>
      library.calculateScore(duplicates, signupAverage)
    );
    let sorted = libs.sort((a, b) => b.score - a.score);
    sorted = FilterService.filterDuplicates(sorted);
    return Outputter.convertOutput(FilterService.removeEmptyShit(sorted));
  }
}
