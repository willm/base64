import {Transform} from 'stream';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const padChar = '=';
const quantumSize = 3;

export class Encoder extends Transform {

  _transform(chunk) {
    const padding = [];
    for (let groupIndex = 0; groupIndex < chunk.length; groupIndex += quantumSize) {
      const quantum = [];
      for (let i = 0; i < quantumSize; i++) {
        if (groupIndex + i >= chunk.length) {
          padding.push(padChar);
        } else {
          quantum.push(...toBits(chunk.readIntLE(groupIndex + i, 1)));
        }
      }
      const encoded = quantum
        .reduce(to6BitGroups, [[]])
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
    this.push(null);

    if (typeof next === 'function') {
      next();
    }
  }
}

const to6BitGroups = (groups, bit) => {
  const group = groups[groups.length - 1];
  group.length >= 6 ? groups.push([bit]) : group.push(bit);
  return groups;
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
