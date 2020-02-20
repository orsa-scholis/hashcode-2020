import { Base } from "./Base"
import { Book } from "./Book";

export class Library extends Base {
    private id: number;
    private bookCount: number;
    private books: Book[];
    private signupTime: number;
    private maxScansPerDay: number;
}