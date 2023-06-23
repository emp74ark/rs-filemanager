import {arch, cpus, EOL, homedir, userInfo} from 'os';
import {cmdResult, invalidInput} from './messages.js';
import {state} from './input.js';

export const os = (params: string[]) => {
  if (params.length === 0) {
    invalidInput('os [--EOL, --cpus, --homedir, --username, --architecture]');
    return;
  }

  switch (params[0]) {
    case '--EOL':
      cmdResult(state.location, EOL.split(''));
      break;
    case '--cpus':
      cmdResult(state.location, cpus());
      break;
    case '--homedir':
      cmdResult(state.location, homedir());
      break;
    case '--username':
      cmdResult(state.location, userInfo().username);
      break;
    case '--architecture':
      cmdResult(state.location, arch());
      break;
    default:
      invalidInput(
          'os [--EOL, --cpus, --homedir, --username, --architecture]');
  }
};
