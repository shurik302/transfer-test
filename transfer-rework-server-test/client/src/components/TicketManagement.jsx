import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TicketManagement = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tickets');
      setTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const toggleTicketStatus = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/tickets/toggle/${id}`);
      fetchTickets(); // Refresh tickets after updating status
    } catch (error) {
      console.error('Error toggling ticket status:', error);
    }
  };

  const generateQRCode = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/tickets/qrcode/${id}`);
      const qrCodeImage = response.data.qrCodeImage;
      const newWindow = window.open();
      newWindow.document.write(`<img src="${qrCodeImage}" alt="QR Code" />`);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  return (
    <div>
      <h1>Управління квитками</h1>
      <table>
        <thead>
          <tr>
            <th>Від</th>
            <th>До</th>
            <th>Тип</th>
            <th>Кількість пасажирів</th>
            <th>Ціна (EN)</th>
            <th>Ціна (UA)</th>
            <th>Дата відправлення</th>
            <th>Час відправлення</th>
            <th>Тривалість</th>
            <th>Дата прибуття</th>
            <th>Час прибуття</th>
            <th>Багаж</th>
            <th>Електронна пошта</th>
            <th>Статус</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map(ticket => (
            <tr key={ticket._id}>
              <td>{ticket.from}</td>
              <td>{ticket.to}</td>
              <td>{ticket.typeUA}</td>
              <td>{ticket.passengers}</td>
              <td>{ticket.priceEN}</td>
              <td>{ticket.priceUA}</td>
              <td>{new Date(ticket.date_departure).toLocaleDateString()}</td>
              <td>{ticket.departure}</td>
              <td>{ticket.duration}</td>
              <td>{new Date(ticket.date_arrival).toLocaleDateString()}</td>
              <td>{ticket.arrival}</td>
              <td>{ticket.baggage.smallBaggage}</td>
              <td>{ticket.email}</td>
              <td>{ticket.isActive ? 'Активний' : 'Неактивний'}</td>
              <td>
                <button onClick={() => toggleTicketStatus(ticket._id)}>
                  {ticket.isActive ? 'Зробити неактивним' : 'Зробити активним'}
                </button>
                <button onClick={() => generateQRCode(ticket._id)}>
                  Генерувати QR-код
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TicketManagement;