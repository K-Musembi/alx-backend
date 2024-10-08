import kue from 'kue';

function createPushNotificationsJobs(jobs, queue) {
  if (!Array.isArray(jobs)) {
    throw new Error('Jobs is not an array');
  }

  jobs.forEach((data) => {
    const myJob = queue.create('push_notification_code_3', data);
    myJob.on('enqueue', () => {
      console.log(`Notification job created: ${myJob.id}`);
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

    myJob.save((err) => {
      if (err) {
        console.error(`Error saving job: ${err}`);
      }
    });
  });
}

export default createPushNotificationsJobs;
