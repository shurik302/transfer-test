import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { Context} from './store/store'; 
import Store from './store/store'; 
import MapComponent from './components/MapComponent.jsx';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import PaymentForm from './components/PaymentForm';
import Header from './components/Header';
import Footer from './components/Footer';
import OnlineHelp from './components/OnlineHelp';
import Home from './pages/Home.js';
import Map from './pages/Map.js';
import Travels from './pages/Travels.js';
import Routes from './pages/Routes.js';
import Account from './pages/Account.js';
import Help from './pages/Help.js';
import Rules from './pages/Rules.js';
import InfoAboutUs from './pages/InfoAboutUs.js';
import PrivacyPolicy from './pages/PrivacyPolicy.js';
import Authorisation from './pages/Authorisation.js'; // Сторінка авторизації
import Registration from './pages/Registration.tsx'; // Сторінка реєстрації
import SearchTickets from './pages/SearchTickets.js';
import BuyTicket from './pages/BuyTicket.js';
import AdminPanel from './pages/AdminPanel';
import './i18n';

function App() {
  const store = new Store(); // створюємо екземпляр Store

  const {stores} = useContext(Context);

  useEffect(() => {
    if(localStorage.getItem("token")){
      store.checkAuth();
    }else{
      
    }
  }, []);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<Map />} />
        <Route path="/travels" element={<Travels />} />
        <Route path="/routes" element={<Routes />} />
        <Route path="/account" element={<Account />} />
        <Route path="/help" element={<Help />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/info-about-us" element={<InfoAboutUs />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/registration" element={<Registration />} /> {/* Шлях для сторінки реєстрації */}
        <Route path="/authorisation" element={<Authorisation />} /> {/* Шлях для сторінки авторизації */}
        <Route path="/search" element={<SearchTickets />} />
        <Route path="/buy-ticket" element={<BuyTicket />} />
        <Route path="/adminPanel" element={<AdminPanel />} />
      </>
    )
  );

  return (
    <Context.Provider value={{ store }}>
      <div className="App">
        <Header />
        <div className="content">
          <RouterProvider router={router} />
        </div>
        <OnlineHelp />
        <Footer />
      </div>
    </Context.Provider>
  );
}

export default observer(App);
