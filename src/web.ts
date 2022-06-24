import express from "express";
import { Telegraf } from "telegraf";
import bodyParser from "body-parser";

import {
  getLastMessageLink,
  saveLastMessageLink,
  searchByLink,
} from "./main.js";
import { authMiddleware, CustomError } from "./web.utils.js";
import {
  requestLoggerMiddleware,
  errorLoggerMiddleware,
  logger,
  promiseLogger,
} from "./logger.js";

const app = express();
app.use(bodyParser.json());
app.use(requestLoggerMiddleware);

app.get("/link", (_, res) =>
  getLastMessageLink()
    .then(promiseLogger("Link"))
    .then((link) => res.status(200).json({ message: link }))
);

app.post("/link", authMiddleware, (req, res, next) => {
  if (!req.body.link) {
    throw new CustomError("No link provided", 400);
  }

  logger.info(`Saving link: ${req.body.link}`);

  return saveLastMessageLink(req.body.link).then(() => res.status(200).send());
});

app.post("/trigger", authMiddleware, (_, res) =>
  getLastMessageLink()
    .then(promiseLogger("Link"))
    .then(searchByLink)
    .then(promiseLogger("Last message link"))
    .then(({ lastMessageLink, htmlLink, wasLinkUpdated }) =>
      (wasLinkUpdated
        ? saveLastMessageLink(lastMessageLink)
        : Promise.resolve()
      ).then(() => htmlLink)
    )
    .then((link) => res.status(200).json(link))
);

const server = app.listen(Number(process.env.PORT), "0.0.0.0", () => {
  logger.info(`Web server started: ${JSON.stringify(server.address())}`);
});

export const startBot = (bot: Telegraf) => {
  app.post("/" + bot.telegram.token, (req, res) => {
    bot.handleUpdate(req.body);
    res.sendStatus(200);
  });
};

app.use(errorLoggerMiddleware);
