import {describe, it} from 'node:test';
import * as assert from 'assert';
import {Encoder, toBits, toBase10} from '../lib/encoder.js';
import {Readable} from 'stream';

class UTF8StringStream extends Readable {
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

const testCases = [
  ['', ''],
  ['abc', 'YWJj'],
  ['f', 'Zg=='],
  ['fo', 'Zm8='],
  ['foo', 'Zm9v'],
  ['foob', 'Zm9vYg=='],
  ['fooba', 'Zm9vYmE='],
  ['foobar', 'Zm9vYmFy'],
];

describe('base64 encoder', () => {
  testCases.forEach(([input, output]) => {
    it(`encodes ${input} to ${output}`, async () => {
      await new Promise((resolve, reject) => {
        const encoder = new Encoder();
        let base64 = '';
        encoder.on('data', data => base64 += data);
        encoder.on('end', () => {
          assert.equal(base64, output)
          resolve();
        });
        encoder.on('error', (err) => {
          reject(err);
        });

        new UTF8StringStream(input).pipe(encoder);
      });
    });

  });
});


describe('base 10 to bits', () => {
  [
    [0, [0, 0, 0, 0, 0, 0, 0, 0]],
    [1, [0, 0, 0, 0, 0, 0, 0, 1]],
    [2, [0, 0, 0, 0, 0, 0, 1, 0]],
    [64, [0, 1, 0, 0, 0, 0, 0,0]],
    [97, [0, 1, 1, 0, 0, 0, 0,1]]
  ].forEach(([num, expected]) => {
    it(`converts ${num}`, () => {
        assert.deepEqual(toBits(num), expected);
    });
  });
});

describe('bits to base 10', () => {
  [
    [[0, 0, 0, 0, 0, 0, 0, 0], 0],
    [[0, 0, 0, 0, 0, 0, 0, 1], 1],
    [[0, 0, 0, 0, 0, 0, 1, 0], 2],
    [[0, 1, 0, 0, 0, 0, 0,0], 64],
    [[0, 1, 0, 0, 0, 0], 16]
  ].forEach(([bits, expected]) => {
    it(`converts ${bits}`, () => {
        assert.equal(toBase10(bits), expected);
    });
  });
});
