import config from "./src/config/config";
import app from "./app";
import createAdmin from "./src/config/initialAdmin";
import dbConnection from "./src/config/dbConnection";
import startUserCleanupJob from "./src/models/cron/userCleanup";
import StartNoteCleanupJob from "./src/models/cron/noteCleanup";
const start = async () => {
	try {
		await dbConnection();
		await createAdmin();
		startUserCleanupJob();
		StartNoteCleanupJob();
		app.listen(config.PORT, () =>
			console.log("your server is running on port:" + config.PORT)
		);
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error("Error starting server:", error.message);
		}
		process.exit(1);
	}
};

start();
