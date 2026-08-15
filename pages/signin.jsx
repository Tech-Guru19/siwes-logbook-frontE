import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { context } from "../src/App";
import axios from "axios";
import { ArrowLeft, Mail, Lock, LogIn } from "lucide-react";
import { useDialog } from "../src/context/DialogContext";

const Signin = () => {
  const navigate = useNavigate();
  const { showAlert } = useDialog();
  const { setStudentCred } = useContext(context);
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const handleSignin = (e) => {
    e.preventDefault();
    if (!emailAddress || !password) return showAlert("Please enter email address and password");

    axios.post("https://siwes-logbook-backend.onrender.com/user/student/signin", {
      email_address: emailAddress,
      password: password
    })
    .then((res) => {
      const studentData = res?.data?.message;
      setStudentCred(studentData);
      showAlert("Welcome back, " + (studentData?.Full_Name || "Student"));
      navigate("/student-dashboard");
    })
    .catch((err) => {
      showAlert(err?.response?.data?.message || "Sign in failed. Check your credentials.");
    });
  };

  return (
    <div className="min-h-screen bg-[#FDFDFB] flex font-sans text-slate-600 selection:bg-primary/20">
      
      {/* Left Side: Form Area */}
      <div className="w-full lg:w-1/2 flex flex-col relative px-6 md:px-16 py-12">
        <Link to="/register/accountType" className="absolute top-8 left-6 md:left-12 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors duration-300">
          <ArrowLeft className="w-4 h-4" /> Back to Gateway
        </Link>

        <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto mt-16 lg:mt-0">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 flex items-center justify-center">
                <img src="/logo.png" alt="SIWES Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Student Portal</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-primary mb-4 leading-tight">Welcome back.</h1>
            <p className="text-slate-500 font-light leading-relaxed">
              Sign in to manage your digital logbook, track your hours, and submit placement requests.
            </p>
          </div>
          
          <form onSubmit={handleSignin} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" strokeWidth={1.5} />
                <input
                  className="w-full h-14 pl-12 pr-4 bg-white border border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none text-sm font-medium transition-all"
                  placeholder="student@university.edu.ng"
                  type="email"
                  required
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" strokeWidth={1.5} />
                <input
                  className="w-full h-14 pl-12 pr-4 bg-white border border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none text-sm font-medium transition-all"
                  placeholder="••••••••"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              className="w-full h-14 bg-primary text-white font-semibold uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-3 hover:bg-[#001530] hover:shadow-[0_15px_30px_rgba(0,32,69,0.15)] hover:-translate-y-0.5 transition-all duration-300 mt-4"
              type="submit"
            >
              Sign In to Portal <LogIn className="w-4 h-4" strokeWidth={2} />
            </button>

            <div className="text-center pt-6 border-t border-slate-100 mt-8">
              <p className="text-sm text-slate-500 font-light">
                Not activated yet?{' '}
                <Link to="/signup" className="text-primary font-medium hover:text-secondary-fixed-dim transition-colors">
                  Register Here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side: Editorial Image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-[#001530] overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary-fixed-dim/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/40 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
        
        <img 
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200" 
          alt="Student coding" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" 
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#001530] via-transparent to-transparent"></div>
        
        <div className="absolute bottom-24 left-16 right-16">
          <div className="w-12 h-[2px] bg-secondary-fixed-dim mb-8"></div>
          <h2 className="text-5xl font-serif text-white leading-tight mb-6">
            "The best way to <br/><span className="italic font-light text-slate-300">predict the future</span> <br/>is to invent it."
          </h2>
          <p className="text-slate-400 font-light text-lg uppercase tracking-widest text-xs">Your Journey Starts Here</p>
        </div>
      </div>

    </div>
  );
};

export default Signin;
