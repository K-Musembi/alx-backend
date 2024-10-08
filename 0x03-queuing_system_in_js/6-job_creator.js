import kue from 'kue';

const queue = kue.createQueue();

const data = {
  phoneNumber: '12345',
  message: 'This is the code to verify your account',
};

const kueJob = queue.create('push_notification_code', data).save((err) => {
  if (!err) {
    console.log(`Notification job created: ${kueJob.id}`);
  }
});

kueJob.on('complete', () => {
  console.log('Notification job completed');
});

kueJob.on('failed', () => {
  console.log('Notification job failed');
});
