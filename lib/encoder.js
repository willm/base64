import {Transform} from 'stream';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const padChar = '=';
export class Encoder extends Transform {

  _transform(chunk) {
    let bits = [];
    for (let i = 0; i < chunk.length; i++) {
      const char = chunk.readIntLE(i, 1);
      bits = [...bits, ...toBits(char)];
    }

    const paddingRequired = bits.length % 24;
    let padding = [];
    if (paddingRequired === 16) {
      padding = [padChar];
    }
    if (paddingRequired === 8) {
      padding = [padChar, padChar];
    }

    const encoded = bits.reduce((groups, bit) => {
      const group = groups[groups.length - 1];
      group.length >= 6 ? groups.push([bit]) : group.push(bit);
      return groups;
    }, [[]])
      .map(group => {
        if (group.length < 6) {
          group = group.concat(new Array(6 - group.length).fill(0));
        }
        return alphabet[toBase10(group)]
      })
      .concat(padding)
      .join('');

    this.push(Buffer.from(encoded));
    this.push(null);
    if (typeof next === 'function') {
      next();
    }
  }
}

export const toBits = (num, bucket=128, bits = []) => {
  if (bucket < 1) {
    return bits;
  }
  const nextBucket = bucket / 2;
  if (num >= bucket) {
    return toBits(num - bucket, nextBucket, bits.concat(1));
  } else {
    return toBits(num, nextBucket, bits.concat(0));
  }
};

export const toBase10 = (bits) => {
  let resolution = 1 * (2 ** (bits.length - 1));
  return bits.reduce((num, bit) => {
    const result =  bit === 1 ? num + resolution : num;
    resolution = resolution / 2;
    return result;
  }, 0);
};
