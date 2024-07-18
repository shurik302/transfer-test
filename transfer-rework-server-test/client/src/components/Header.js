import React, { useContext, useEffect } from 'react';
import '../stylesheets/Header.css';
import LanguageSwitcher from './LanguageSwitcher';
import LogoBig from '../images/logo_big.png';
import { useTranslation } from 'react-i18next';
import { Context } from '../';
import AuthService from '../services/AuthService';

function Header() {
  const { t } = useTranslation();
  const { store } = useContext(Context);

  useEffect(() => {
    const token = document.cookie.split('; ').find((row) => row.startsWith('token='))?.split('=')[1];
    if (token) {
      console.log("Token found in cookies, checking authentication");
      store.checkAuth().then(() => {
        console.log("Authentication check completed");
      }).catch(error => {
        console.error("Error during authentication check:", error);
      });
    } else {
      console.log("No token found in cookies");
    }
  }, [store]);

  const handleLogout = async () => {
    try {
      console.log("Logging out");
      await AuthService.logout();
      store.setAuth(false);
      store.setUser({ email: '', role: '', isActivated: false, id: '' });
      console.log("Logout successful");
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleLoginClick = () => {
    console.log("Navigating to login page");
  };

  console.log("Current auth state:", store.isAuth);

  return (
    <div className="Header">
      <div className="Logo">
        <a href="/">
          <img src={LogoBig} alt="Logo" />
        </a>
      </div>

      <div className="links">
        <a href="/map">{t('F_Link')}</a>
        <a href="/travels">{t('S_Link')}</a>
        <a href="/routes">{t('T_Link')}</a>
        <a href="/help">{t('Th_Link')}</a>
      </div>

      <div className='UserAndLang'>
        {
          store.isAuth ? (
            <div className='User'>
              <a href='/account'>
                <i className="fa-solid fa-user"></i>
              </a>
            </div>
          ) : (
            <div className='NotLogged'>
              <a href='/Authorisation' onClick={handleLoginClick}>{t('ProposeLogin')}</a>
              <a href='/Authorisation' onClick={handleLoginClick}><i className="fa-solid fa-user"></i></a>
            </div>
          )
        }

        <div className="LanguageSwitcher">
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
}

export default Header;
