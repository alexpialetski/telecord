import { ErrorRequestHandler, Request, RequestHandler } from "express";
import winston from "winston";

import { CustomError } from "./web.utils.js";

export type LogLevel =
  | "error"
  | "warn"
  | "info"
  | "http"
  | "verbose"
  | "debug"
  | "silly";

const transports: winston.LoggerOptions["transports"] = [
  new winston.transports.File({ filename: "./combined.log" }),
  new winston.transports.Console(),
];

function getRequestLogFormatter(): winston.Logform.Format {
  const { combine, timestamp, printf } = winston.format;

  return combine(
    timestamp(),
    printf((info) => {
      const { req } = info.message as unknown as { req: Request };

      return `${info.timestamp} ${info.level}: ${req.method} ${req.hostname}${req.originalUrl}`;
    })
  );
}

function createRequestLogger(
  transports: winston.LoggerOptions["transports"]
): RequestHandler {
  const requestLogger = winston.createLogger({
    format: getRequestLogFormatter(),
    transports: transports,
  });

  return (req, res, next) => {
    requestLogger.info({ req, res });
    next();
  };
}

function createErrorLogger(
  transports: winston.LoggerOptions["transports"]
): ErrorRequestHandler {
  const errLogger = winston.createLogger({
    level: "error",
    transports: transports,
  });

  return (err, req, res, next) => {
    errLogger.error({ status: err.status, message: err.message });

    if (err.status) {
      res.status(err.status).send({ error: err.message });
    } else {
      next(err);
    }
  };
}

export const logger = winston.createLogger({
  transports,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
});

export const promiseLogger =
  (hint: string, level: LogLevel = "info") =>
  <T>(res: T) => {
    logger.log(level, { data: JSON.stringify(res), hint });

    return res;
  };

export const requestLoggerMiddleware = createRequestLogger(transports);
export const errorLoggerMiddleware = createErrorLogger(transports);
