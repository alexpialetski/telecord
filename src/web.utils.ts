import type { Response } from "express";

export const readfileHandler = (res: Response) => (error: any) => {
  if (error.code === "ENOENT") {
    // return res.status(400).json({ message: "No file with link" });
    return res.status(400).json({ message: error });
  }

  return res.status(500).json({ message: error });
};
