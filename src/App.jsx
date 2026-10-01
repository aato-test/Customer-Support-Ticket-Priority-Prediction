import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { TicketProvider } from './context/TicketContext';
import Layout from './components/Layout';

// Pages
import Dashboard from './pages/Dashboard';
import Tickets from './pages/Tickets';
import CreateTicket from './pages/CreateTicket';
import TicketDetails from './pages/TicketDetails';
import MyTickets from './pages/MyTickets';
import Escalations from './pages/Escalations';
import SLAMonitor from './pages/SLAMonitor';
import Analytics from './pages/Analytics';
import AIInsights from './pages/AIInsights';
import Settings from './pages/Settings';

export default function App() {
  return (
    <ToastProvider>
      <TicketProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="tickets" element={<Tickets />} />
              <Route path="create-ticket" element={<CreateTicket />} />
              <Route path="tickets/:id" element={<TicketDetails />} />
              <Route path="my-tickets" element={<MyTickets />} />
              <Route path="escalations" element={<Escalations />} />
              <Route path="sla-monitor" element={<SLAMonitor />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="ai-insights" element={<AIInsights />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TicketProvider>
    </ToastProvider>
  );
}
