import { CronJob } from "cron";
import User from "../User";

const delete_after_seconds = 1800; // 30 mins

const startUserCleanupJob = () => {
	const job = new CronJob("* * * * *", async () => {
		const threshold = new Date(Date.now() - delete_after_seconds * 1000);
		await User.deleteMany({
			createdAt: { $lt: threshold },
			roles: { $not: { $elemMatch: { $eq: "admin" } } },
		});
		console.log(
			`Cleanup job executed: non-admin users deleted if older than ${delete_after_seconds} seconds.`
		);
	});

	job.start();
};
export default startUserCleanupJob;
