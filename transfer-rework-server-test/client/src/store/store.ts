import { makeAutoObservable } from "mobx";
import axios from "axios";
import { AuthResponse } from "../models/response/AuthResponse";
import { IUser } from "../models/IUser";
import AuthService from "../services/AuthService";
import React from "react";
import { API_URL } from "../http";

export default class Store {
  user: IUser = { email: '', role: '', isActivated: false, id: '' };
  isAuth = false;
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
    this.checkAuth();
  }

  setAuth = (bool: boolean) => {
    this.isAuth = bool;
  };

  setUser = (user: IUser) => {
    this.user = user;
  };

  setLoading = (bool: boolean) => {
    this.isLoading = bool;
  };

  login = async (email: string, password: string) => {
    try {
      const response = await AuthService.login(email, password);
      this.setAuth(true);
      this.setUser(response.data.user);
      return true;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  };

  registration = async (email: string, password: string) => {
    try {
      const response = await AuthService.registration(email, password);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  logout = async (callback?: () => void) => {
    try {
      await AuthService.logout();
      this.setAuth(false);
      this.setUser({ email: '', role: '', isActivated: false, id: '' });
      if (callback) callback();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  checkAuth = async () => {
    this.setLoading(true);
    try {
      const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, { withCredentials: true });
      localStorage.setItem("accessToken", response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (error) {
      console.error('Error during checkAuth:', error);
      this.setAuth(false);
      this.setUser({ email: '', role: '', isActivated: false, id: '' });
    } finally {
      this.setLoading(false);
    }
  };
}

export const Context = React.createContext(new Store());
