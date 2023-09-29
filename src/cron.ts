import { CronJob } from 'cron';

const job = new CronJob(
	'* * * * * *',
	() => {
		console.log('You will see this message every second');
	},
	null,
	false,
	'America/Los_Angeles',
);

export default job;
