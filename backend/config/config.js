const PORT = process.env.PORT;

const MONGO_URI =
    process.env.NODE_ENV === "test"
        ? process.env.TEST_DB_CONNECTION
        : process.env.DB_CONNECTION;

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET;

export default { PORT, MONGO_URI, ACCESS_TOKEN_SECRET };
