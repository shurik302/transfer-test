const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const QRCode = require('qrcode');
const ticketService = require('../service/ticket-service');
const authMiddleware = require('../middlewares/authMiddleware'); // middleware для автентифікації користувача

// Функція для форматування дати з рядка dd.mm.yyyy в об'єкт Date
const formatDate = (dateString) => {
  const [day, month, year] = dateString.split('.');
  const date = new Date(`${year}-${month}-${day}`);
  return isNaN(date) ? null : date;
};

// Створення квитка
router.post('/tickets', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // id авторизованого користувача
    const {
      from, fromLocation, to, toLocation,
      typeEN, typeUA, passengers, priceEN, priceUA,
      date_departure, departure, duration, date_arrival, arrival,
      smallBaggage, largeBaggage, email, firstName, lastName, phone
    } = req.body;

    const formattedDateDeparture = formatDate(date_departure);
    const formattedDateArrival = formatDate(date_arrival);

    if (!formattedDateDeparture || !formattedDateArrival) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    const ticketData = {
      from,
      fromLocation,
      to,
      toLocation,
      typeEN,
      typeUA,
      passengers,
      priceEN,
      priceUA,
      date_departure: formattedDateDeparture,
      departure,
      duration,
      date_arrival: formattedDateArrival,
      arrival,
      baggage: {
        smallBaggage,
        largeBaggage
      },
      email,
      firstName,
      lastName,
      phone,
      user: userId // зберігаємо ідентифікатор користувача в квитку
    };

    const ticket = new Ticket(ticketData);
    await ticket.save();

    const qrCodeData = JSON.stringify({ id: ticket._id });
    const qrCodeImage = await QRCode.toDataURL(qrCodeData);

    await ticketService.sendTicketMail(email, ticketData, qrCodeImage);
    res.status(201).json(ticket);
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ message: 'Error creating ticket', error: error.message });
  }
});

// Оновлення статусу квитка (активний/неактивний)
router.put('/tickets/toggle/:id', authMiddleware, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    // Перевірка, чи користувач має доступ до цього квитка
    if (ticket.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    ticket.isActive = !ticket.isActive;
    await ticket.save();
    res.json(ticket);
  } catch (error) {
    console.error('Error toggling ticket status:', error);
    res.status(500).json({ message: 'Error toggling ticket status', error: error.message });
  }
});

// Маршрут для генерації QR-коду за ID квитка
router.get('/tickets/qrcode/:id', authMiddleware, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    // Перевірка, чи користувач має доступ до цього квитка
    if (ticket.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const ticketData = {
      id: ticket._id,
      from: ticket.from,
      to: ticket.to,
      date_departure: ticket.date_departure,
      isActive: ticket.isActive
    };

    const qrCodeData = JSON.stringify(ticketData);
    const qrCodeImage = await QRCode.toDataURL(qrCodeData);

    res.json({ qrCodeImage });
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ message: 'Error generating QR code', error: error.message });
  }
});

// Отримання всіх майбутніх квитків користувача
router.get('/tickets', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // id авторизованого користувача
    const today = new Date();
    const tickets = await Ticket.find({ user: userId, date_departure: { $gte: today } });
    res.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ message: 'Error fetching tickets', error: error.message });
  }
});

module.exports = router;
