export class Base extends Object {
  toString() {
    let output = `${this.constructor.name} { `;

    for (let el in (this as unknown) as {
      [Symbol.iterator](): Iterator<any>;
    }) {
      if (this.hasOwnProperty(el)) {
        output += `${el}: ${this[el]}; `;
      }
    }

    return output + '}';
  }
}
