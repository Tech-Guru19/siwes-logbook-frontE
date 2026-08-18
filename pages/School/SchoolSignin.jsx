import axios from 'axios'
import React, { useContext, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { context } from '../../src/App'
import { ArrowLeft, Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import { useDialog } from '../../src/context/DialogContext'
import ForgotPasswordModal from '../../src/components/Auth/ForgotPasswordModal'

const SchoolSignin = () => {
  const [showPassword, setShowPassword] = useState(false);
    const { setSchoolCred } = useContext(context)
    const navigate = useNavigate()
    const { showAlert } = useDialog()
    const [mail, setMail] = useState("")
    const [password, setpassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

    const signin = (e) => {
        e.preventDefault()
        if (!mail || !password) return showAlert("Please fill in all parameters")
        setIsLoading(true)
        axios.post("http://localhost:5687/school/signin", {
            email_address: mail,
            password
        })
            .then((output) => {
                setSchoolCred(output?.data?.message)
                navigate("/school/dashboard")
            })
            .catch((error) => {
                showAlert(error?.response?.data?.message || "Sign in failed. Check credentials.")
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

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
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Institutional Coordinator</span>
            </div>
                        <h1 className="text-4xl md:text-5xl font-serif text-primary mb-4 leading-tight">Institution Login.</h1>
                        <p className="text-slate-500 font-light leading-relaxed">
                            Access your management portal to register departments, monitor students, and oversee academic supervisors.
                        </p>
                    </div>
                    
                    <form onSubmit={signin} className="space-y-6">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Official Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" strokeWidth={1.5} />
                                <input
                                    className="w-full h-14 pl-12 pr-4 bg-white border border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none text-sm font-medium transition-all"
                                    placeholder="admin@institution.edu.ng"
                                    type="email"
                                    required
                                    value={mail}
                                    onChange={(e) => setMail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400">Password</label>
                                <button 
                                    type="button" 
                                    onClick={() => setIsForgotModalOpen(true)}
                                    className="text-xs font-bold text-primary hover:text-slate-900 transition-colors"
                                >
                                    Forgot Password?
                                </button>
                            </div>
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
                            className="w-full h-14 bg-primary text-white font-semibold uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-3 hover:bg-[#001530] hover:shadow-[0_15px_30px_rgba(0,32,69,0.15)] hover:-translate-y-0.5 transition-all duration-300 mt-4 disabled:opacity-50 disabled:hover:translate-y-0"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? "Signing In..." : "Sign In to Portal"} <LogIn className="w-4 h-4" strokeWidth={2} />
                        </button>

                        <div className="text-center pt-6 border-t border-slate-100 mt-8">
                            <p className="text-sm text-slate-500 font-light">
                                Don't have an admin account?{' '}
                                <Link to="/school/signup" className="text-primary font-medium hover:text-secondary-fixed-dim transition-colors">
                                    Register Here
                                </Link>
                            </p>
                        </div>
                    </form>
                    <ForgotPasswordModal isOpen={isForgotModalOpen} onClose={() => setIsForgotModalOpen(false)} role="school" />
                </div>
            </div>

            {/* Right Side: Editorial Image */}
            <div className="hidden lg:block lg:w-1/2 relative bg-[#001530] overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary-fixed-dim/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
                
                <img 
                    src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200" 
                    alt="University Campus" 
                    className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay" 
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-[#001530] via-transparent to-transparent"></div>
                
                <div className="absolute bottom-24 left-16 right-16">
                    <div className="w-12 h-[2px] bg-secondary-fixed-dim mb-8"></div>
                    <h2 className="text-5xl font-serif text-white leading-tight mb-6">
                        "Empowering the <br/><span className="italic font-light text-slate-300">next generation</span> <br/>of industry leaders."
                    </h2>
                    <p className="text-slate-400 font-light text-lg uppercase tracking-widest text-xs">Institutional Oversight</p>
                </div>
            </div>
        </div>
    )
}

export default SchoolSignin