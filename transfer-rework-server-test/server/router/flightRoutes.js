const express = require('express');
const router = express.Router();
const Flight = require('../models/Flight');
const moment = require('moment');

router.post('/create', async (req, res) => {
  try {
    const flightData = {
      ...req.body,
      baggage: {
        smallBaggage: req.body.smallBaggage,
        largeBaggage: req.body.largeBaggage
      }
    };

    const flight = new Flight(flightData);
    await flight.save();
    res.status(201).json({ message: 'Flight created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    // Отримуємо поточну дату
    const currentDate = moment().startOf('day');

    // Знаходимо всі квитки з датою вильоту пізніше поточної дати
    const flights = await Flight.find({
      date_departure: { $gte: currentDate.toDate() }
    });

    res.status(200).json(flights);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
