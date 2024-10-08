import { createClient } from 'redis';

const myClient = createClient();

myClient.on('connect', () => {
  console.log('Redis client connected to the server');
});

myClient.on('error', (err) => {
  console.log(`Redis client not connected to the server: ${err.message}`);
});
