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
import {cmdAlert, cmdResult, invalidSyntax} from './messages.js';

export const up = () => {
  if (state.location === state.rootDir) {
    cmdAlert('Operation is not allowed');
    return;
  }

  const newLocation = resolve(state.location, '..');
  state.location = newLocation;

  cmdAlert(`Now you are in: ${newLocation}`);
};

export const cd = (params: string[]) => {
  if (params.length === 0) {
    invalidSyntax('cd path_to_directory');
    return;
  }

  const newLocation = resolve(state.location, params[0]);
  state.location = newLocation; //todo: check if folder exist

  cmdAlert(`Now you are in: ${newLocation}`);
};

export const ls = async () => {//todo: add sorting
  try {
    const files = await readdir(state.location);
    const list: Record<string, string>[] = [];

    for (const f of files) {
      const info = await stat(resolve(state.location, f));
      list.push({
        item: f,
        type: info.isFile() ? 'file' : info.isDirectory() ? 'dir' : 'other',
        size: `${info.size}b`,
      });
    }

    console.table(list);
  } catch (e) {
    console.log(e);
  }

};

export const add = async (params: string[]) => {
  if (params.length === 0) {
    invalidSyntax('add new_file_name');
    return;
  }

  try {
    await writeFile(resolve(state.location, params[0]), '');

    cmdResult(`File "${params[0]}" was created`);
  } catch (e) {
    console.log(e);
  }
};

export const rn = async (params: string[]) => {
  if (params.length < 2) {
    invalidSyntax('rn path_to_file new_filename');
    return;
  }

  try {
    await rename(
        resolve(state.location, params[0]),
        resolve(state.location, params[1]),
    );

    cmdResult(`File "${params[0]}" was renamed to ${params[1]}`);
  } catch (e) {
    console.log(e);
  }
};

export const cp = async (params: string[]) => {
  if (params.length < 2) {
    invalidSyntax('cp path_to_file path_to_new_directory');
    return;
  }

  try {
    const destination = resolve(state.location, params[1], params[0]);
    await copy(resolve(state.location, params[0]), destination);

    cmdResult(`File "${params[0]}" was copied to ${destination}`);
  } catch (e) {
    console.log(e);
  }
};

export const mv = async (params: string[]) => {
  if (params.length < 2) {
    invalidSyntax('path_to_file path_to_new_directory');
    return;
  }

  try {
    const source = resolve(state.location, params[0]);
    const destination = resolve(state.location, params[1], params[0]);
    await copy(source, destination);
    await remove(source);

    cmdResult(`File "${params[0]}" was moved to ${destination}`);
  } catch (e) {
    console.log(e);
  }
};

export const rm = async (params: string[]) => {
  if (params.length === 0) {
    invalidSyntax('rm path_to_file');
    return;
  }
  try {
    const target = resolve(state.location, params[0]);
    const info = await stat(target);
    if (info.isFile()) {
      await remove(resolve(state.location, params[0]));
      cmdResult(`File "${params[0]}" was removed`);
    } else if (info.isDirectory()) {
      await rmdir(resolve(state.location, params[0]), {recursive: true});
      cmdResult(`Directory "${params[0]}" was removed`);
    }
  } catch (e) {
    console.log(e);
  }
};
