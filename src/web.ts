import express from "express";
import bodyParser from "body-parser";
import { Telegraf } from "telegraf";

const app = express();
app.use(bodyParser.json());

app.get("/", function (_, res) {
  res.json({ message: "Hey" });
});

const server = app.listen(Number(process.env.PORT), "0.0.0.0", () => {
  console.log(`Web server started: ${JSON.stringify(server.address())}`);
});

export const startBot = (bot: Telegraf) => {
  app.post("/" + bot.telegram.token, (req, res) => {
    bot.handleUpdate(req.body);
    res.sendStatus(200);
  });
};