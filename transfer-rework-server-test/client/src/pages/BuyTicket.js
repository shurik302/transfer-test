import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import '../stylesheets/BuyTicket.css';
import axios from 'axios';

const BuyTicket = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { travel, passengers, language } = location.state || {};

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [smallBaggage, setSmallBaggage] = useState(0);
  const [largeBaggage, setLargeBaggage] = useState(0);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [cities, setCities] = useState([]);

  const fromToTicketRef = useRef(null);
  const routeSymbolRef = useRef(null);

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    if (fromToTicketRef.current && routeSymbolRef.current) {
      const height = fromToTicketRef.current.clientHeight;
      routeSymbolRef.current.style.height = `${height}px`;
    }
  }, []);

  const fetchCities = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/cities');
      setCities(response.data);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const getCityNameById = (id, language) => {
    const city = cities.find(city => city.id === id);
    return city ? (language === 'ua' ? city.ukrainian : city.value) : '';
  };

  const handleSmallBaggageChange = (amount) => {
    setSmallBaggage(Math.max(0, Math.min(40, smallBaggage + amount)));
  };

  const handleLargeBaggageChange = (amount) => {
    setLargeBaggage(Math.max(0, Math.min(20, largeBaggage + amount)));
  };

  const validateInputs = () => {
    const isValidName = firstName.length > 0 && firstName.length <= 60;
    const isValidLastName = lastName.length > 0 && lastName.length <= 60;
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isValidPhone = phone.length > 0;
    setButtonDisabled(!(isValidName && isValidLastName && isValidEmail && isValidPhone));
  };

  useEffect(() => {
    validateInputs();
  }, [firstName, lastName, email, phone]);

  const handleBuyTicket = async () => {
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      if (isNaN(date)) {
        return null;
      }
      return date.toISOString().split('T')[0]; // Ensuring YYYY-MM-DD format
    };

    const dateDeparture = formatDate(travel.date_departure);
    const dateArrival = formatDate(travel.date_arrival);

    if (!dateDeparture || !dateArrival) {
      alert('Invalid date format');
      return;
    }

    const ticketData = {
      from: travel.fromEN,
      fromLocation: travel.fromLocationEN,
      to: travel.toEN,
      toLocation: travel.toLocationEN,
      typeEN: travel.typeEN,
      typeUA: travel.typeUA,
      passengers: passengers,
      priceEN: travel.priceEN,
      priceUA: travel.priceUA,
      date_departure: dateDeparture,
      departure: travel.departure,
      duration: travel.duration,
      date_arrival: dateArrival,
      arrival: travel.arrival,
      baggage: { smallBaggage, largeBaggage },
      firstName,
      lastName,
      email,
      phone
    };

    try {
      const token = localStorage.getItem('token'); // Получаем токен из localStorage
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.post('http://localhost:5000/api/tickets', ticketData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Ticket created successfully:', response.data);

      const qrCodeResponse = await axios.get(`http://localhost:5000/api/tickets/qrcode/${response.data._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const qrCodeImage = qrCodeResponse.data.qrCodeImage;

      console.log('QR Code:', qrCodeImage);

      alert('Ticket created successfully');
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert('Error creating ticket');
    }
  };

  const calculatePrice = () => {
    const basePrice = language === 'ua' ? parseInt(travel.priceUA, 10) : parseInt(travel.priceEN, 10);
    const smallBaggagePrice = smallBaggage * (language === 'ua' ? 150 : 5);
    const largeBaggagePrice = largeBaggage * (language === 'ua' ? 300 : 10);
    return basePrice + smallBaggagePrice + largeBaggagePrice;
  };

  const totalPrice = calculatePrice();

  return (
    <div className='BuyTicketUser'>
      <div className='InfoBuyTicketUser'>
        <h1>{t('BuyTicketTextUser')}</h1>
      </div>
      <div className='MainInfoBuyTicketUser'>
        <div className='TicketInfoBuy'>
          <div className='UserInfo StageDiv FirstStage'>
            <div className='NameTitle NameTitleUserInfo'>
              <span className='Stage'>1</span>
              <span className='NameTitleBuyTicket NameTitleBuyTicketNameUser'>{t('NameTitleBuyTicketNameUser')}</span>
            </div>
            <div className='MainInputs MainInputsNameUser'>
              <input
                type='text'
                placeholder={t('FirstName')}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                type='text'
                placeholder={t('LastName')}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className='DataBaggage StageDiv SecondStage'>
            <div className='NameTitle NameTitleUserInfo'>
              <span className='Stage'>2</span>
              <span className='NameTitleBuyTicket NameTitleBuyTicketDataBaggage'>{t('NameTitleBuyTicketDataBaggage')}</span>
            </div>
            <div className='MainInputs MainInputsDataBaggage'>
              <div className='HandLuggage BaggageDiv'><span>{t('HandLuggage')}:</span><span>{t('Free')}</span></div>
              <div className='GorisontalLine'></div>
              <div className='SmallBaggage BaggageDiv'>
                <div className='InfoBaggageType'>
                  <span>{t('SmallBaggage')}:</span><span className='AddInfoBaggage'> 5kg, 55x40x20cm</span>
                </div>
                <div className='RightPartBaggage'>
                  <div className='picking-baggage'>
                    <button onClick={() => handleSmallBaggageChange(-1)}>-</button>
                    <input
                      type='number'
                      value={smallBaggage}
                      readOnly
                    />
                    <button onClick={() => handleSmallBaggageChange(1)}>+</button>
                  </div>
                  <div><span>{smallBaggage * (language === 'ua' ? 150 : 5)} {language === 'ua' ? 'грн' : '€'}</span></div>
                </div>
              </div>
              <div className='LargeBaggage BaggageDiv'>
                <div className='InfoBaggageType'>
                  <span>{t('LargeBaggage')}:</span><span className='AddInfoBaggage'> 20kg, 80x50x30cm</span>
                </div>
                <div className='RightPartBaggage'>
                  <div className='picking-baggage'>
                    <button onClick={() => handleLargeBaggageChange(-1)}>-</button>
                    <input
                      type='number'
                      value={largeBaggage}
                      readOnly
                    />
                    <button onClick={() => handleLargeBaggageChange(1)}>+</button>
                  </div>
                  <div><span>{largeBaggage * (language === 'ua' ? 300 : 10)} {language === 'ua' ? 'грн' : '€'}</span></div>
                </div>
              </div>
            </div>
          </div>

          <div className='DataContactUser StageDiv ThirdStage'>
            <div className='NameTitle NameTitleDataContactUser'>
              <span className='Stage'>3</span>
              <span className='NameTitleBuyTicket NameTitleBuyTicketDataDataContactUser'>{t('NameTitleBuyTicketDataDataContactUser')}</span>
            </div>
            <div className='DataContactUserMain'>
              <div className='EnterEmailBT'>
                <input
                  type='email'
                  placeholder={t('Email')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className='phone-input'>
                <PhoneInput
                  country={'us'}
                  value={phone}
                  onChange={setPhone}
                />
              </div>
            </div>
          </div>
        </div>

        <div className='AddInfoTicketBuy'>
          <div className='ProgressTicketBuyVertical'>
            <div className='RouteSymbolBuyTicket' ref={routeSymbolRef}>
              <div className='Line'></div>
              <div className='Circle top'>
                <div className='InnerCircle'>
                  <div className='SmallCircle'></div>
                </div>
              </div>
              <div className='Circle bottom'>
                <div className='InnerCircle'>
                  <div className='SmallCircle'></div>
                </div>
              </div>
            </div>
            <div className='FromToTicketTicketBuyVertical' ref={fromToTicketRef}>
              <div className='FromTicketBuy'>
                <span className='CityInfoTicketBuy'>{getCityNameById(travel.from, language)}</span>
                <span className='StreetInfoTicketBuy'>{language === 'ua' ? travel.additionatlinfoFromUA : travel.additionatlinfoFromEN}</span>
                <span className='DepartureInfoTicketBuy'>{travel.departure}</span>
              </div>
              <div className='ToTicketBuy'>
                <span className='CityInfoTicketBuy'>{getCityNameById(travel.to, language)}</span>
                <span className='StreetInfoTicketBuy'>{language === 'ua' ? travel.additionatlinfoToUA : travel.additionatlinfoToEN}</span>
                <span className='DepartureInfoTicketBuy'>{travel.arrival}</span>
              </div>
            </div>
          </div>
          <div className='AddInfoTicketBT'>
            <div className='DurationTicket'><span>{t('DurationTicket')}</span><span>{travel.duration}{t('hours')}</span></div>
          </div>
          <div className='PriceBuyTicket'>
            <div className='TicketPrice'><span>{t('TotalPrice')}</span><span>{totalPrice}{language === 'ua' ? ' грн' : ' €'}</span></div>
          </div>
          <div className='ButtonConfirmBuyTicket'>
            <button
              onClick={handleBuyTicket}
              disabled={buttonDisabled}
              style={{ backgroundColor: buttonDisabled ? 'red' : 'var(--blue)' }}
            >
              {t('ConfirmPurchase')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyTicket;
