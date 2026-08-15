import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Lock, Home, KeyRound, CheckCircle2, RefreshCw, Eye, EyeOff } from 'lucide-react';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [personalEmail, setPersonalEmail] = useState("");
  const [institutionEmail, setInstitutionEmail] = useState("");
  const [contactAddress, setContactAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const signUp = (e) => {
    e.preventDefault();
    if (!personalEmail || !institutionEmail || !contactAddress || !password || !otpCode) {
      return alert("Please fill in all parameters including OTP code");
    }
    if (!isOtpVerified) {
      return alert("Please verify your email address with the OTP code first.");
    }

    setLoading(true);
    axios
      .post("https://siwes-logbook-backend.onrender.com/user/student/signup", {
        email_address: personalEmail,
        Instituition_Mail: institutionEmail,
        Contact_Adress: contactAddress,
        password: password,
        Profile_Img: null,
        otp_code: otpCode
      })
      .then(() => {
        alert("Student profile activated successfully! You can now sign in.");
        navigate("/SignIn");
      })
      .catch((err) => {
        alert(err?.response?.data?.message || "Activation failed. Please check that your email address was pre-registered by your institution.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSendOtp = () => {
    if (!personalEmail) {
      return alert("Please enter your personal email address first.");
    }
    setOtpLoading(true);
    axios.post("https://siwes-logbook-backend.onrender.com/auth/otp/send", { email_address: personalEmail })
      .then(() => {
        alert("OTP sent to your email!");
        setIsOtpSent(true);
      })
      .catch((err) => {
        alert(err?.response?.data?.message || "Failed to send OTP.");
      })
      .finally(() => {
        setOtpLoading(false);
      });
  };

  const handleVerifyOtp = () => {
    if (!otpCode) {
      return alert("Please enter the OTP code.");
    }
    setOtpLoading(true);
    axios.post("https://siwes-logbook-backend.onrender.com/auth/otp/verify", { email_address: personalEmail, otp_code: otpCode })
      .then(() => {
        alert("Email verified successfully!");
        setIsOtpVerified(true);
      })
      .catch((err) => {
        alert(err?.response?.data?.message || "Invalid OTP code.");
      })
      .finally(() => {
        setOtpLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-[#FDFDFB] flex font-sans text-slate-600 selection:bg-primary/20">

      {/* Left Side: Form Area */}
      <div className="w-full lg:w-1/2 flex flex-col relative px-4 sm:px-6 md:px-16 py-8 md:py-12 h-screen overflow-y-auto custom-scrollbar">
        <Link to="/register/accountType" className="absolute top-6 md:top-8 left-4 sm:left-6 md:left-12 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors duration-300">
          <ArrowLeft className="w-4 h-4" /> Back to Gateway
        </Link>
        <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto mt-16 sm:mt-20 lg:mt-10 mb-6 sm:mb-10">
          <div className="mb-10">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                <img src="/logo.png" alt="SIWES Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Student Activation</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-primary mb-2 sm:mb-4 leading-tight">Join the ecosystem.</h1>
            <p className="text-slate-500 font-light leading-relaxed">
              Activate your pre-registered student profile to start recording daily work logs and submit assessments.
            </p>
          </div>

          <form onSubmit={signUp} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Personal Email Address *</label>
              <div className="relative flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" strokeWidth={1.5} />
                  <input
                    className="w-full h-14 pl-12 pr-4 bg-white border border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none text-sm font-medium transition-all disabled:opacity-60 disabled:bg-slate-50"
                    placeholder="name@personal.com"
                    type="email"
                    required
                    disabled={isOtpVerified}
                    value={personalEmail}
                    onChange={(e) => setPersonalEmail(e.target.value)}
                  />
                  {isOtpVerified && (
                    <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                  )}
                </div>
                {!isOtpVerified && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={otpLoading || !personalEmail}
                    className="h-14 px-6 bg-primary/5 text-primary border border-primary/10 hover:bg-primary hover:text-white font-semibold uppercase tracking-widest text-xs rounded-xl transition-all duration-300 disabled:opacity-50 whitespace-nowrap flex items-center gap-2"
                  >
                    {otpLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                    {isOtpSent ? "Resend" : "Get OTP"}
                  </button>
                )}
              </div>
            </div>

            {isOtpSent && !isOtpVerified && (
              <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl animate-in fade-in slide-in-from-top-2">
                <label className="block text-xs font-semibold uppercase tracking-widest text-primary mb-2">Verification Code *</label>
                <div className="relative flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" strokeWidth={1.5} />
                    <input
                      className="w-full h-14 pl-12 pr-4 bg-white border border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none text-base tracking-[0.3em] font-bold transition-all"
                      placeholder="123456"
                      type="text"
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={otpLoading || !otpCode}
                    className="h-14 px-8 bg-primary text-white font-semibold uppercase tracking-widest text-xs rounded-xl hover:bg-[#001530] transition-colors duration-300 disabled:opacity-50 flex items-center gap-2"
                  >
                    {otpLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                    Verify
                  </button>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Institutional Email *</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" strokeWidth={1.5} />
                <input
                  className="w-full h-14 pl-12 pr-4 bg-white border border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none text-sm font-medium transition-all"
                  placeholder="student@institution.edu.ng"
                  type="email"
                  required
                  value={institutionEmail}
                  onChange={(e) => setInstitutionEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Residential Address *</label>
              <div className="relative">
                <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" strokeWidth={1.5} />
                <input
                  className="w-full h-14 pl-12 pr-4 bg-white border border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none text-sm font-medium transition-all"
                  placeholder="Full physical address..."
                  type="text"
                  required
                  value={contactAddress}
                  onChange={(e) => setContactAddress(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Create Password *</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" strokeWidth={1.5} />
                <input
                  className="w-full h-14 pl-12 pr-12 bg-white border border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none text-sm font-medium transition-all"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              className="w-full h-14 bg-primary text-white font-semibold uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-3 hover:bg-[#001530] hover:shadow-[0_15px_30px_rgba(0,32,69,0.15)] hover:-translate-y-0.5 transition-all duration-300 mt-8 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
              type="submit"
              disabled={loading || !isOtpVerified}
            >
              {loading ? "Activating..." : "Activate Account"}
            </button>

            <div className="text-center pt-6 border-t border-slate-100 mt-8 pb-8">
              <p className="text-sm text-slate-500 font-light">
                Already activated?{' '}
                <Link to="/SignIn" className="text-primary font-medium hover:text-secondary-fixed-dim transition-colors">
                  Sign In Here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side: Editorial Image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-[#001530] overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-secondary-fixed-dim/20 rounded-full blur-[150px] mix-blend-screen pointer-events-none"></div>

        <img
          src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=1200"
          alt="Student typing"
          className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#001530] via-transparent to-transparent"></div>

        <div className="absolute bottom-24 left-16 right-16">
          <div className="w-12 h-[2px] bg-secondary-fixed-dim mb-8"></div>
          <h2 className="text-5xl font-serif text-white leading-tight mb-6">
            "Education is not <br />the learning of facts, <br /><span className="italic font-light text-slate-300">but the training of the mind.</span>"
          </h2>
          <p className="text-slate-400 font-light text-lg uppercase tracking-widest text-xs">Albert Einstein</p>
        </div>
      </div>

    </div>
  );
};

export default Signup;
