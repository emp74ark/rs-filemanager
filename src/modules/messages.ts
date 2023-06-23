import {Color} from '../helpers/colors.js';
import {homedir} from 'os';

export const greeting = (username: string) => {
  console.log(`${Color.FgBlue} Welcome to the File Manager ${username}`);
  console.log(`${Color.FgYellow} You are currently in ${homedir()}`);
  console.log(`${Color.Blink} Type command${Color.Reset}`);
};

export const invalidInput = (message?: string) => {
  console.log(Color.BgRed, 'Invalid input', Color.Reset);
  if (message) {
    console.log(Color.FgRed, `Use following syntax: ${message}`, Color.Reset);
  }
};

export const cmdAlert = (message: string) => {
  console.log(Color.FgYellow, message, Color.Reset);
};

export const cmdResult = (message: string) => {
  console.log(Color.FgGreen, message, Color.Reset);
};

export const operationFailed = () => {
  console.log(Color.BgRed, 'Operation failed', Color.Reset);
};

export const goodBy = (username: string) => {
  return `\n${Color.FgBlue}Thank you for using File Manager, ${username}, goodbye! ${Color.Reset}\n`;
};
