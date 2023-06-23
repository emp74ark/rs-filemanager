import {invalidInput, operationFailed} from './modules/messages.js';
import {dirname, resolve} from 'path';
import {fileURLToPath} from 'url';
import {fork} from 'child_process';

const rootDir = dirname(fileURLToPath(import.meta.url));
const username = process.argv.find(el => el.slice(0, 11) === '--username=')?.split('=')?.[1]

const userPrompt = async () => {
    try {
        if (username) {
            fork(resolve(rootDir, 'modules', 'input'), [username, rootDir])
        } else {
            invalidInput('npm run start -- --username=your_username')
        }
    } catch (e) {
        if (e) {
            operationFailed()
        }
    }
}

userPrompt()
