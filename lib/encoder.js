import {Transform} from 'stream';
import {toBits, toBase10, toGroup} from './binary.js';
import {alphabet, padChar} from './index.js';

const quantumSize = 3;

export class Encoder extends Transform {

  _transform(chunk, _encoding, callback) {
    const bytes = new Uint8Array(chunk);
    const padding = [];
    for (let groupIndex = 0; groupIndex < bytes.length; groupIndex += quantumSize) {
      const quantum = [];
      for (let i = 0; i < quantumSize; i++) {
        const byteIndex = groupIndex + i;
        if (byteIndex >= bytes.length) {
          padding.push(padChar);
        } else {
          quantum.push(...toBits(bytes[byteIndex]));
        }
      }
      const encoded = quantum
        .reduce(toGroup.bind(null, 6), [[]])
        .map(group => {
          if (group.length < 6) {
            group = group.concat(new Array(6 - group.length).fill(0));
          }
          return alphabet[toBase10(group)]
        })
        .concat(padding)
        .join('');
      this.push(Buffer.from(encoded));
    }

    if (typeof callback === 'function') {
      callback();
    }
  }

  _flush(callback) {
    this.push(null);
    callback();
  }
}


