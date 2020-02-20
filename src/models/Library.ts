import { Base } from './Base';
import { Book } from './Book';
import { sumBy, sum } from 'lodash';

const SIGNUP_FACTOR = 100;
const PENALTY_FACTOR = 1;
const RATE_PER_DAY_FACTOR = 1;
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

  public calculateScore(duplicates: Map<number, number>, averageSignUpTime: number): Library {
    this.score =
      (this.signupTimeScore(averageSignUpTime) * SIGNUP_FACTOR) +
      (this.scoreRatePerDay() * RATE_PER_DAY_FACTOR) -
      (this.duplicatesPenalty(duplicates) * PENALTY_FACTOR);

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

  public signupTimeScore(averageSignUpTime: number): number {
    return averageSignUpTime / this.signupTime;
  }
}
