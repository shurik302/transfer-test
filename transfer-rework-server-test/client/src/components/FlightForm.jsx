import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import axios from 'axios';

const FlightForm = () => {
  const [formData, setFormData] = useState({
    fromEN: '',
    fromUA: '',
    fromLocation: '', 
    toEN: '',
    toUA: '',
    toLocation: '',
    typeEN: '',
    typeUA: '',
    passengers: '',
    priceEN: '',
    priceUA: '',
    date_departure: '',
    departure: '',
    duration: '',
    date_arrival: '',
    arrival: '',
    baggage: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/flights/create', formData);
      alert('Рейс успішно створено');
      setFormData({
        fromEN: '',
        fromUA: '',
        fromLocation: '', 
        toEN: '',
        toUA: '',
        toLocation: '',
        typeEN: '',
        typeUA: '',
        passengers: '',
        priceEN: '',
        priceUA: '',
        date_departure: '',
        departure: '',
        duration: '',
        date_arrival: '',
        arrival: '',
        baggage: '',
      });
    } catch (error) {
      console.error('Помилка при створенні рейсу:', error);
      alert('Помилка при створенні рейсу');
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Форма створення рейсу</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Звідки (англійською)" name="fromEN" value={formData.fromEN} onChange={handleChange} fullWidth required margin="normal" />
        <TextField label="Звідки (українською)" name="fromUA" value={formData.fromUA} onChange={handleChange} fullWidth required margin="normal" />
        <TextField label="Місце відправлення" name="fromLocation" value={formData.fromLocation} onChange={handleChange} fullWidth required margin="normal" /> {/* Додано нове поле */}
        <TextField label="Куди (англійською)" name="toEN" value={formData.toEN} onChange={handleChange} fullWidth required margin="normal" />
        <TextField label="Куди (українською)" name="toUA" value={formData.toUA} onChange={handleChange} fullWidth required margin="normal" />
        <TextField label="Місце прибуття" name="toLocation" value={formData.toLocation} onChange={handleChange} fullWidth required margin="normal" /> {/* Додано нове поле */}
        <TextField label="Тип (англійською)" name="typeEN" value={formData.typeEN} onChange={handleChange} fullWidth required margin="normal" />
        <TextField label="Тип (українською)" name="typeUA" value={formData.typeUA} onChange={handleChange} fullWidth required margin="normal" />
        <TextField label="Пасажири" name="passengers" value={formData.passengers} onChange={handleChange} fullWidth required margin="normal" />
        <TextField label="Ціна (англійською)" name="priceEN" value={formData.priceEN} onChange={handleChange} type="number" fullWidth required margin="normal" />
        <TextField label="Ціна (українською)" name="priceUA" value={formData.priceUA} onChange={handleChange} type="number" fullWidth required margin="normal" />
        <TextField label="Дата вильоту" name="date_departure" value={formData.date_departure} onChange={handleChange} type="date" InputLabelProps={{ shrink: true }} fullWidth required margin="normal" />
        <TextField label="Час вильоту" name="departure" value={formData.departure} onChange={handleChange} type="time" InputLabelProps={{ shrink: true }} fullWidth required margin="normal" />
        <TextField label="Тривалість (години)" name="duration" value={formData.duration} onChange={handleChange} type="number" fullWidth required margin="normal" />
        <TextField label="Дата прильоту" name="date_arrival" value={formData.date_arrival} onChange={handleChange} type="date" InputLabelProps={{ shrink: true }} fullWidth required margin="normal" />
        <TextField label="Час прильоту" name="arrival" value={formData.arrival} onChange={handleChange} type="time" InputLabelProps={{ shrink: true }} fullWidth required margin="normal" />
        <TextField label="Багаж" name="baggage" value={formData.baggage} onChange={handleChange} fullWidth required margin="normal" />
        <Button type="submit" variant="contained" color="primary">Створити рейс</Button>
      </form>
    </Container>
  );
};

export default FlightForm;



