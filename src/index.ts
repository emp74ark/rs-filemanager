import {invalidSyntax} from "./modules/messages.js";
import {dirname, resolve} from 'path'
import {fileURLToPath} from "url";
import {fork} from "child_process";

const rootDir = dirname(fileURLToPath(import.meta.url));
const userPrompt = async (args: string[]) => {
    try {
        const username = args.find(el => el.slice(0, 11) === '--username=')?.split('=')?.[1]
        if (username) {
            fork(resolve(rootDir, 'modules', 'input'), [username])
        } else {
            throw new SyntaxError()
        }
    } catch (e) {
        if (e instanceof SyntaxError) {
            invalidSyntax('npm run start -- --username=your_username')
        }
    }
}

userPrompt(process.argv)
