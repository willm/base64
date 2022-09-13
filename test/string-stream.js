import {Readable} from 'stream';

export class UTF8StringStream extends Readable {
  #wasRead;
  #value;
  constructor(value) {
    super();
    this.#wasRead = false;
    this.#value = value;
  }

  _read() {
    if (!this.#wasRead) {
      this.push(Buffer.from(this.#value).toString('utf8'));
      this.push(null);
      this.#wasRead = true;
    }
  }
}
