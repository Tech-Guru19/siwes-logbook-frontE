import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FDFDFB] flex items-center justify-center p-6 selection:bg-primary/20 font-sans">
      <div className="max-w-md w-full bg-white border border-slate-100 rounded-[2rem] p-10 lg:p-12 text-center shadow-[0_20px_50px_rgba(0,32,69,0.03)] relative overflow-hidden animate-in zoom-in-95 duration-500">
        {/* Decorative background elements */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 space-y-8 flex flex-col items-center">
          {/* Icon/Illustration */}
          <div className="relative w-32 h-32 flex items-center justify-center group">
            <div className="absolute inset-0 bg-primary/5 rounded-full animate-pulse"></div>
            <Compass className="w-16 h-16 text-primary relative z-10 group-hover:rotate-45 transition-transform duration-700" strokeWidth={1.5} />
            <div className="absolute top-2 right-2 w-8 h-8 bg-white border border-slate-100 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-rose-500 font-black text-lg pb-0.5">!</span>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl font-serif font-bold text-slate-900 tracking-tight">404</h1>
            <h2 className="text-xl font-serif font-bold text-slate-800">Page Not Found</h2>
            <p className="text-slate-500 text-sm font-light leading-relaxed max-w-[250px] mx-auto">
              Oops! It looks like this page got lost in the filing cabinet. The link might be broken or the page may have been moved.
            </p>
          </div>

          <div className="pt-6 space-y-4 w-full border-t border-slate-100">
            <button 
              onClick={() => navigate(-1)} 
              className="w-full h-12 bg-primary text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[#001530] hover:shadow-[0_10px_20px_rgba(0,32,69,0.15)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
            <Link 
              to="/" 
              className="w-full h-12 bg-white text-slate-600 text-xs font-bold uppercase tracking-widest rounded-xl border border-slate-200 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
