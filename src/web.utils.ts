import basicAuth from "express-basic-auth";

export const authMiddleware = basicAuth({
  users: {
    author: String(process.env.AUTHOR_PASSWORD),
  },
});

export class CustomError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
