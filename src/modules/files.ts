import {cmdAlert, cmdResult, invalidSyntax} from './messages.js';
import {resolve} from 'path';
import {state} from './input.js';
import {createReadStream, createWriteStream} from 'fs';
import {readFile} from 'fs/promises';
import {pipeline} from 'stream';
import {createBrotliCompress, createBrotliDecompress} from 'zlib';
import {createHash} from 'crypto';

export const cat = async (params: string[]) => {
  if (params.length === 0) {
    invalidSyntax('cat path_to_file');
    return;
  }

  try {
    const file = resolve(state.location, params[0]);
    const readStream = await createReadStream(file, 'utf-8');
    readStream.on('data', (data) => console.log(data));
    readStream.on('error', () => cmdAlert('Invalid input'));
  } catch (e) {
    console.log(e);
  }
};

export const compress = async (params: string[]) => {
  if (params.length < 2) {
    invalidSyntax('compress path_to_file path_to_destination');
    return;
  }

  try {
    const source = resolve(state.location, params[0]);
    const target = resolve(state.location, params[1]);
    const readStream = createReadStream(source);
    const writeStream = createWriteStream(target);
    const brotli = createBrotliCompress();
    pipeline(
        readStream,
        brotli,
        writeStream,
        (e) => console.log(e),
    );
  } catch (e) {
    console.log(e);
  }
};

export const decompress = async (params: string[]) => {
  if (params.length < 2) {
    invalidSyntax('decompress path_to_file path_to_destination');
    return;
  }

  try {
    const source = resolve(state.location, params[0]);
    const target = resolve(state.location, params[1]);
    const readStream = createReadStream(source);
    const writeStream = createWriteStream(target);
    const brotli = createBrotliDecompress();
    pipeline(
        readStream,
        brotli,
        writeStream,
        (e) => console.log(e),
    );
  } catch (e) {
    console.log(e);
  }
};

export const hash = async (params: string[]) => {
  if (params.length === 0) {
    invalidSyntax('hash path_to_file');
    return;
  }

  try {
    const file = await readFile(resolve(state.location, params[0]));
    const hex = createHash('sha256').update(file).digest('hex');
    cmdResult(hex);
  } catch (e) {
    console.log(e);
  }
};
