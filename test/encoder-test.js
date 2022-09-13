import {describe, it} from 'node:test';
import * as assert from 'assert';
import {Encoder} from '../lib/encoder.js';
import {toBits, toBase10} from '../lib/binary.js';
import {createReadStream, readFileSync} from 'fs';
import * as path from 'path';
import {fileURLToPath} from 'url'
import {testCases} from './test-cases.js';
import {UTF8StringStream} from './string-stream.js';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


describe('base64 encoder', () => {
  testCases.forEach(([input, output]) => {
    it(`encodes ${input} to ${output}`, async () => {
      return new Promise((resolve, reject) => {
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

  it('encodes larger binary data correctly', async () => {
    return new Promise((resolve, reject) => {
      const testDataPath = path.join(__dirname, 'data');
      const input = path.join(testDataPath, 'when-im-sixty-four.jpg');
      const encoder = new Encoder();
      const expected = readFileSync(input, 'base64');
      let base64 = '';
      encoder.on('data', data => base64 += data);
      encoder.on('end', () => {
        assert.equal(base64.length, expected.length);
        assert.equal(
          base64,
          expected
        );
        resolve();
      });
      encoder.on('error', (err) => {
        reject(err);
      });

      createReadStream(
        input,
      ).pipe(encoder);
    });
  });
});

describe('toBits()', () => {
  [
    [0, [0, 0, 0, 0, 0, 0, 0, 0]],
    [1, [0, 0, 0, 0, 0, 0, 0, 1]],
    [2, [0, 0, 0, 0, 0, 0, 1, 0]],
    [64, [0, 1, 0, 0, 0, 0, 0,0]],
    [97, [0, 1, 1, 0, 0, 0, 0,1]],
    [255, [1, 1, 1, 1, 1, 1, 1,1]]
  ].forEach(([num, expected]) => {
    it(`converts ${num}`, () => {
        assert.deepEqual(toBits(num), expected);
    });
  });
});

describe('toBase10()', () => {
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
