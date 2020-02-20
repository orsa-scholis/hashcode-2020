import { Parser } from './Parser';
import { Outputter } from './Outputter';
import { Context } from '../models/Context';
import { Book } from '../models/Book';
import { sum } from 'lodash';
import { Library } from '../models/Library';

export class Core {
  constructor(private input: string) {}

  compute() {
    //console.log([1,2,3,4].sort((a,b) => b - a).slice(0,3));

    const parser = new Parser(this.input);
    const context: Context = parser.parse();
    //console.log(context);
    //context.libraries.map(lib => console.log(lib.books));

    let S = 0;
    let T = 0;
    //let usedBookIds = [];
    let isBookIdUsed: boolean[] = new Array<boolean>(context.books.length);
    let isLibraryIdUsed: boolean[] = new Array<boolean>(
      context.libraries.length
    );
    //let usedLibraryIds = [];
    let usedLibraries: Library[] = [];
    while (T < context.deadline) {
      let max = 0;
      let maxLibrary: Library = null;

      Inner: for (let library of context.libraries) {
        if (isLibraryIdUsed[library.id]) continue Inner;

        let scannableDays = context.deadline - library.signupTime - T;
        if (scannableDays <= 0) continue Inner;





        let scannableBooksAmount = scannableDays * library.maxScansPerDay;
        let tempBooks = library.books.filter(
          (book: Book) => !isBookIdUsed[book.id]
        );

        // Check second library
        let tempT = T + library.signupTime;
        let tempMax = 0;
        //let tempMaxLibrary = null;
        isLibraryIdUsed[library.id] = true;
        tempBooks.forEach(b => (isBookIdUsed[b.id] = true));
        for (let innerLibrary of context.libraries) {
          if (isLibraryIdUsed[innerLibrary.id]) continue;

          let innerscannableDays = context.deadline - innerLibrary.signupTime - tempT;
          if (innerscannableDays <= 0) continue;

          let innerscannableBooksAmount = innerscannableDays * innerLibrary.maxScansPerDay;
          let innertempBooks = innerLibrary.books.filter(
            (book: Book) => !isBookIdUsed[book.id]
          );
          //innerLibrary.booksToScan = tempBooks;
          let innerResult = sum(
            innertempBooks
              .map(b => b.score)
              .sort((a, b) => b - a)
              .slice(0, innerscannableBooksAmount)
          );
          //console.log(result + " points for library " + library.id);
          if (innerResult >= tempMax) {
            tempMax = innerResult;
            //maxLibrary = library;
          }
        }
        tempBooks.forEach(b => (isBookIdUsed[b.id] = false));
        isLibraryIdUsed[library.id] = false;
        let result = tempMax;


        library.booksToScan = tempBooks;
        result += sum(
          tempBooks
            .map(b => b.score)
            .sort((a, b) => b - a)
            .slice(0, scannableBooksAmount)
        );
        //console.log(result + " points for library " + library.id);
        if (result >= max) {
          max = result;
          maxLibrary = library;
        }
      }
      if (maxLibrary == null) break;

      isLibraryIdUsed[maxLibrary.id] = true;
      maxLibrary.booksToScan.forEach(b => (isBookIdUsed[b.id] = true));

      T += maxLibrary.signupTime;
      S += max;
      usedLibraries.push(maxLibrary);
      console.log('New T: ' + T);
    }

    //return 'this was computed';
    return Outputter.convertOutput(usedLibraries);
  }

  calculateScoreOfLibrary(usedBooks, library) {}
}
