import {arch, cpus, EOL, homedir, userInfo} from 'os';
import {invalidSyntax} from './messages.js';

export const os = (params: string[]) => {
  if (params.length === 0) {
    invalidSyntax('os [--EOL, --cpus, --homedir, --username, --architecture]');
    return;
  }

  switch (params[0]) {
    case '--EOL':
      console.log(EOL.split(''));
      break;
    case '--cpus':
      console.log(cpus());
      break;
    case '--homedir':
      console.log(homedir());
      break;
    case '--username':
      console.log(userInfo().username);
      break;
    case '--architecture':
      console.log(arch());
      break;
    default:
      invalidSyntax(
          'os [--EOL, --cpus, --homedir, --username, --architecture]');
  }
};
