import {Transform} from 'stream';
import {toBits, toBase10, toGroup} from './binary.js';
import {alphabet, padChar} from './index.js';
import * as assert from 'assert';

export class Decoder extends Transform {

  _transform(chunk, _encoding, callback) {
    const chunkAsString = chunk.toString('utf8');
    const padding = (chunkAsString.match(/(=+$)/) || [''])[0].length;
    const bits = chunkAsString.match(/([^=]*)/)[0].split('')
      .flatMap((letter) => toBits(alphabet.indexOf(letter), 32));
    assert.equal(bits.length % 6, 0);

    const groups = toGroup(bits, 8)
    const bytes = groups.map(toBase10);
    this.push(Buffer.from(bytes.slice(0, padding ? bytes.length - 1 : bytes.length)));
    callback();
  }

  _flush(callback) {
    this.push(null);
    callback();
  }
}
