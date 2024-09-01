import "dotenv/config";

const PORT = process.env.PORT || 3001;

const MONGO_URI =
    process.env.NODE_ENV === "test"
        ? process.env.TEST_DB_CONNECTION
        : process.env.DB_CONNECTION;

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_TOKEN_EXPIRY = 1 * 60 * 60; // 1 hour
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 Days

const config = {
    PORT,
    MONGO_URI,
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_EXPIRY,
};
export default config;
