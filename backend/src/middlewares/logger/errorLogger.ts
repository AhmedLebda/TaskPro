import fs from "fs";
import path from "path";
import morgan from "morgan";

// Define __dirname for ES modules
const _dirname = path.resolve();

// Ensure logs directory exists
const logsDirectory = path.join(_dirname, "logs");
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
fs.existsSync(logsDirectory) || fs.mkdirSync(logsDirectory);

// Create a write stream (in append mode) for error logs in logs/error.log
const errorLogStream = fs.createWriteStream(
    path.join(logsDirectory, "error.log"),
    {
        flags: "a",
    }
);

// Setup morgan middleware for error logging to error.log
const errorLogger = morgan("combined", {
    skip: (_req, res) => res.statusCode < 400,
    stream: errorLogStream,
});

export default errorLogger;
