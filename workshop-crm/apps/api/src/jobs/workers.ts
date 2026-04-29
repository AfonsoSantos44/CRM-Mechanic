export const workerConfig = { attempts: 3, backoff: { type: 'exponential', delay: 1000 }, failedQueue: 'alert-dispatch-failed' };
