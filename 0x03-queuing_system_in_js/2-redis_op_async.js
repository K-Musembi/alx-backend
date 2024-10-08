import { createClient, print } from 'redis';
import { promisify } from 'util';

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

const getAsync = promisify(myClient.get).bind(myClient);

const displaySchoolValue = async (schoolName) => {
  try {
    const myValue = await getAsync(schoolName);
    console.log(`${myValue}`);
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
};

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
