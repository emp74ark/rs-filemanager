import {cmdResult, invalidInput, operationFailed} from './messages.js';
import {resolve} from 'path';
import {state} from './input.js';
import {createReadStream, createWriteStream} from 'fs';
import {readFile} from 'fs/promises';
import {pipeline} from 'stream';
import {createBrotliCompress, createBrotliDecompress} from 'zlib';
import {createHash} from 'crypto';

export const cat = async (params: string[]) => {
  if (params.length === 0) {
    invalidInput('cat path_to_file');
    return;
  }

  try {
    const file = resolve(state.location, params[0]);
    const readStream = await createReadStream(file, 'utf-8');
    readStream.on('data', (data) => {
      cmdResult(state.location, data.toString());
    });
    readStream.on('error', () => invalidInput());
  } catch (e) {
    if (e) operationFailed();
  }
};

export const compress = async (params: string[]) => {
  if (params.length < 2) {
    invalidInput('compress path_to_file path_to_destination');
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
        (e) => {
          if (e) operationFailed();
        },
    );
    cmdResult(state.location);
  } catch (e) {
    if (e) operationFailed();
  }
};

export const decompress = async (params: string[]) => {
  if (params.length < 2) {
    invalidInput('decompress path_to_file path_to_destination');
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
        (e) => {
          if (e) operationFailed();
        },
    );
    cmdResult(state.location);
  } catch (e) {
    if (e) operationFailed();
  }
};

export const hash = async (params: string[]) => {
  if (params.length === 0) {
    invalidInput('hash path_to_file');
    return;
  }

  try {
    const file = await readFile(resolve(state.location, params[0]));
    const hex = createHash('sha256').update(file).digest('hex');
    cmdResult(state.location, hex);
  } catch (e) {
    if (e) operationFailed();
  }
};
