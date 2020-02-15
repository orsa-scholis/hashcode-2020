import { Base } from '../models/Base';

export class Parser {
  constructor(private input: string) {
  }

  parse(): Base[] {
    // TODO: Implement
    return [(new Base())];
  }
}
