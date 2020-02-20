import { Context } from '../models/Context';
import { Book } from '../models/Book';

export class BookDuplicateCounter {
  public static bookDuplicates(context: Context): Map<number, number> {
    let duplicates = new Map();

    context.books.forEach(book => {
      let libs = context.libraries.filter(lib => lib.books.includes(book));

      duplicates.set(book.id, libs.length);
    });

    return duplicates;
  }
}
