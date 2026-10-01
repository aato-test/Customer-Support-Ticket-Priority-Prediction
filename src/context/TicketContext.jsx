import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ticketService } from '../services/ticketService';
import { useToast } from './ToastContext';

const TicketContext = createContext(null);

export function TicketProvider({ children }) {
  const { addToast } = useToast();
  const [tickets, setTickets] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiOnline, setIsAiOnline] = useState(true);

  // Settings
  const [settings, setSettings] = useState({
    confidenceThreshold: 70,
    maxOpenTickets: 20,
    assignmentAlgorithm: 'least-loaded',
    notifyAssignment: true,
    notifyEscalation: true,
    notifySlaBreach: true,
    notifyManagerAlerts: true,
    userAvailable: true,
    escalationTierAgent: true
  });

  // Notifications feed
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'High-Priority Outage Escalated',
      message: 'Ticket STI-00001 (Production server is down) escalated to Support Manager Kathirvel.',
      time: '12m ago',
      unread: true,
      type: 'escalation'
    },
    {
      id: 'notif-2',
      title: 'SLA Breached Alert',
      message: 'STI-00005 (Payment page timeout during checkout) has breached 2h SLA by 45 mins.',
      time: '35m ago',
      unread: true,
      type: 'breach'
    },
    {
      id: 'notif-3',
      title: 'Low Confidence Classification',
      message: 'Ticket STI-00007 flagged for manager review (AI Confidence: 62%).',
      time: '1h ago',
      unread: true,
      type: 'review'
    },
    {
      id: 'notif-4',
      title: 'Agent Auto-Assignment',
      message: 'Ticket STI-00003 assigned to Arun Kumar via least-loaded algorithm.',
      time: '2h ago',
      unread: false,
      type: 'assignment'
    }
  ]);

  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      const [tList, aList] = await Promise.all([
        ticketService.getTickets(),
        ticketService.getAgentWorkload()
      ]);
      setTickets(tList);
      setAgents(aList);
    } catch (err) {
      console.error('Failed to load tickets/agents', err);
      addToast('Failed to load tickets from service', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleCreateTicket = async (ticketData) => {
    try {
      const created = await ticketService.createTicket(ticketData);
      setTickets(prev => [created, ...prev]);
      // Refresh agents to reflect updated workloads
      const updatedAgents = await ticketService.getAgentWorkload();
      setAgents(updatedAgents);

      addToast(`Ticket ${created.id} analyzed & created successfully.`, 'success');

      if (created.assignedAgent) {
        addToast(`Ticket assigned to ${created.assignedAgent}.`, 'info');
      }

      if (created.priority === 'HIGH') {
        addToast(`High-priority ticket escalated to Support Manager.`, 'warning');
        setNotifications(prev => [
          {
            id: `notif-${Date.now()}`,
            title: 'Critical Incident Escalated',
            message: `Ticket ${created.id} (${created.subject}) flagged as HIGH priority.`,
            time: 'Just now',
            unread: true,
            type: 'escalation'
          },
          ...prev
        ]);
      }

      return created;
    } catch (err) {
      console.error(err);
      addToast('Failed to create ticket', 'error');
      throw err;
    }
  };

  const handleAssignTicket = async (ticketId, agentName) => {
    try {
      const updated = await ticketService.assignTicket(ticketId, agentName);
      setTickets(prev => prev.map(t => t.id === ticketId ? updated : t));
      const updatedAgents = await ticketService.getAgentWorkload();
      setAgents(updatedAgents);
      addToast(`Ticket ${ticketId} assigned to ${agentName}.`, 'success');
      return updated;
    } catch (err) {
      console.error(err);
      addToast(`Failed to assign ticket: ${err.message}`, 'error');
      throw err;
    }
  };

  const handleEscalateTicket = async (ticketId, reason) => {
    try {
      const updated = await ticketService.escalateTicket(ticketId, reason);
      setTickets(prev => prev.map(t => t.id === ticketId ? updated : t));
      addToast(`Ticket ${ticketId} escalated to Support Manager.`, 'warning');
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          title: 'Manual Outage Escalation',
          message: `Ticket ${ticketId} manually escalated by Manager.`,
          time: 'Just now',
          unread: true,
          type: 'escalation'
        },
        ...prev
      ]);
      return updated;
    } catch (err) {
      console.error(err);
      addToast(`Failed to escalate ticket: ${err.message}`, 'error');
      throw err;
    }
  };

  const handleOverridePriority = async (ticketId, newPriority, reason) => {
    try {
      const updated = await ticketService.overridePriority(ticketId, newPriority, reason);
      setTickets(prev => prev.map(t => t.id === ticketId ? updated : t));
      addToast(`Priority for ${ticketId} updated to ${newPriority}. Priority manually overridden.`, 'info');
      return updated;
    } catch (err) {
      console.error(err);
      addToast(`Failed to update priority: ${err.message}`, 'error');
      throw err;
    }
  };

  const handleResolveTicket = async (ticketId) => {
    try {
      const updated = await ticketService.updateTicket(ticketId, {
        status: 'RESOLVED',
        resolvedDate: new Date().toISOString()
      });
      setTickets(prev => prev.map(t => t.id === ticketId ? updated : t));
      addToast(`Ticket ${ticketId} marked as RESOLVED.`, 'success');
      return updated;
    } catch (err) {
      console.error(err);
      addToast(`Failed to resolve ticket: ${err.message}`, 'error');
      throw err;
    }
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    addToast('SupportIQ configuration saved successfully', 'success');
  };

  const resetAllData = () => {
    const { tickets: defTickets, agents: defAgents } = ticketService.resetToDefaultData();
    setTickets(defTickets);
    setAgents(defAgents);
    addToast('Reset to initial factory mock dataset.', 'info');
  };

  return (
    <TicketContext.Provider
      value={{
        tickets,
        agents,
        loading,
        searchQuery,
        setSearchQuery,
        isAiOnline,
        setIsAiOnline,
        settings,
        updateSettings,
        notifications,
        markAllNotificationsRead,
        createTicket: handleCreateTicket,
        assignTicket: handleAssignTicket,
        escalateTicket: handleEscalateTicket,
        overridePriority: handleOverridePriority,
        resolveTicket: handleResolveTicket,
        refreshData,
        resetAllData
      }}
    >
      {children}
    </TicketContext.Provider>
  );
}

export function useTickets() {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
}
