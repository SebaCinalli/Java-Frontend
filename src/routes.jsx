import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import MenuMain from './pages/MenuMain';
import Roulette from './components/Roulette';
import Blackjack from './components/Blackjack';
import ProtectedRoutes from './components/ProtectedRoutes';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoutes>
            <MenuMain />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/roulette"
        element={
          <ProtectedRoutes>
            <Roulette />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/blackjack"
        element={
          <ProtectedRoutes>
            <Blackjack />
          </ProtectedRoutes>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
