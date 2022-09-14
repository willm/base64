export const toBits = (num, bucket=128, bits = []) => {
  if (num > 255) {
    throw new TypeError('only 8 bit numbers supported');
  }
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

const zeroPad = (length, list) => Array.from({...list, length}, (v) => v ?? 0);

export const toGroup = (bits, size) => {
  return bits.reduce((groups, bit) => {
    const group = groups[groups.length - 1];
    group.length >= size ? groups.push([bit]) : group.push(bit);
    return groups
  }, [[]])
  .map(zeroPad.bind(null, size));
}
