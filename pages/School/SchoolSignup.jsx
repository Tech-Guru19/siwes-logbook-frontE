import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Mail as MailIcon, Lock, Building, KeyRound, CheckCircle2, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useDialog } from '../../src/context/DialogContext'

const SchoolSignup = () => {
  const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate()
    const { showAlert } = useDialog()
    const [Name, setName] = useState("")
    const [Mail, setMail] = useState("")
    const [password, setpassword] = useState("")
    const [Location, setLocation] = useState("")
    const [otpCode, setOtpCode] = useState("")
    const [isOtpSent, setIsOtpSent] = useState(false)
    const [isOtpVerified, setIsOtpVerified] = useState(false)
    const [otpLoading, setOtpLoading] = useState(false)

    const proceed = (e) => {
        e.preventDefault()
        if (!Name || !Mail || !password || !Location || !otpCode) {
            return showAlert("Please input all parameters including OTP code")
        }
        if (!isOtpVerified) {
            return showAlert("Please verify your email address with the OTP code first.")
        }
        if (password.length < 5) {
            return showAlert("Please use a strong password")
        }
        navigate("/school/signup/proceed", {
            state: {
                Name,
                Mail,
                password,
                Location,
                otpCode
            }
        })
    }

    const handleSendOtp = async () => {
        if (!Mail) return showAlert("Please enter the admin email address first.");
        setOtpLoading(true);
        try {
            const { default: axios } = await import('axios');
            await axios.post("https://siwes-logbook-backend.onrender.com/auth/otp/send", { email_address: Mail });
            showAlert("OTP sent to your email!");
            setIsOtpSent(true);
        } catch (err) {
            showAlert(err?.response?.data?.message || "Failed to send OTP.");
        } finally {
            setOtpLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otpCode) return showAlert("Please enter the OTP code.");
        setOtpLoading(true);
        try {
            const { default: axios } = await import('axios');
            await axios.post("https://siwes-logbook-backend.onrender.com/auth/otp/verify", { email_address: Mail, otp_code: otpCode });
            showAlert("Email verified successfully!");
            setIsOtpVerified(true);
        } catch (err) {
            showAlert(err?.response?.data?.message || "Invalid OTP code.");
        } finally {
            setOtpLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFDFB] flex font-sans text-slate-600 selection:bg-primary/20">
            
            {/* Left Side: Form Area */}
            <div className="w-full lg:w-1/2 flex flex-col relative px-6 md:px-16 py-12 h-screen overflow-y-auto custom-scrollbar">
                <Link to="/register/accountType" className="absolute top-8 left-6 md:left-12 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors duration-300">
                    <ArrowLeft className="w-4 h-4" /> Back to Gateway
                </Link>

                <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto mt-20 lg:mt-10 mb-10">
                    <div className="mb-10">
                        <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 flex items-center justify-center">
                <img src="/logo.png" alt="SIWES Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Institutional Setup (Step 1 of 2)</span>
            </div>
                        <h1 className="text-4xl md:text-5xl font-serif text-primary mb-4 leading-tight">Register your <br/>institution.</h1>
                        <p className="text-slate-500 font-light leading-relaxed">
                            Provide your basic institution details to initialize the SIWES management platform.
                        </p>
                    </div>
                    
                    <form onSubmit={proceed} className="space-y-6">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Institution Name</label>
                            <div className="relative">
                                <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" strokeWidth={1.5} />
                                <input
                                    className="w-full h-14 pl-12 pr-4 bg-white border border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none text-sm font-medium transition-all"
                                    placeholder="e.g. SQI College of ICT"
                                    type="text"
                                    required
                                    value={Name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Admin Email Address</label>
                            <div className="relative flex gap-3">
                                <div className="relative flex-1">
                                    <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" strokeWidth={1.5} />
                                    <input
                                        className="w-full h-14 pl-12 pr-4 bg-white border border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none text-sm font-medium transition-all disabled:opacity-60 disabled:bg-slate-50"
                                        placeholder="admin@institution.edu.ng"
                                        type="email"
                                        required
                                        disabled={isOtpVerified}
                                        value={Mail}
                                        onChange={(e) => setMail(e.target.value)}
                                    />
                                    {isOtpVerified && (
                                        <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                                    )}
                                </div>
                                {!isOtpVerified && (
                                    <button
                                        type="button"
                                        onClick={handleSendOtp}
                                        disabled={otpLoading || !Mail}
                                        className="h-14 px-6 bg-primary/5 text-primary border border-primary/10 hover:bg-primary hover:text-white font-semibold uppercase tracking-widest text-xs rounded-xl transition-all duration-300 disabled:opacity-50 whitespace-nowrap flex items-center gap-2"
                                    >
                                        {otpLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : null}
                                        {isOtpSent ? "Resend" : "Get OTP"}
                                    </button>
                                )}
                            </div>
                        </div>

                        {isOtpSent && !isOtpVerified && (
                            <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl animate-in fade-in slide-in-from-top-2">
                                <label className="block text-xs font-semibold uppercase tracking-widest text-primary mb-2">Verification Code *</label>
                                <div className="relative flex gap-3">
                                    <div className="relative flex-1">
                                        <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" strokeWidth={1.5} />
                                        <input
                                            className="w-full h-14 pl-12 pr-4 bg-white border border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none text-base tracking-[0.3em] font-bold transition-all"
                                            placeholder="1234"
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
                                        {otpLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : null}
                                        Verify
                                    </button>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Physical Address</label>
                            <div className="relative">
                                <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" strokeWidth={1.5} />
                                <input
                                    className="w-full h-14 pl-12 pr-4 bg-white border border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none text-sm font-medium transition-all"
                                    placeholder="Enter full physical address..."
                                    type="text"
                                    required
                                    value={Location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Create Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" strokeWidth={1.5} />
                                <input
                                    className="w-full h-14 pl-12 pr-12 bg-white border border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none text-sm font-medium transition-all"
                                    placeholder="••••••••"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setpassword(e.target.value)}
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
                            disabled={!isOtpVerified}
                        >
                            Next Step <ArrowRight className="w-4 h-4" />
                        </button>

                        <div className="text-center pt-6 border-t border-slate-100 mt-8 pb-8">
                            <p className="text-sm text-slate-500 font-light">
                                Already have an admin account?{' '}
                                <Link to="/school/signin" className="text-primary font-medium hover:text-secondary-fixed-dim transition-colors">
                                    Sign In Here
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>

            {/* Right Side: Editorial Image */}
            <div className="hidden lg:block lg:w-1/2 relative bg-[#001530] overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-secondary-fixed-dim/20 rounded-full blur-[150px] mix-blend-screen pointer-events-none"></div>
                
                <img 
                    src="https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&q=80&w=1200" 
                    alt="University Library" 
                    className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay" 
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-[#001530] via-transparent to-transparent"></div>
                
                <div className="absolute bottom-24 left-16 right-16">
                    <div className="w-12 h-[2px] bg-secondary-fixed-dim mb-8"></div>
                    <h2 className="text-5xl font-serif text-white leading-tight mb-6">
                        "Building a bridge <br/><span className="italic font-light text-slate-300">between academia</span> <br/>and industry."
                    </h2>
                    <p className="text-slate-400 font-light text-lg uppercase tracking-widest text-xs">A unified ecosystem</p>
                </div>
            </div>
        </div>
    )
}

export default SchoolSignup