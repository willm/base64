#!/usr/bin/env node
import {Encoder} from './lib/encoder.js';
import {Decoder} from './lib/decoder.js';

if (process.argv.includes('--decode')) {
  process.stdin.pipe(new Decoder()).pipe(process.stdout);
} else {
  process.stdin.pipe(new Encoder()).pipe(process.stdout);
}
