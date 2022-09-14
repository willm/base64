import {Transform} from 'stream';
import {toBits, toBase10, toGroup} from './binary.js';
import {alphabet, padChar} from './index.js';

export class Decoder extends Transform {

  _transform(chunk, _encoding, callback) {
    const chunkAsString = chunk.toString('utf8');
    const padding = chunkAsString.match(new RegExp(`(${padChar}+$)`));
    const bits = chunkAsString.match(new RegExp(`([^${padChar}]*)`))[0].split('')
      .flatMap((letter) => toBits(alphabet.indexOf(letter), 32));

    const groups = toGroup(bits, 8)
    const bytes = groups.map(toBase10);
    const bytesMinusPadding = padding ? bytes.slice(0, bytes.length - 1) : bytes;
    this.push(Buffer.from(bytesMinusPadding));
    callback();
  }

  _flush(callback) {
    this.push(null);
    callback();
  }
}
