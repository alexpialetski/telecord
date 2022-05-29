import fs from "fs/promises";
import express from "express";
import { Telegraf } from "telegraf";
import bodyParser from "body-parser";

import { searchByLink } from "./main.js";
import { authMiddleware, errorHandler } from "./web.utils.js";
import { FILE_NAME } from "./constant.js";

const app = express();
app.use(bodyParser.json());

app.get("/link", (_, res) =>
  fs
    .readFile(FILE_NAME, { encoding: "utf-8" })
    .then((link) => res.status(200).json({ message: link }))
    .catch(errorHandler(res))
);

app.post("/link", authMiddleware, (req, res) => {
  if (!req.body.link) {
    return res.status(400).json({ message: "No link provided" });
  }

  return fs
    .writeFile(FILE_NAME, req.body.link, { encoding: "utf8" })
    .then(() => res.status(200).send())
    .catch(errorHandler(res));
});

app.post("/trigger", authMiddleware, (_, res) =>
  fs
    .readFile(FILE_NAME, { encoding: "utf-8" })
    .then(searchByLink)
    .then(({ lastMessageLink, htmlLink }) =>
      fs
        .writeFile(FILE_NAME, lastMessageLink, { encoding: "utf8" })
        .then(() => htmlLink)
    )
    .then((link) => res.status(200).json(link))
    .catch(errorHandler(res))
);

const server = app.listen(Number(process.env.PORT), "0.0.0.0", () => {
  console.log(`Web server started: ${JSON.stringify(server.address())}`);
});

export const startBot = (bot: Telegraf) => {
  app.post("/" + bot.telegram.token, (req, res) => {
    bot.handleUpdate(req.body);
    res.sendStatus(200);
  });
};
