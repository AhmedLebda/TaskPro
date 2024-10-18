import { CronJob } from "cron";
import Note from "../Note";

const delete_after_seconds = 1800; // 30 mins

const startNoteCleanupJob = () => {
	const job = new CronJob("* * * * *", async () => {
		const threshold = new Date(Date.now() - delete_after_seconds * 1000);
		await Note.deleteMany({ createdAt: { $lt: threshold } });
		console.log("Note cleanup job executed successfully");
	});

	job.start();
};

export default startNoteCleanupJob;
