import {resolve} from 'path';
import {
  cp as copy,
  readdir,
  rename,
  rm as remove,
  rmdir,
  stat,
  writeFile,
} from 'fs/promises';
import {state} from './input.js';
import {
  cmdAlert,
  cmdResult,
  invalidInput,
  operationFailed,
} from './messages.js';

export const up = () => {
  if (state.location === state.rootDir) {
    cmdAlert('Operation is not allowed');
    return;
  }

  state.location = resolve(state.location, '..');
  cmdResult(state.location);
};

export const cd = async (params: string[]) => {
  if (params.length === 0) {
    invalidInput('cd path_to_directory');
    return;
  }

  const newLocation = resolve(state.location, params[0])
  try {
    const info = await stat(newLocation)
    if (info.isDirectory()) {
      state.location = resolve(state.location, params[0]);
      cmdResult(state.location);
    } else {
      cmdAlert('Wrong destination')
    }
  } catch (e) {
    if (e) operationFailed()
  }
};

export const ls = async () => {
  try {
    const files = await readdir(state.location);
    let list: Record<string, string>[] = [];

    for (const f of files) {
      const info  = await stat(resolve(state.location, f));
      list.push({
        item: f,
        type: info.isFile() ? 'file' : info.isDirectory() ? 'dir' : 'other',
        size: `${info.size}b`,
      });
      const dirs = list.filter(e => e.type === 'dir').sort()
      const files = list.filter(e => e.type === 'file').sort()
      list = dirs.concat(files)
    }

    console.table(list);
    cmdResult(state.location);
  } catch (e) {
    if (e) operationFailed();
  }

};

export const add = async (params: string[]) => {
  if (params.length === 0) {
    invalidInput('add new_file_name');
    return;
  }

  try {
    await writeFile(resolve(state.location, params[0]), '');

    cmdResult(state.location, `File "${params[0]}" was created`);
  } catch (e) {
    if (e) operationFailed();
  }
};

export const rn = async (params: string[]) => {
  if (params.length < 2) {
    invalidInput('rn path_to_file new_filename');
    return;
  }

  try {
    await rename(
        resolve(state.location, params[0]),
        resolve(state.location, params[1]),
    );

    cmdResult(state.location,
        `File "${params[0]}" was renamed to ${params[1]}`);
  } catch (e) {
    if (e) operationFailed();
  }
};

export const cp = async (params: string[]) => {
  if (params.length < 2) {
    invalidInput('cp path_to_file path_to_new_directory');
    return;
  }

  try {
    const destination = resolve(state.location, params[1], params[0]);
    await copy(resolve(state.location, params[0]), destination);

    cmdResult(state.location,
        `File "${params[0]}" was copied to ${destination}`);
  } catch (e) {
    if (e) operationFailed();
  }
};

export const mv = async (params: string[]) => {
  if (params.length < 2) {
    invalidInput('path_to_file path_to_new_directory');
    return;
  }

  try {
    const source = resolve(state.location, params[0]);
    const destination = resolve(state.location, params[1], params[0]);
    await copy(source, destination);
    await remove(source);

    cmdResult(state.location,
        `File "${params[0]}" was moved to ${destination}`);
  } catch (e) {
    if (e) operationFailed();
  }
};

export const rm = async (params: string[]) => {
  if (params.length === 0) {
    invalidInput('rm path_to_file');
    return;
  }
  try {
    const target = resolve(state.location, params[0]);
    const info = await stat(target);
    if (info.isFile()) {
      await remove(resolve(state.location, params[0]));
      cmdResult(state.location, `File "${params[0]}" was removed`);
    } else if (info.isDirectory()) {
      await rmdir(resolve(state.location, params[0]), {recursive: true});
      cmdResult(state.location, `Directory "${params[0]}" was removed`);
    }
  } catch (e) {
    if (e) operationFailed();
  }
};
