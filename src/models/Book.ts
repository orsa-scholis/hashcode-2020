import { Base } from "./Base";

export class Book extends Base {
    constructor(public id: number, public score: number) {
        super();
    }
}