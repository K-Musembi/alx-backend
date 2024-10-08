import { createClient } from 'redis';

const mySubscriber = createClient();

mySubscriber.on('connect', () => {
  console.log('Redis client connected to the server');
});

mySubscriber.on('error', (err) => {
  console.log(`Redis client not connected to the server: ${err.message}`);
});

mySubscriber.subscribe('holberton school channel');

mySubscriber.on('message', (channel, message) => {
  console.log(`${message}`);
  if (message === 'KILL_SERVER') {
    mySubscriber.unsubscribe();
    mySubscriber.quit();
  }
});
