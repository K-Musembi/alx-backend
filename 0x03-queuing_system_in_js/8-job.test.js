import kue from 'kue';
import createPushNotificationsJobs from './8-job';
import { expect } from 'chai';

describe('createPushNotificationsJobs', () => {
  let myQueue;

  beforeEach(() => {
    myQueue = kue.createQueue();
    myQueue.testMode.enter();
  });

  afterEach((done) => {
    myQueue.testMode.jobs.forEach((job) => {
        job.remove();
    });
    myQueue.testMode.exit();
    done();
  });

  it('should throw an error if jobs is not an array', () => {
    expect(() => createPushNotificationsJobs({}, myQueue)).to.throw('Jobs is not an array');
  });

  it('should create jobs in the queue for valid job data', () => {
    const jobs = [
      {
        phoneNumber: '4153518780',
        message: 'This is the code 1234 to verify your account',
      },
      {
        phoneNumber: '4153518781',
        message: 'This is the code 4562 to verify your account',
      },
    ];

    createPushNotificationsJobs(jobs, myQueue);
    const count = myQueue.testMode.jobs.length;
    expect(count).to.equal(2); 
    const first = myQueue.testMode.jobs[0];
    expect(first.data).to.deep.equal(jobs[0]);
    const second = myQueue.testMode.jobs[1];
    expect(second.data).to.deep.equal(jobs[1]);
  });

  it('should not create jobs if the jobs array is empty', () => {
    createPushNotificationsJobs([], myQueue);
    const count = myQueue.testMode.jobs.length;
    expect(count).to.equal(0);
  });
});
