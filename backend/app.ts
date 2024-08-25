import express from "express";
import corsOptions from "./config/corsOptions";
// routes
import note_Routes from "./routes/note";
import user_Routes from "./routes/user";
import auth_Routes from "./routes/auth";
// middlewares
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import errorHandler from "./middlewares/error_handler/errorHandler";
import requestLogger from "./middlewares/logger/successLogger";
import errorLogger from "./middlewares/logger/errorLogger";
import logCorsError from "./middlewares/logger/corsLogger";

// Init express app
const app = express();

// middlewares
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
// Logger setup
app.use(requestLogger);
app.use(errorLogger);
app.use(morgan("tiny"));
app.use(logCorsError);

// Routes
app.use("/api/notes", note_Routes);
app.use("/api/users", user_Routes);
app.use("/api/auth", auth_Routes);

// Unknown endpoint
app.use((_req, res) => {
    res.status(404).json({ error: "unknown endpoint" });
});

// Error handler middleware
app.use(errorHandler);

export default app;
