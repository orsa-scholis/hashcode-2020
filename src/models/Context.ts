import { Book } from './Book';
import { Library } from './Library';

export class Context {
  public deadline: number;
  public books: Book[] = [];
  public libraries: Library[] = [];
}
