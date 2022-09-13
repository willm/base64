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

    const groups = bits
      .reduce(toGroup.bind(null, 8), [[]])
      .map(group => {
        if (group.length < 8) {
          group = group.concat(new Array(8 - group.length).fill(0));
        }
        return group;
      });
    assert.equal(groups.every(x => x.length === 8), true);
    const bytes = groups.map(toBase10);
    this.push(Buffer.from(bytes.slice(0, padding ? bytes.length - 1 : bytes.length)));
    callback();
  }

  _flush(callback) {
    this.push(null);
    callback();
  }
}
