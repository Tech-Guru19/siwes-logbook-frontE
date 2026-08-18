import React from 'react';
import { Search, Bell, HelpCircle, UserCircle, Info, ShieldCheck, Send, Loader2 } from "lucide-react";

const SupervisionAcctRequest = () => {
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="bg-[#FDFDFB] min-h-screen flex flex-col font-sans selection:bg-primary/20 text-slate-600">
        <header className="fixed top-0 w-full bg-white/80 backdrop-blur-xl border-b border-slate-100 flex justify-between items-center px-6 lg:px-12 h-20 z-50 transition-all duration-200 ease-in-out">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-serif font-bold text-primary">
              SIWES Management
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <div className="relative group">
              <div className="flex items-center bg-slate-50 px-4 py-2.5 rounded-full border border-slate-200 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all">
                <Search className="text-slate-400 w-4 h-4 mr-2" />
                <input
                  className="bg-transparent border-none focus:ring-0 text-sm font-medium w-48 outline-none text-slate-700"
                  placeholder="Search resources..."
                  type="text"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-200 flex items-center justify-center transition-all">
              <Bell className="text-primary w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-200 flex items-center justify-center transition-all">
              <HelpCircle className="text-primary w-5 h-5" />
            </button>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <UserCircle className="text-primary w-6 h-6" />
            </div>
          </div>
        </header>

        <main className="flex-grow flex items-center justify-center p-6 lg:p-12 pt-32 pb-16">
          <div className="w-full max-w-2xl">
            <div className="mb-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="inline-flex items-center justify-center p-4 bg-white border border-slate-100 rounded-2xl mb-6 shadow-sm">
                <img
                  alt="Institution Logo"
                  className="h-12 w-12 object-contain"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBUq_iC1SIcGpH05XT3k12T_ad9TASnk5h2sZD092hft7-qRFMzOo4w5S5bYTkUtL52NyTHLajdzCbauI8zOFkSjhwZTuiO-7EYfrxN5kJGd1VGAImOIfKvWUT1uI2nzWELgWD1qvhRjYLfbd7Afgu8uu4ep2G_mJM3PD6ljYktmGpMOFUplMTtuaNkLnqc3RaddhJyyIhQpXxleshxH35owRNcqdaYlJui5JMXLdlVTfNun74pnH02nyBOqZqomzazCM9Bu09bS6r"
                />
              </div>
              <h1 className="font-serif font-bold text-3xl lg:text-4xl text-slate-900 mb-3">
                Request Supervisor Access
              </h1>
              <p className="font-light text-slate-500 max-w-md mx-auto">
                Complete the registration form to join the institutional SIWES
                platform.
              </p>
            </div>

            <div className="bg-white border border-slate-100 rounded-[2rem] shadow-[0_20px_50px_rgba(0,32,69,0.03)] overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="p-8 lg:p-12">
                <div className="mb-10 flex items-start gap-4 bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                  <Info className="text-blue-500 w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm font-light text-blue-900 leading-relaxed">
                    Registration requests are manually reviewed by the
                    Institutional SIWES Coordinator. You will receive an email
                    confirmation once your access is approved.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                      Full Name
                    </label>
                    <input
                      className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-800"
                      placeholder="Dr. Jane Smith"
                      type="text"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                      Institutional Email
                    </label>
                    <input
                      className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-800"
                      placeholder="j.smith@university.edu.ng"
                      type="email"
                    />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5 mt-2 ml-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      Must be a valid @university.edu.ng address.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                        Department/Faculty
                      </label>
                      <select className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-800 cursor-pointer appearance-none">
                        <option disabled selected value="">
                          Select Department
                        </option>
                        <option>Computer Science</option>
                        <option>Mechanical Engineering</option>
                        <option>Biological Sciences</option>
                        <option>Architecture</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                        Staff ID Number
                      </label>
                      <input
                        className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-800"
                        placeholder="STF/2023/048"
                        type="text"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 ml-1">
                      Role
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="relative flex items-center p-4 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-primary/50 transition-all cursor-pointer group">
                        <input
                          className="w-4 h-4 text-primary bg-slate-100 border-slate-300 focus:ring-primary focus:ring-2"
                          name="role"
                          type="radio"
                        />
                        <span className="ml-3 text-sm font-bold text-slate-700">
                          Departmental Coordinator
                        </span>
                      </label>
                      <label className="relative flex items-center p-4 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-primary/50 transition-all cursor-pointer group">
                        <input
                          className="w-4 h-4 text-primary bg-slate-100 border-slate-300 focus:ring-primary focus:ring-2"
                          name="role"
                          type="radio"
                        />
                        <span className="ml-3 text-sm font-bold text-slate-700">
                          Industry Liaison
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-slate-100">
                    <button
                      className="w-full h-14 bg-primary text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[#001530] hover:shadow-[0_10px_20px_rgba(0,32,69,0.15)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Submitting Request...</>
                      ) : (
                        <>Submit Request <Send className="w-4 h-4" /></>
                      )}
                    </button>
                    <div className="mt-8 text-center">
                      <a
                        className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-[#001530] transition-colors"
                        href="/SignIn"
                      >
                        Already have an account? Sign in
                      </a>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="mt-12 flex justify-center items-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              <img
                alt="ITF Nigeria"
                className="h-10 object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfHDpB4UDBdDtQMbt8fpXTTdpgUKR3fli1BC1sY_u9YPNZG9yE66sE2LXFjJEtDC7014ygc6nspWU_1PgulDC1Zas74t8N84AuEO0Y-D3ssvTTD8U4BLq8Fnxamdw9a_fIxZsIGS_1GsUYCU5VnaIE6SyKHF05QVqR15Z2oFHri2epjCLZ7GuikIM7BhzurELy_8ZXU17fX_2R_isq2B4rrsOcSRB2IoIIXz3V7BMrv_aAtHzEGG1SndGiJKBg2sBvf7LXS-hK2AKI"
              />
              <img
                alt="Academic Council"
                className="h-10 object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCk-aTycsiLQzPD0ggBOP49YIXbxS_t4fL2W5JQRo9LpTJIkADpEiQYAtShhoD4DYnjr4Wx4wxV_4aADabuFxff809sbuxV9OGLXMh5zKD3VCr9bVOw-pFRXo3sLzatcL7pVW1p2zCTRILGGERaGqlcHj4oI5H39zsm7PKwE5nMD9ZM0lF2_4mgOhTTs44bjMGhF9VcA9T60ME7sixkfErh3LXyPDCAiQqISnW9Kssu8rHooTvwecaA3pzEGOM1WUUmEDA2FHmRFwpz"
              />
            </div>
          </div>
        </main>

        <footer className="w-full py-8 border-t bg-white border-slate-100 flex flex-col md:flex-row justify-between items-center px-6 lg:px-12 gap-6 mt-auto">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center md:text-left">
            © 2024 SIWES Management System. Institutional Reliability &
            Administrative Efficiency.
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <a
              className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors"
              href="#"
            >
              Privacy Policy
            </a>
            <a
              className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors"
              href="#"
            >
              Terms of Service
            </a>
            <a
              className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors"
              href="#"
            >
              Support Desk
            </a>
          </div>
        </footer>
    </div>
  );
};

export default SupervisionAcctRequest;
