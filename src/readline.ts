import * as readline from "readline";

export function ask(question: string, rlInterface: readline.Interface) {
  return new Promise<string>((resolve) => {
    rlInterface.question(question, (input) => resolve(input));
  });
}
