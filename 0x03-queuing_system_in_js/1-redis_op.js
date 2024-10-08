import { createClient, print } from 'redis';

const myClient = createClient();

myClient.on('connect', () => {
  console.log('Redis client connected to the server');
});

myClient.on('error', (err) => {
  console.log(`Redis client not connected to the server: ${err.message}`);
});

const setNewSchool = (schoolName, value) => {
  myClient.set(schoolName, value, print);
};
  
const displaySchoolValue = (schoolName) => {
  myClient.get(schoolName, (err, reply) => {
    if (err) {
      console.log(`Error: ${err.message}`);
    } else {
      console.log(`${reply}`);
    }
  });
};

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
