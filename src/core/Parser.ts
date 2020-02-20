import { Context } from '../models/Context';
import { first } from 'lodash';
import { Book } from '../models/Book';
import { Library } from '../models/Library';

export class Parser {
  constructor(private input: string) {}

  parse(): Context {
    let context = new Context();

    let inputLines = this.input.split("\n");
    const firstLine = inputLines.shift();
    const firstLineParts = firstLine.split(" ");
    
    const numberOfBooks = parseInt(first(firstLineParts));
    const numberOfLibraries = parseInt(firstLineParts[1]);
    context.deadline = parseInt(firstLineParts[2]);

    const secondLine = inputLines.shift();
    const secondLineParts = secondLine.split(" ");

    for (let bookIndex = 0; bookIndex < numberOfBooks; bookIndex++) {
      const score = parseInt(secondLineParts[bookIndex]);
      context.books.push(new Book(bookIndex, score));
    }

    for (let libraryIndex = 0; libraryIndex < numberOfLibraries; libraryIndex++) {
      const libraryInfo = inputLines.shift().split(" ").map((index) => parseInt(index));
      const libraryBooks = inputLines.shift().split(" ").map((index) => parseInt(index));
      
      let books = context.books.filter((book) => {
        return libraryBooks.includes(book.id);
      });

      context.libraries.push(
        new Library(
          libraryIndex, libraryInfo[0], books, libraryInfo[1], libraryInfo[2]
        )
      )
    }

    // TODO: Implement
    return context;
  }
}
