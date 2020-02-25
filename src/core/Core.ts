import { Parser } from './Parser';
import { Outputter } from './Outputter';
import { BookDuplicateCounter } from './BookDuplicateCounter';
import { FilterService } from './FilterService';
import { LibraryStatistics } from './LibraryStatistics';

export class Core {
  constructor(private input: string, private fileName: string) {}

  compute() {
    const parsingLabel = `[TIME]: Parsing "${this.fileName}"`;
    const magicLabel = `[TIME]: Magic "${this.fileName}"`;
    console.time(parsingLabel);
    const parser = new Parser(this.input);
    const context = parser.parse();
    console.timeEnd(parsingLabel);
    console.time(magicLabel);
    const duplicates = BookDuplicateCounter.bookDuplicates(context);
    const signupAverage = LibraryStatistics.averageSignUpTime(context);
    const libs = context.libraries.map(library =>
      library.calculateScore(duplicates, signupAverage)
    );
    let sorted = libs.sort((a, b) => b.score - a.score);
    sorted = FilterService.filterDuplicates(sorted);
    console.timeEnd(magicLabel);
    return Outputter.convertOutput(FilterService.removeEmptyShit(sorted));
  }
}
