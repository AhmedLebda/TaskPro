import fs from "fs";
import path from "path";

// Define __dirname for ES modules
const _dirname = path.resolve();

// Ensure logs directory exists
const logsDirectory = path.join(_dirname, "logs");
fs.existsSync(logsDirectory) || fs.mkdirSync(logsDirectory);

// Custom middleware to log CORS errors
function logCorsError(err, req, res, next) {
    // Check if the error is CORS-related (status 403 or "cors error" flag set)
    if (err && err.message === "CORS error") {
        // Log the CORS error details
        const origin = req.headers.origin || "-";
        const message = `CORS error: Request from ${origin} blocked`;
        console.error(message); // Log to console or your preferred logging mechanism
        // Optionally, log to a specific file or stream dedicated to CORS errors
        fs.appendFile(
            path.join(logsDirectory, "cors.log"),
            `${new Date().toISOString()} - ${message}\n`,
            (err) => {
                if (err) console.error("Error logging CORS error:", err);
            }
        );
    }
    next(err);
}

export default logCorsError;
