import fs from "fs";
import path from "path";
import morgan from "morgan";

// Define __dirname for ES modules
const _dirname = path.resolve();

// Ensure logs directory exists
const logsDirectory = path.join(_dirname, "logs");
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
fs.existsSync(logsDirectory) || fs.mkdirSync(logsDirectory);

// Create a write stream (in append mode) for request logs in logs/req.log
const requestLogStream = fs.createWriteStream(
    path.join(logsDirectory, "req.log"),
    {
        flags: "a",
    }
);

// Setup morgan middleware for request logging to req.log (only for successful requests)
const requestLogger = morgan("combined", {
    skip: (_req, res) => res.statusCode >= 400,
    stream: requestLogStream,
});

export default requestLogger;
