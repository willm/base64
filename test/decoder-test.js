import {Decoder} from '../lib/decoder.js';
import {testCases} from './test-cases.js';
import {describe, it} from 'node:test';
import {UTF8StringStream} from './string-stream.js';
import * as assert from 'assert';

describe('base64 decoder', () => {
  testCases.forEach(([output, input]) => {
    it(`decodes ${input} to ${output}`, async () => {
      return new Promise((resolve, reject) => {
        const decoder = new Decoder();
        let original = '';
        decoder.on('data', data => original += data);
        decoder.on('end', () => {
          assert.equal(original, output)
          resolve();
        });
        decoder.on('error', (err) => {
          reject(err);
        });

        new UTF8StringStream(input).pipe(decoder);
      });
    });
  });
});

