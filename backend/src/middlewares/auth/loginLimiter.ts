import { rateLimit } from "express-rate-limit";

const loginLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    limit: 5, // Limit each IP to 5 requests per `window` (5 minutes).
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: "Please try again after 5 mins",
    statusCode: 429,
});

export default loginLimiter;
