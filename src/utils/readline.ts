import * as readline from "readline";

export const ask = (question: string, rlInterface: readline.Interface) =>
  new Promise<string>((resolve) => {
    rlInterface.question(question, (input) => resolve(input));
  });
