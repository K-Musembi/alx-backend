import { createClient, print } from 'redis';

const myClient = createClient();

myClient.on('connect', () => {
  console.log('Redis client connected to the server');
});

myClient.on('error', (err) => {
  console.log(`Redis client not connected to the server: ${err.message}`);
});

const createHash = () => {
  const hKey = 'HolbertonSchools';
  const hValues = {
    Portland: 50,
    Seattle: 80,
    'New York': 20,
    Bogota: 20,
    Cali: 40,
    Paris: 2,
  };

  for (const [key, value] of Object.entries(hValues)) {
    myClient.hset(hKey, key, value, print);
  }
};

const displayHash = (hashKey) => {
  myClient.hgetall(hashKey, (err, reply) => {
    if (err) {
      console.log(`Error: ${err.message}`);
    } else {
      console.log(`${hashKey}:`, reply);
    }
  });
};

createHash();
displayHash('HolbertonSchools');
