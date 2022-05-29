import type { Response } from "express";

export const errorHandler = (res: Response) => (error: any) => {
  console.log(error);
  if (error.code === "ENOENT") {
    // return res.status(400).json({ message: "No file with link" });
    return res.status(400).json({ message: error });
  }

  return res.status(500).json({ message: error });
};
