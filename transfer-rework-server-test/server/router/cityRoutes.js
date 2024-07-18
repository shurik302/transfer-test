
// server/router/cityRoutes.js
const express = require('express');
const City = require('../models/City');
const router = express.Router();

router.get('/cities', async (req, res) => {
  try {
    const cities = await City.find();
    res.status(200).json(cities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
