import {Color} from "../helpers/colors.js";
import {homedir} from 'os'

export const greeting = (username: string) => {
    console.log(`${Color.FgBlue} Welcome to the File Manager ${username}`)
    console.log(`${Color.FgYellow} You are currently in ${homedir()}`)
    console.log(`${Color.Blink} Type command${Color.Reset}`)
}

export const invalidSyntax = (command: string) => {
    console.log(Color.BgRed, `Invalid command, use following syntax: ${command}`, Color.Reset);
};

export const invalidInput = () => {
    console.log(Color.FgYellow, 'Invalid input', Color.Reset)
}

export const operationFailed = () => {
    console.log(Color.BgRed, 'Operation failed')
}

export const goodBy = (username: string) => {
    return `\n${Color.FgBlue}Thank you for using File Manager, ${username}, goodbye! ${Color.Reset}\n`
}
