import { Base } from './Base';
import { Book } from './Book';
import { sumBy, sum } from 'lodash';

export class Library extends Base {
  public booksToScan: Book[] = [];
  public score: number;

  constructor(
    public id: number,
    public bookCount: number,
    public books: Book[],
    public signupTime: number,
    public maxScansPerDay: number
  ) {
    super();
  }

  public calculateScore(duplicates: Map<number, number>): Library {
    this.score =
      this.signupTimeScore() +
      this.scoreRatePerDay() -
      this.duplicatesPenalty(duplicates);

    this.booksToScan = this.books;

    return this;
  }

  public duplicatesPenalty(duplicates: Map<number, number>): number {
    return sum(
      this.books.map(book => {
        return duplicates.get(book.id);
      })
    );
  }

  public scoreRatePerDay(): number {
    const scanDuration = Math.ceil(this.books.length / this.maxScansPerDay);
    return sumBy(this.books, book => book.score) / scanDuration;
  }

  public signupTimeScore(): number {
    return 1 / this.signupTime;
  }
}
