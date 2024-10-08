import kue from 'kue';

const myQueue = kue.createQueue({
  concurrency: 2,
});

const blacklist = [
  '4153518780',
  '4153518781',
];

function sendNotification(phoneNumber, message, job, done) {
  job.progress(0, 100);
  if (blacklist.includes(phoneNumber)) {
    return done(new Error(`Phone number ${phoneNumber} is blacklisted`));
  }

  job.progress(50, 100);
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);

  setTimeout(() => {
    job.progress(100);
    done();
  }, 1000);
}

myQueue.process('push_notification_code_2', (job, done) => {
  const { phoneNumber, message } = job.data;
  sendNotification(phoneNumber, message, job, done);
});

// myQueue.on('ready', () => {
  // console.log('Queue is ready to process jobs');
// });
