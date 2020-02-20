import { Book } from "./Book";
import { Library } from "./Library";

export class Context {
    private deadline: number;
    private books: Book[];
    private libraries: Library[];
}