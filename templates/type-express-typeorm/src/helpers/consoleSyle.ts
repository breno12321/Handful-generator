/* eslint-disable max-len */
import chalk from 'chalk';
import logSymbols from 'log-symbols';

export const errorMessage = (message: string): void => console.log(logSymbols.error, chalk.bold.red(message));
export const warningMessage = (message: string): void => console.log(logSymbols.warning, chalk.yellow(message));
export const successMessage = (message: string): void => console.log(logSymbols.success, chalk.greenBright(message));
