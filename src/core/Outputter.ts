import { Library } from '../models/Library';

export class Outputter {
  static convertOutput(libraries: Library[]) {
    let lines = [libraries.length.toString()];
    libraries.forEach(library => {
      lines.push(`${library.id} ${library.booksToScan.length}`);
      lines.push(library.booksToScan.map(book => book.id).join(' '));
    });

    return lines.join('\n');
  }
}
