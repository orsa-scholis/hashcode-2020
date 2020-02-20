import { Library } from "../models/Library";
import { Book } from "../models/Book";

export class FilterService {
    public static filterDuplicates(libraries: Library[]): Library[] {
        let scanedBooks: Book[] = [];

        libraries.forEach(((library) => {
            library.booksToScan = library.booksToScan.filter(book => !scanedBooks.includes(book));
            scanedBooks.push(...library.booksToScan);
        }))

        return libraries;
    }
}