import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const UserContext = createContext(undefined);
const API_BASE_URL = 'http://localhost:8080/api';

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [existsToken, setExistsToken] = useState(false);

  const login = (userData) => {
    setUser(userData);
    setExistsToken(true);
  };

  const logout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/usuarios/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      setUser(null);
      setExistsToken(false);
    }
  };

  const checkToken = async () => {
    try {
      const resp = await axios.post(`${API_BASE_URL}/usuarios/verify`, {}, { withCredentials: true });
      if (resp.status === 200 && resp.data) {
        const u = resp.data.user ?? resp.data;
        setUser(u);
        setExistsToken(true);
      }
    } catch (err) {
      setUser(null);
      setExistsToken(false);
    }
  };

  return (
    <UserContext.Provider value={{ user, login, logout, existsToken, checkToken }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used inside UserProvider');
  return ctx;
};
