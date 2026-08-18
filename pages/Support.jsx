import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Search, HelpCircle, Send, AlertCircle, BookOpen, LifeBuoy } from "lucide-react";
import { context } from '../src/App';

const Support = () => {
  const navigate = useNavigate();
  const { studentCred, schoolSupervisorCred, organizationSupervisorCred, schoolCred, organizationCred } = useContext(context);
  
  const isLoggedIn = studentCred || schoolSupervisorCred || organizationSupervisorCred || schoolCred || organizationCred;

  const [ticketData, setTicketData] = useState({
    user_type: isLoggedIn ? (studentCred ? 'Student' : schoolCred ? 'School' : 'Supervisor') : 'Guest',
    user_email: isLoggedIn ? (studentCred?.Email_Address || schoolCred?.Email_Address || '') : '',
    issue_type: 'Technical Issue',
    subject: '',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await axios.post('http://localhost:5687/support/ticket', ticketData);
      if (response.data.success) {
        setToast({ show: true, message: 'Ticket submitted successfully! Our team will contact you shortly.', type: 'success' });
        setTicketData({ ...ticketData, subject: '', description: '' });
      }
    } catch (error) {
      setToast({ show: true, message: 'Failed to submit ticket. Please try again.', type: 'error' });
    } finally {
      setSubmitting(false);
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFB] font-sans text-slate-600 selection:bg-primary/20 flex flex-col">
      {/* Toast */}
      {toast.show && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4">
          <div className={`px-6 py-4 rounded-2xl shadow-2xl border flex items-center gap-3 ${toast.type === 'success' ? 'bg-emerald-500 border-emerald-600 text-white' : 'bg-rose-500 border-rose-600 text-white'}`}>
            <span className="material-symbols-outlined">{toast.type === 'success' ? 'check_circle' : 'error'}</span>
            <span className="font-bold text-sm tracking-wide">{toast.message}</span>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
        <nav className="flex items-center justify-between px-6 lg:px-12 h-20 max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-14 h-14 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <img src="/logo.png" alt="SIWES Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl font-serif font-medium tracking-tight text-primary">
              SIWES Support
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/Docs" className="text-xs uppercase tracking-widest font-semibold text-slate-500 hover:text-primary transition-colors">
              Documentation
            </Link>
            {isLoggedIn ? (
              <button onClick={() => navigate(-1)} className="bg-primary text-white text-xs font-semibold uppercase tracking-widest px-6 py-3 rounded-full hover:bg-[#001530] transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5">
                Dashboard
              </button>
            ) : (
              <Link to="/register/accountType" className="bg-primary text-white text-xs font-semibold uppercase tracking-widest px-6 py-3 rounded-full hover:bg-[#001530] transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5">
                Begin
              </Link>
            )}
          </div>
        </nav>
      </header>

      <main className="flex-1 pt-20">
        
        {/* HERO */}
        <section className="relative pt-24 pb-32 px-6 overflow-hidden bg-[#001530] text-white">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary-fixed-dim/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/30 rounded-full blur-[100px] mix-blend-screen pointer-events-none"></div>
          
          <div className="relative max-w-4xl mx-auto text-center z-10">
            <h1 className="text-5xl md:text-7xl font-serif mb-8 leading-tight">
              How can we <br/><span className="italic font-light text-slate-300">assist you?</span>
            </h1>
            <p className="text-slate-400 text-xl font-light mb-12 max-w-2xl mx-auto">
              Search our knowledge base or reach out to our dedicated support team to resolve any technical issues.
            </p>
            <div className="relative max-w-2xl mx-auto shadow-2xl rounded-2xl overflow-hidden group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6 group-focus-within:text-primary transition-colors" />
              <input
                className="w-full pl-16 pr-6 py-6 bg-white text-slate-800 text-lg outline-none font-medium focus:ring-4 focus:ring-primary/20 transition-all placeholder:text-slate-400 placeholder:font-light"
                placeholder="Search for guides, articles, or technical issues..."
                type="text"
              />
            </div>
          </div>
        </section>

        {/* SPLIT SCREEN CONTENT */}
        <section className="max-w-7xl mx-auto px-6 py-24 relative z-20 -mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* LEFT: Quick Links & Documentation */}
            <div className="lg:col-span-5 space-y-8">
              <div className="bg-white rounded-[2rem] p-10 shadow-[0_20px_60px_rgba(0,32,69,0.05)] border border-slate-100">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-8">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-3xl font-serif text-slate-900 mb-4">Documentation</h2>
                <p className="text-slate-500 font-light leading-relaxed mb-8">
                  Prefer to solve it yourself? We have completely documented every flow, dashboard, and feature of the platform.
                </p>
                <Link to="/Docs" className="inline-flex items-center gap-3 bg-slate-50 border border-slate-200 text-slate-700 font-semibold px-8 py-4 rounded-xl hover:bg-white hover:border-primary hover:text-primary hover:shadow-lg transition-all w-full justify-center">
                  Read the Platform Guide <ArrowLeft className="w-4 h-4 rotate-180" />
                </Link>
              </div>

              <div className="bg-gradient-to-br from-primary to-[#001530] rounded-[2rem] p-10 text-white shadow-xl relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-secondary-fixed-dim mb-6 relative z-10">Direct Contact</h3>
                <h4 className="text-3xl font-serif mb-6 relative z-10">IT Helpdesk</h4>
                <p className="text-slate-300 font-light mb-8 relative z-10">
                  For immediate institutional matters, contact the university's technical team.
                </p>
                <div className="space-y-4 relative z-10">
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-sm font-semibold tracking-wide text-center">
                    it-support@futo.edu.ng
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-sm font-semibold tracking-wide text-center">
                    +234 800 123 4567
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Ticket Form */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-[3rem] p-10 lg:p-14 shadow-[0_30px_80px_rgba(0,32,69,0.08)] border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary-fixed-dim to-primary"></div>
                
                <div className="mb-10">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary-fixed-dim mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> Open a Request
                  </h3>
                  <h2 className="text-4xl font-serif text-slate-900 leading-tight">Submit a Ticket</h2>
                  <p className="text-slate-500 font-light mt-4">
                    Describe your issue in detail. Our support agents usually respond within 24 hours.
                  </p>
                </div>

                <form onSubmit={handleTicketSubmit} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Issue Category</label>
                    <select 
                      value={ticketData.issue_type}
                      onChange={(e) => setTicketData({...ticketData, issue_type: e.target.value})}
                      className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all appearance-none cursor-pointer"
                    >
                      <option>Technical Issue</option>
                      <option>Account Access</option>
                      <option>Logbook Error</option>
                      <option>Institution Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Subject</label>
                    <input
                      required
                      value={ticketData.subject}
                      onChange={(e) => setTicketData({...ticketData, subject: e.target.value})}
                      className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                      placeholder="Briefly summarize the problem..."
                      type="text"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Detailed Description</label>
                    <textarea
                      required
                      value={ticketData.description}
                      onChange={(e) => setTicketData({...ticketData, description: e.target.value})}
                      className="w-full p-5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none"
                      placeholder="Please provide as much detail as possible to help us resolve the issue quickly..."
                      rows="6"
                    ></textarea>
                  </div>

                  <button 
                    disabled={submitting}
                    className="w-full h-16 bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#001530] hover:shadow-[0_15px_30px_rgba(0,32,69,0.15)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none mt-8"
                  >
                    {submitting ? 'Sending Request...' : 'Submit Support Ticket'}
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
            
          </div>
        </section>
      </main>
      
      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <span className="font-serif text-xl text-primary font-medium">SIWES Logbook.</span>
            <p className="text-xs font-light tracking-wide text-slate-400">
              © 2026 SIWES Logbook Management System. Handcrafted.
            </p>
          </div>
          <div className="flex gap-8">
            <Link to="/Docs" className="text-xs font-medium uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">Documentation</Link>
            <span className="text-xs font-medium uppercase tracking-widest text-slate-300">Privacy</span>
            <span className="text-xs font-medium uppercase tracking-widest text-slate-300">Terms</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Support;
