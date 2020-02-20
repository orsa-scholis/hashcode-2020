import { Base } from "./Base"
import { Book } from "./Book";

export class Library extends Base {
    constructor(public id: number, public bookCount: number, public books: Book[], public signupTime: number,public maxScansPerDay: number) {
        super();
    }
}