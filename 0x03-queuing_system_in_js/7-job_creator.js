import kue from 'kue';

const jobs = [
  {
    phoneNumber: '4153518780',
    message: 'This is the code 1234 to verify your account'
  },
  {
    phoneNumber: '4153518781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4153518743',
    message: 'This is the code 4321 to verify your account'
  },
  {
    phoneNumber: '4153538781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4153118782',
    message: 'This is the code 4321 to verify your account'
  },
  {
    phoneNumber: '4153718781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4159518782',
    message: 'This is the code 4321 to verify your account'
  },
  {
    phoneNumber: '4158718781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4153818782',
    message: 'This is the code 4321 to verify your account'
  },
  {
    phoneNumber: '4154318781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4151218782',
    message: 'This is the code 4321 to verify your account'
  }
];

const myQueue = kue.createQueue();

jobs.forEach((data) => {
  const myJob = myQueue.create('push_notification_code_2', data);

  myJob.save((err) => {
    if (!err) {
      console.log(`Notification job created: ${myJob.id}`);
    }
  });

  myJob.on('complete', () => {
    console.log(`Notification job ${myJob.id} completed`);
  });

  myJob.on('failed', (errorMessage) => {
    console.log(`Notification job ${myJob.id} failed: ${errorMessage}`);
  });

  myJob.on('progress', (progress) => {
    console.log(`Notification job ${myJob.id} ${progress}% complete`);
  });
});
