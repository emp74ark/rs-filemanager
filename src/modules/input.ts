import {goodBy, greeting, invalidInput, operationFailed} from "./messages.js";

const [username] = process.argv.slice(2)

greeting(username)

const inputHandler = (input: Buffer) => {
    const [cmd, param1, param2] = input.toString().trim().split(' ')
    try {
        switch (cmd) {
            case ('.exit'):
                process.exit(0)
                break;
            default:
                invalidInput()
        }

    } catch (e) {
        if (e) operationFailed()
    }
}

process.stdin.on('data', inputHandler);
process.on('SIGINT', () => {
    process.stdout.write(goodBy(username))
})

process.on('exit', () => {
    process.stdout.write(goodBy(username))
})
