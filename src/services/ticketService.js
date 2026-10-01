import { INITIAL_TICKETS, INITIAL_AGENTS, MOCK_ACCOUNTS, MOCK_CONTACTS } from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// In-memory or localStorage cache for persistence during session
const STORAGE_KEY_TICKETS = 'supportiq_tickets';
const STORAGE_KEY_AGENTS = 'supportiq_agents';
const STORAGE_KEY_SETTINGS = 'supportiq_settings';

function loadTickets() {
  const stored = localStorage.getItem(STORAGE_KEY_TICKETS);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fallback
    }
  }
  localStorage.setItem(STORAGE_KEY_TICKETS, JSON.stringify(INITIAL_TICKETS));
  return [...INITIAL_TICKETS];
}

function saveTickets(tickets) {
  localStorage.setItem(STORAGE_KEY_TICKETS, JSON.stringify(tickets));
}

function loadAgents() {
  const stored = localStorage.getItem(STORAGE_KEY_AGENTS);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fallback
    }
  }
  localStorage.setItem(STORAGE_KEY_AGENTS, JSON.stringify(INITIAL_AGENTS));
  return [...INITIAL_AGENTS];
}

function saveAgents(agents) {
  localStorage.setItem(STORAGE_KEY_AGENTS, JSON.stringify(agents));
}

// Simulated network delay
const delay = (ms = 150) => new Promise(res => setTimeout(res, ms));

export const ticketService = {
  getApiBaseUrl() {
    return API_BASE_URL;
  },

  async getTickets(filters = {}) {
    await delay();
    let tickets = loadTickets();

    if (filters.search) {
      const q = filters.search.toLowerCase();
      tickets = tickets.filter(t =>
        t.id.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.account.toLowerCase().includes(q) ||
        t.contact.toLowerCase().includes(q) ||
        t.assignedAgent.toLowerCase().includes(q)
      );
    }

    if (filters.priority && filters.priority !== 'ALL') {
      tickets = tickets.filter(t => t.priority === filters.priority);
    }

    if (filters.status && filters.status !== 'ALL') {
      tickets = tickets.filter(t => t.status === filters.status);
    }

    if (filters.slaRisk && filters.slaRisk !== 'ALL') {
      tickets = tickets.filter(t => t.slaRiskLevel === filters.slaRisk);
    }

    if (filters.category && filters.category !== 'ALL') {
      tickets = tickets.filter(t => t.issueCategory === filters.category);
    }

    if (filters.agent) {
      tickets = tickets.filter(t => t.assignedAgent === filters.agent);
    }

    if (filters.manualReviewOnly) {
      tickets = tickets.filter(t => t.requiresManualReview);
    }

    return tickets;
  },

  async getTicketById(id) {
    await delay();
    const tickets = loadTickets();
    const ticket = tickets.find(t => t.id === id);
    if (!ticket) {
      throw new Error(`Ticket with ID ${id} not found`);
    }
    return { ...ticket };
  },

  async analyzeTicket(subject = '', description = '') {
    // Artificial slight delay for realistic AI analysis simulation
    await delay(300);

    const fullText = `${subject} ${description}`.toLowerCase();

    // High priority triggers
    const highSignals = ['outage', 'system failure', 'system down', 'data loss', 'security breach', 'urgent', 'critical', 'emergency', 'asap', '502', '503', '504', 'crash', 'compromised'];
    // Medium priority triggers
    const mediumSignals = ['slow', 'lag', 'timeout', 'performance', 'login', 'unable to login', 'access', 'auth', 'expired', 'error', 'bug', 'failing'];
    // Low priority triggers
    const lowSignals = ['question', 'how do i', 'how to', 'information', 'documentation', 'feature inquiry', 'upgrade', 'pricing', 'seats', 'invoice'];

    const detectedKeywords = [];
    highSignals.forEach(w => { if (fullText.includes(w)) detectedKeywords.push(w); });
    mediumSignals.forEach(w => { if (fullText.includes(w)) detectedKeywords.push(w); });
    lowSignals.forEach(w => { if (fullText.includes(w)) detectedKeywords.push(w); });

    let priority = 'MEDIUM';
    let issueCategory = 'Performance';
    let slaRisk = 'MEDIUM';
    let confidence = 88;
    let rationale = '';
    let requiresManualReview = false;

    // Check for short/vague description
    if (description.trim().length < 35 && detectedKeywords.length === 0) {
      priority = 'MEDIUM';
      issueCategory = 'General Inquiry';
      slaRisk = 'LOW';
      confidence = 62;
      requiresManualReview = true;
      rationale = 'Ticket description is too short and does not clearly indicate severity. Manual review recommended.';
      detectedKeywords.push('vague text', 'low detail');
    } else if (highSignals.some(w => fullText.includes(w))) {
      priority = 'HIGH';
      slaRisk = 'HIGH';
      confidence = 96;
      if (fullText.includes('security') || fullText.includes('compromised') || fullText.includes('token')) {
        issueCategory = 'System Outage';
        rationale = 'Urgent security and data integrity risk identified. Immediate isolation and high-priority triage required.';
      } else if (fullText.includes('payment') || fullText.includes('checkout') || fullText.includes('stripe')) {
        issueCategory = 'Billing';
        rationale = 'Critical payment and revenue checkout failure detected affecting active transactions.';
      } else {
        issueCategory = 'System Outage';
        rationale = 'Multiple users are unable to access the production system and the description indicates a service outage.';
      }
    } else if (lowSignals.some(w => fullText.includes(w))) {
      priority = 'LOW';
      slaRisk = 'LOW';
      confidence = 93;
      issueCategory = fullText.includes('invoice') || fullText.includes('upgrade') ? 'Billing' : 'General Inquiry';
      rationale = 'Standard non-blocking inquiry regarding documentation or platform features. No operational downtime detected.';
    } else {
      priority = 'MEDIUM';
      slaRisk = 'MEDIUM';
      confidence = 86;
      if (fullText.includes('login') || fullText.includes('sso') || fullText.includes('auth')) {
        issueCategory = 'Account Access';
        rationale = 'Account authentication or portal access impairment affecting targeted users.';
      } else {
        issueCategory = 'Performance';
        rationale = 'Performance degradation or intermittent operation anomaly identified without catastrophic loss of service.';
      }
    }

    // Auto-select least-loaded eligible agent
    const agents = loadAgents().filter(a => a.availability === 'Available');
    const leastLoaded = agents.sort((a, b) => a.workload - b.workload)[0] || { name: 'Priya Sharma' };

    return {
      predictedPriority: priority,
      issueCategory,
      slaRisk,
      aiConfidenceScore: confidence,
      aiRationale: rationale,
      keywordSignals: detectedKeywords.length > 0 ? detectedKeywords.slice(0, 5) : ['general'],
      requiresManualReview,
      suggestedAgent: leastLoaded.name
    };
  },

  async createTicket(ticketData) {
    await delay();
    const tickets = loadTickets();
    const nextNum = tickets.length + 1;
    const formattedId = `STI-${String(nextNum).padStart(5, '0')}`;

    const newTicket = {
      id: formattedId,
      subject: ticketData.subject,
      description: ticketData.description,
      priority: ticketData.priority || 'MEDIUM',
      status: ticketData.priority === 'HIGH' ? 'ESCALATED' : 'OPEN',
      issueCategory: ticketData.issueCategory || 'General Inquiry',
      slaRiskLevel: ticketData.slaRiskLevel || 'MEDIUM',
      slaTargetHours: ticketData.priority === 'HIGH' ? 2 : ticketData.priority === 'MEDIUM' ? 8 : 24,
      slaRemainingMinutes: ticketData.priority === 'HIGH' ? 120 : ticketData.priority === 'MEDIUM' ? 480 : 1440,
      aiConfidenceScore: ticketData.aiConfidenceScore || 92,
      assignedAgent: ticketData.assignedAgent || 'Priya Sharma',
      resolutionTimeHours: 0,
      account: ticketData.account || 'Acme Global Corp',
      contact: ticketData.contact || 'Sarah Jenkins (VP Eng)',
      aiRationale: ticketData.aiRationale || 'Automated classification by the SupportIQ rule engine.',
      keywordSignals: ticketData.keywordSignals || ['inquiry'],
      requiresManualReview: ticketData.requiresManualReview || false,
      priorityOverridden: false,
      aiProcessed: true,
      createdDate: new Date().toISOString(),
      escalatedDate: ticketData.priority === 'HIGH' ? new Date().toISOString() : null,
      ticketSource: ticketData.ticketSource || 'Web Form',
      escalationDetails: ticketData.priority === 'HIGH' ? {
        status: 'Escalated',
        tasksCreated: ['Review and respond to ticket', 'Manager outage escalation'],
        agentNotified: true,
        managerNotified: true,
        dueTime: 'Today — 2 hours'
      } : null
    };

    tickets.unshift(newTicket);
    saveTickets(tickets);

    // Update agent's open ticket count & workload
    const agents = loadAgents();
    const agentIndex = agents.findIndex(a => a.name === newTicket.assignedAgent);
    if (agentIndex !== -1) {
      agents[agentIndex].openTickets += 1;
      if (newTicket.priority === 'HIGH') {
        agents[agentIndex].highPriority += 1;
      }
      agents[agentIndex].workload = Math.min(100, Math.round((agents[agentIndex].openTickets / 25) * 100));
      saveAgents(agents);
    }

    return newTicket;
  },

  async updateTicket(id, updates) {
    await delay();
    const tickets = loadTickets();
    const index = tickets.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Ticket not found');

    tickets[index] = { ...tickets[index], ...updates };
    saveTickets(tickets);
    return tickets[index];
  },

  async assignTicket(ticketId, agentName) {
    await delay();
    const tickets = loadTickets();
    const ticketIndex = tickets.findIndex(t => t.id === ticketId);
    if (ticketIndex === -1) throw new Error('Ticket not found');

    const prevAgent = tickets[ticketIndex].assignedAgent;
    tickets[ticketIndex].assignedAgent = agentName;
    saveTickets(tickets);

    // Update workloads
    const agents = loadAgents();
    const oldAgentIdx = agents.findIndex(a => a.name === prevAgent);
    if (oldAgentIdx !== -1 && agents[oldAgentIdx].openTickets > 0) {
      agents[oldAgentIdx].openTickets -= 1;
      if (tickets[ticketIndex].priority === 'HIGH' && agents[oldAgentIdx].highPriority > 0) {
        agents[oldAgentIdx].highPriority -= 1;
      }
      agents[oldAgentIdx].workload = Math.max(0, Math.round((agents[oldAgentIdx].openTickets / 25) * 100));
    }
    const newAgentIdx = agents.findIndex(a => a.name === agentName);
    if (newAgentIdx !== -1) {
      agents[newAgentIdx].openTickets += 1;
      if (tickets[ticketIndex].priority === 'HIGH') {
        agents[newAgentIdx].highPriority += 1;
      }
      agents[newAgentIdx].workload = Math.min(100, Math.round((agents[newAgentIdx].openTickets / 25) * 100));
    }
    saveAgents(agents);

    return tickets[ticketIndex];
  },

  async escalateTicket(ticketId, reason = 'Urgent operational impact flagged by manager') {
    await delay();
    const tickets = loadTickets();
    const index = tickets.findIndex(t => t.id === ticketId);
    if (index === -1) throw new Error('Ticket not found');

    tickets[index].status = 'ESCALATED';
    tickets[index].priority = 'HIGH';
    tickets[index].slaRiskLevel = 'HIGH';
    tickets[index].escalatedDate = new Date().toISOString();
    tickets[index].escalationDetails = {
      status: 'Escalated',
      tasksCreated: ['Review and respond to ticket', 'Manager outage escalation', 'Incident Bridge setup'],
      agentNotified: true,
      managerNotified: true,
      dueTime: 'Today — 2 hours',
      escalationReason: reason
    };

    saveTickets(tickets);
    return tickets[index];
  },

  async overridePriority(ticketId, newPriority, reason = 'Manager manual audit') {
    await delay();
    const tickets = loadTickets();
    const index = tickets.findIndex(t => t.id === ticketId);
    if (index === -1) throw new Error('Ticket not found');

    tickets[index].priority = newPriority;
    tickets[index].priorityOverridden = true;
    tickets[index].requiresManualReview = false;
    tickets[index].overriddenBy = 'Kathirvel (Support Manager)';
    tickets[index].overrideReason = reason;

    if (newPriority === 'HIGH') {
      tickets[index].slaRiskLevel = 'HIGH';
      tickets[index].status = 'ESCALATED';
      tickets[index].escalationDetails = {
        status: 'Escalated',
        tasksCreated: ['Review and respond to ticket', 'Manager outage escalation'],
        agentNotified: true,
        managerNotified: true,
        dueTime: 'Today — 2 hours'
      };
    }

    saveTickets(tickets);
    return tickets[index];
  },

  async getDashboardStats() {
    await delay();
    const tickets = loadTickets();
    const total = tickets.length;
    const open = tickets.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS' || t.status === 'ESCALATED').length;
    const high = tickets.filter(t => t.priority === 'HIGH' && t.status !== 'RESOLVED').length;
    const slaAtRisk = tickets.filter(t => (t.slaRiskLevel === 'HIGH' || t.slaRiskLevel === 'BREACHED') && t.status !== 'RESOLVED').length;

    return {
      openTickets: { value: 248, change: '+12.5%', isPositive: false, displayTotal: total },
      highPriority: { value: 32, change: '+4.2%', isPositive: false, activeCount: high },
      slaAtRisk: { value: 18, change: '+2.1%', isPositive: false, activeCount: slaAtRisk },
      aiAccuracy: { value: '92.4%', change: '+3.1%', isPositive: true },
      avgResolutionTime: { value: '4.8 hrs', change: '-12.3%', isPositive: true },
      automationCoverage: { value: '96.2%', change: '+5.4%', isPositive: true }
    };
  },

  async getAgentWorkload() {
    await delay();
    return loadAgents();
  },

  async getSLAStats() {
    await delay();
    const tickets = loadTickets();
    const within = tickets.filter(t => t.slaRiskLevel === 'LOW').length;
    const medium = tickets.filter(t => t.slaRiskLevel === 'MEDIUM').length;
    const high = tickets.filter(t => t.slaRiskLevel === 'HIGH').length;
    const breached = tickets.filter(t => t.slaRiskLevel === 'BREACHED').length;

    return {
      withinSLA: within,
      atRisk: medium,
      highRisk: high,
      breached: breached
    };
  },

  async getAIInsights() {
    await delay();
    const tickets = loadTickets();
    const lowConfidenceTickets = tickets.filter(t => t.requiresManualReview || t.aiConfidenceScore < 70);

    return {
      accuracy: '92.4%',
      avgConfidence: '88.7%',
      manualReviewRate: '6.8%',
      overrideRate: '7.2%',
      automationCoverage: '96.2%',
      lowConfidenceTickets
    };
  },

  getMockAccounts() {
    return MOCK_ACCOUNTS;
  },

  getMockContacts() {
    return MOCK_CONTACTS;
  },

  resetToDefaultData() {
    localStorage.setItem(STORAGE_KEY_TICKETS, JSON.stringify(INITIAL_TICKETS));
    localStorage.setItem(STORAGE_KEY_AGENTS, JSON.stringify(INITIAL_AGENTS));
    return { tickets: INITIAL_TICKETS, agents: INITIAL_AGENTS };
  }
};
