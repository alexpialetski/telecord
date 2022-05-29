import type { Response } from "express";
import basicAuth from "express-basic-auth";

export const errorHandler = (res: Response) => (error: any) => {
  console.log(error);
  if (error.code === "ENOENT") {
    return res.status(400).json({ message: "No file with link" });
  }

  return res.status(500).json({ message: error });
};

export const authMiddleware = basicAuth({
  users: {
    author: String(process.env.AUTHOR_PASSWORD),
  },
});
