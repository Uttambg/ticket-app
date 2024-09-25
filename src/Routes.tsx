// src/Routes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/protectRoute'; // Import your ProtectedRoute component
import Open from './components/Open';
import InProgress from './components/InProgress';
import Solved from './components/Solved';
import Closed from './components/Closed';
import RecentTickets from './components/RecentTickets';
import TicketsToHandle from './components/TicketsToHandle';
import MyOpenTickets from './components/MyOpenTickets';
import MyTicketsLast7Days from './components/MyTicketsLast7Days';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/open" element={<ProtectedRoute element={<Open />} />} />
      <Route path="/inprogress" element={<ProtectedRoute element={<InProgress />} />} />
      <Route path="/solved" element={<ProtectedRoute element={<Solved />} />} />
      <Route path="/closed" element={<ProtectedRoute element={<Closed />} />} />
      <Route path="/all-recent-tickets" element={<ProtectedRoute element={<RecentTickets />} />} />
      <Route path="/tickets-to-handle" element={<ProtectedRoute element={<TicketsToHandle />} />} />
      <Route path="/my-open-tickets" element={<ProtectedRoute element={<MyOpenTickets />} />} />
      <Route path="/my-tickets-last-7-days" element={<ProtectedRoute element={<MyTicketsLast7Days />} />} />
    </Routes>
  );
};

export default AppRoutes;
