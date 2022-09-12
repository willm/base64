#!/usr/bin/env node
import {Encoder} from './lib/encoder.js';

process.stdin.pipe(new Encoder()).pipe(process.stdout);
