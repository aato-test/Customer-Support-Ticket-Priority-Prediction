import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Send,
  Building2,
  User,
  Inbox,
  AlertOctagon,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
  Tag,
  HelpCircle,
  FileText
} from 'lucide-react';
import { ticketService } from '../services/ticketService';
import { useTickets } from '../context/TicketContext';
import LoadingAI from '../components/LoadingAI';
import PriorityBadge from '../components/PriorityBadge';
import SLABadge from '../components/SLABadge';
import ConfidenceScore from '../components/ConfidenceScore';

export default function CreateTicket() {
  const navigate = useNavigate();
  const { createTicket } = useTickets();

  // Form states
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [account, setAccount] = useState('Acme Global Corp');
  const [contact, setContact] = useState('Sarah Jenkins (VP Eng)');
  const [ticketSource, setTicketSource] = useState('Web Form');

  // AI Pipeline states: 'form' -> 'analyzing' -> 'result' -> 'submitting'
  const [stage, setStage] = useState('form');
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState('Priya Sharma');

  const accounts = ticketService.getMockAccounts();
  const contacts = ticketService.getMockContacts();

  // Quick preset templates for rapid testing of different severities
  const handleLoadSample = (type) => {
    if (type === 'outage') {
      setSubject('Production server is down');
      setDescription('Multiple enterprise customers are experiencing complete 502 gateway timeouts. All production nodes in us-east-1 appear unresponsive. Critical business operations halted ASAP.');
      setAccount('Acme Global Corp');
      setContact('Sarah Jenkins (VP Eng)');
      setTicketSource('Web Form');
    } else if (type === 'auth') {
      setSubject('Unable to login to customer portal');
      setDescription('Single tenant corporate SSO SAML authentication is failing with error code AUTH_403. Executive users cannot access analytics.');
      setAccount('Apex Fintech Ltd');
      setContact('Michael Chang (IT Director)');
      setTicketSource('Email');
    } else if (type === 'vague') {
      setSubject('System behaves weirdly');
      setDescription('Click button and nothing happens sometimes.');
      setAccount('Starlight Media');
      setContact('Chloe Bennett (Ops Lead)');
      setTicketSource('Web Form');
    } else if (type === 'inquiry') {
      setSubject('Request for documentation on webhook security');
      setDescription('We need specifications and signature verification examples for the newly released v3 webhook payloads to satisfy our SOC2 compliance audit.');
      setAccount('CloudScale Dynamics');
      setContact('David Miller (SecOps)');
      setTicketSource('Email');
    }
  };

  const handleStartAnalysis = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      alert('Please enter both subject and description.');
      return;
    }

    setStage('analyzing');
    try {
      // Analyze text via the service layer
      const analysisResult = await ticketService.analyzeTicket(subject, description);
      setAiAnalysis(analysisResult);
      if (analysisResult.suggestedAgent) {
        setSelectedAgent(analysisResult.suggestedAgent);
      }
    } catch (err) {
      console.error(err);
      setStage('form');
    }
  };

  const handleAnalysisCompleted = () => {
    setStage('result');
  };

  const handleFinalSubmit = async () => {
    setStage('submitting');
    try {
      const newTicket = await createTicket({
        subject,
        description,
        account,
        contact,
        ticketSource,
        priority: aiAnalysis.predictedPriority,
        issueCategory: aiAnalysis.issueCategory,
        slaRiskLevel: aiAnalysis.slaRisk,
        aiConfidenceScore: aiAnalysis.aiConfidenceScore,
        aiRationale: aiAnalysis.aiRationale,
        keywordSignals: aiAnalysis.keywordSignals,
        requiresManualReview: aiAnalysis.requiresManualReview,
        assignedAgent: selectedAgent
      });

      // Navigate to details page
      navigate(`/tickets/${newTicket.id}`);
    } catch (err) {
      console.error(err);
      setStage('result');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Create Support Ticket
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Intake customer incidents with instant SupportIQ semantic analysis, SLA projection & routing
          </p>
        </div>

        {stage === 'form' && (
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <span className="text-[11px] font-bold text-slate-400 px-2 uppercase">Presets:</span>
            <button
              type="button"
              onClick={() => handleLoadSample('outage')}
              className="text-xs px-2.5 py-1 bg-white hover:bg-rose-50 text-rose-700 font-semibold rounded-lg border border-slate-200 shadow-2xs transition-colors cursor-pointer"
            >
              Outage (High)
            </button>
            <button
              type="button"
              onClick={() => handleLoadSample('auth')}
              className="text-xs px-2.5 py-1 bg-white hover:bg-amber-50 text-amber-700 font-semibold rounded-lg border border-slate-200 shadow-2xs transition-colors cursor-pointer"
            >
              Auth (Medium)
            </button>
            <button
              type="button"
              onClick={() => handleLoadSample('vague')}
              className="text-xs px-2.5 py-1 bg-white hover:bg-sky-50 text-sky-700 font-semibold rounded-lg border border-slate-200 shadow-2xs transition-colors cursor-pointer"
            >
              Vague (Review)
            </button>
          </div>
        )}
      </div>

      {/* STAGE 1: Intake Form */}
      {stage === 'form' && (
        <form onSubmit={handleStartAnalysis} className="space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
            {/* Subject */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Ticket Subject <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Production server is down, SSO login timeout..."
                className="w-full text-sm px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium text-slate-900 placeholder:text-slate-400"
              />
            </div>

            {/* Description */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Ticket Description <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-sky-700 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                  SupportIQ will analyze urgency & keywords
                </span>
              </div>
              <textarea
                required
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the customer issue in detail..."
                className="w-full text-sm p-4 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-slate-900 placeholder:text-slate-400 leading-relaxed font-normal"
              />
            </div>

            {/* Account, Contact, Source Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Account Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  Account
                </label>
                <select
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 cursor-pointer"
                >
                  {accounts.map(acc => (
                    <option key={acc} value={acc}>{acc}</option>
                  ))}
                </select>
              </div>

              {/* Contact Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Contact
                </label>
                <select
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 cursor-pointer"
                >
                  {contacts.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Ticket Source */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Inbox className="w-3.5 h-3.5 text-slate-400" />
                  Ticket Source
                </label>
                <select
                  value={ticketSource}
                  onChange={(e) => setTicketSource(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 cursor-pointer"
                >
                  <option value="Web Form">Web Form</option>
                  <option value="Email">Email</option>
                  <option value="Manual Entry">Manual Entry</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end gap-3">
            <button
              type="submit"
              className="px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-sky-600 via-teal-600 to-teal-700 hover:from-sky-700 hover:to-teal-800 rounded-xl shadow-md shadow-teal-500/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-sky-200" />
              Analyze & Create Ticket
            </button>
          </div>
        </form>
      )}

      {/* STAGE 2: Animated AI Pipeline */}
      {stage === 'analyzing' && (
        <div className="py-12">
          <LoadingAI onComplete={handleAnalysisCompleted} />
        </div>
      )}

      {/* STAGE 3: AI Analysis Result Panel */}
      {(stage === 'result' || stage === 'submitting') && aiAnalysis && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border-2 border-sky-200 p-6 sm:p-8 shadow-md relative overflow-hidden">
            {/* Background highlight */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-sky-100/40 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-sky-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-md shadow-sky-500/30">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    AI Ticket Analysis
                  </h2>
                  <p className="text-xs text-sky-700 font-medium">
                    Analysis generated by SupportIQ classification engine
                  </p>
                </div>
              </div>

              {/* Confidence Circle */}
              <div className="flex items-center gap-3 bg-sky-50 px-4 py-2 rounded-xl border border-sky-200">
                <ConfidenceScore score={aiAnalysis.aiConfidenceScore} size="lg" showCircle={true} showLabel={false} />
                <div>
                  <span className="text-[11px] uppercase font-bold tracking-wider text-slate-500 block">AI Confidence</span>
                  <span className="text-base font-extrabold text-slate-900">{aiAnalysis.aiConfidenceScore}%</span>
                </div>
              </div>
            </div>

            {/* Low confidence banner */}
            {aiAnalysis.requiresManualReview && (
              <div className="mt-5 p-4 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-3">
                <AlertOctagon className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-amber-900 block">Review Flagged</span>
                  <span className="text-amber-800">
                    Confidence ({aiAnalysis.aiConfidenceScore}%) is under the 70% threshold. The priority is provisional and queued for manager review.
                  </span>
                </div>
              </div>
            )}

            {/* Core Classification Grid */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Predicted Priority
                </span>
                <PriorityBadge priority={aiAnalysis.predictedPriority} size="md" />
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Issue Category
                </span>
                <span className="text-sm font-extrabold text-slate-900">
                  {aiAnalysis.issueCategory}
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  SLA Risk Level
                </span>
                <SLABadge riskLevel={aiAnalysis.slaRisk} size="md" />
              </div>
            </div>

            {/* AI Rationale */}
            <div className="mt-5 bg-sky-50/60 border border-sky-200/80 rounded-xl p-4">
              <span className="text-xs font-bold text-sky-950 uppercase tracking-wider block mb-1">
                AI Rationale
              </span>
              <p className="text-xs text-slate-800 leading-relaxed font-serif italic">
                &ldquo;{aiAnalysis.aiRationale}&rdquo;
              </p>
            </div>

            {/* Keyword Signals Detected */}
            {aiAnalysis.keywordSignals && (
              <div className="mt-5 pt-4 border-t border-sky-100 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mr-1">
                  <Tag className="w-3.5 h-3.5 text-sky-500" />
                  Keyword Signals Detected:
                </span>
                {aiAnalysis.keywordSignals.map(sig => (
                  <span
                    key={sig}
                    className="px-2.5 py-1 text-xs font-bold text-sky-800 bg-sky-100 border border-sky-200 rounded-lg shadow-2xs"
                  >
                    #{sig}
                  </span>
                ))}
              </div>
            )}

            {/* Automatic Assignment Preview */}
            <div className="mt-6 pt-6 border-t border-sky-100 bg-slate-50/80 -mx-6 -mb-6 p-6 rounded-b-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Automatic Agent Selection (Least-Loaded Method)
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-extrabold text-sm text-slate-900">{selectedAgent}</span>
                    <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold">
                      Eligible & Available
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setStage('form')}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
                  >
                    Edit Ticket
                  </button>
                  <button
                    type="button"
                    disabled={stage === 'submitting'}
                    onClick={handleFinalSubmit}
                    className="px-6 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {stage === 'submitting' ? 'Creating Ticket...' : 'Create Ticket & Assign Agent'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
