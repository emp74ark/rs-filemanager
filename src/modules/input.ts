import {cmdAlert, goodBy, greeting, operationFailed} from './messages.js';
import {add, cd, cp, ls, mv, rm, rn, up} from './fs.js';
import {cat, compress, decompress, hash} from './files.js';
import {os} from './os.js';

const [username, rootDir] = process.argv.slice(2);
export const state = {
  username,
  rootDir,
  location: rootDir,
};

greeting(username);

const inputHandler = (input: Buffer) => {
  const [cmd, ...params] = input.toString().trim().split(' ');
  try {
    switch (cmd) {
      case ('.exit'):
        process.exit(0);
        break;
      case ('up'):
        up();
        break;
      case ('cd'):
        cd(params);
        break;
      case ('ls'):
        ls();
        break;
      case ('cat'):
        cat(params);
        break;
      case ('add'):
        add(params);
        break;
      case ('rn'):
        rn(params);
        break;
      case ('cp'):
        cp(params);
        break;
      case ('mv'):
        mv(params);
        break;
      case ('rm'):
        rm(params);
        break;
      case ('os'):
        os(params);
        break;
      case ('hash'):
        hash(params);
        break;
      case ('compress'):
        compress(params);
        break;
      case ('decompress'):
        decompress(params);
        break;
      default:
        cmdAlert('Invalid input');
    }

  } catch (e) {
    if (e) operationFailed();
  }
};

process.stdin.on('data', inputHandler);
process.on('SIGINT', () => {
  process.stdout.write(goodBy(username));
});

process.on('exit', () => {
  process.stdout.write(goodBy(username));
});
