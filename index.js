#!/usr/bin/env node
import {Encoder} from './lib/encoder.js';
import {Decoder} from './lib/decoder.js';

if (process.argv.includes('--help')) {
  process.stdout.write(
    `Usage:  base64 [--decode]
  --help     display this message
  --decode   decodes input`
  );
  process.exit(1);
}
if (process.argv.includes('--decode')) {
  process.stdin.pipe(new Decoder()).pipe(process.stdout);
} else {
  process.stdin.pipe(new Encoder()).pipe(process.stdout);
}
