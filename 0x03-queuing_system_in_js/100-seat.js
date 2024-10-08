import express from 'express';
import { createClient } from 'redis';
import { promisify } from 'util';
import kue from 'kue';

const app = express();
const PORT = 1245;
const myClient = createClient();
const gAsync = promisify(myClient.get).bind(myClient);
const sAsync = promisify(myClient.set).bind(myClient);
const myQueue = kue.createQueue();

let reservationEnabled = true;

async function initializeSeats() {
    await sAsync('available_seats', 50);
}

const reserveSeat = async (number) => {
  await sAsync('available_seats', number);
};

const getCurrentAvailableSeats = async () => {
  const availableSeats = await gAsync('available_seats');
  return parseInt(availableSeats, 10);
};


app.get('/available_seats', async (req, res) => {
  const availableSeats = await getCurrentAvailableSeats();
  res.json({ numberOfAvailableSeats: availableSeats.toString() });
});


app.get('/reserve_seat', async (req, res) => {
  if (!reservationEnabled) {
    return res.json({ status: 'Reservations are blocked' });
  }

  const job = myQueue.create('reserve_seat', {}).save((err) => {
    if (!err) {
      return res.json({ status: 'Reservation in process' });
    } else {
      return res.json({ status: 'Reservation failed' });
    }
  });
});


myQueue.process('reserve_seat', async (job, done) => {
  const currentAvailableSeats = await getCurrentAvailableSeats();
  const newAvailableSeats = currentAvailableSeats - 1;

  if (newAvailableSeats < 0) {
    return done(new Error('Not enough seats available'));
  }

  await reserveSeat(newAvailableSeats);


  if (newAvailableSeats === 0) {
    reservationEnabled = false;
  }

  console.log(`Seat reservation job ${job.id} completed`);
  done();
});


myQueue.on('failed', (job, errorMessage) => {
  console.log(`Seat reservation job ${job.id} failed: ${errorMessage}`);
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
