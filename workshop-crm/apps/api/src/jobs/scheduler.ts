import cron from 'node-cron';
export function startDailyAlertCron(run: () => Promise<void>) { cron.schedule('0 8 * * *', run); }
