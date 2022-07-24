import express from "express";
import { Telegraf } from "telegraf";
import bodyParser from "body-parser";

import {
  getLastMessageLinks,
  handleLastMessageLinks,
  postByLinks,
  saveLastMessageLinks,
} from "../main.js";
import { authMiddleware, CustomError } from "../utils/web.utils.js";
import {
  requestLoggerMiddleware,
  errorLoggerMiddleware,
  logger,
  promiseLogger,
} from "../utils/logger.js";
import { sendErrorMessage } from "../telegram/telegramService.js";

const app = express();
app.use(bodyParser.json());
app.use(requestLoggerMiddleware);

app.get("/link", (_, res) =>
  getLastMessageLinks()
    .then(promiseLogger("Link"))
    .then((links) => res.status(200).json({ message: links }))
);

app.post("/link", authMiddleware, (req, res) => {
  if (!Object.keys(req.body)) {
    throw new CustomError("No link provided", 400);
  }

  logger.info(`Saving link: ${JSON.stringify(req.body)}`);

  return saveLastMessageLinks(req.body).then(() => res.sendStatus(200));
});

app.post("/trigger", authMiddleware, (_, res) =>
  getLastMessageLinks()
    .then(promiseLogger("Links"))
    .then(postByLinks)
    .then(promiseLogger("Last message link"))
    .then(handleLastMessageLinks())
    .then(() => res.sendStatus(200))
    .catch((err) => sendErrorMessage(JSON.stringify(err)))
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
