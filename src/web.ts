import fs from "fs/promises";
import express from "express";
import { Telegraf } from "telegraf";
import bodyParser from "body-parser";
import basicAuth from "express-basic-auth";

import { searchByLink } from "./main.js";
import { readfileHandler } from "./web.utils.js";
import { FILE_NAME } from "./constant.js";

const app = express();
app.use(bodyParser.json());

app.get("/", (_, res) =>
  fs
    .readFile(FILE_NAME, { encoding: "utf-8" })
    .then((link) => {
      return res.status(200).json({ message: link });
    })
    .catch(readfileHandler(res))
);

app.post(
  "/",
  basicAuth({
    users: {
      author: String(process.env.AUTHOR_PASSWORD),
    },
  }),
  (_, res) =>
    fs
      .readFile(FILE_NAME, { encoding: "utf-8" })
      .then(searchByLink)
      .then(({ lastMessageLink, htmlLink }) =>
        fs
          .writeFile(FILE_NAME, lastMessageLink, { encoding: "utf8" })
          .then(() => htmlLink)
      )
      .then((link) => res.status(200).json(link))
      .catch(readfileHandler(res))
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
