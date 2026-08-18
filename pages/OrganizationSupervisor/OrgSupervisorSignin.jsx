import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { context } from '../../src/App'
import axios from 'axios'
import { ArrowLeft, Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import { useDialog } from '../../src/context/DialogContext'
import ForgotPasswordModal from '../../src/components/Auth/ForgotPasswordModal'

const OrgSupervisorSignin = () => {
  const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate()
    const { showAlert } = useDialog()
    const { setOrganizationSupervisorCred } = useContext(context)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

    const handleSignin = (e) => {
        e.preventDefault()
        if (!email || !password) return showAlert('Please enter email and password')

        axios.post('https://siwes-logbook-backend.onrender.com/organization-supervisor/signin', {
            email_address: email,
            password: password
        })
        .then((res) => {
            const supervisorData = res?.data?.message
            setOrganizationSupervisorCred(supervisorData)
            showAlert('Welcome, ' + (supervisorData?.Full_Name || 'Industry Supervisor'))
            navigate('/organization-supervisor/dashboard')
        })
        .catch((err) => {
            showAlert(err?.response?.data?.message || 'Sign in failed. Verify your credentials.')
        })
    }

    return (
        <div className="min-h-screen bg-[#FDFDFB] flex font-sans text-slate-600 selection:bg-primary/20">
            
            {/* Left Side: Form Area */}
            <div className="w-full lg:w-1/2 flex flex-col relative px-4 sm:px-6 md:px-16 py-8 md:py-12">
                <Link to="/register/accountType" className="absolute top-6 md:top-8 left-4 sm:left-6 md:left-12 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors duration-300">
                    <ArrowLeft className="w-4 h-4" /> Back to Gateway
                </Link>

                <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto mt-14 sm:mt-16 lg:mt-0">
                    <div className="mb-10">
                        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                <img src="/logo.png" alt="SIWES Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Industry Mentor</span>
            </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-primary mb-2 sm:mb-4 leading-tight">Supervisor Login.</h1>
                        <p className="text-slate-500 font-light leading-relaxed">
                            Access workplace intern logbooks, verify attendance, and submit weekly sign-offs.
                        </p>
                    </div>
                    
                    <form onSubmit={handleSignin} className="space-y-6">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Supervisor Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" strokeWidth={1.5} />
                                <input
                                    className="w-full h-14 pl-12 pr-4 bg-white border border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none text-sm font-medium transition-all"
                                    placeholder="supervisor@company.com"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                            className="w-full h-14 bg-primary text-white font-semibold uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-3 hover:bg-[#001530] hover:shadow-[0_15px_30px_rgba(0,32,69,0.15)] hover:-translate-y-0.5 transition-all duration-300 mt-4"
                            type="submit"
                        >
                            Sign In to Portal <LogIn className="w-4 h-4" strokeWidth={2} />
                        </button>

                        <div className="text-center pt-6 border-t border-slate-100 mt-8">
                            <p className="text-sm text-slate-500 font-light">
                                First time logging in?{' '}
                                <Link to="/organization-supervisor/signup" className="text-primary font-medium hover:text-secondary-fixed-dim transition-colors">
                                    Activate Account Here
                                </Link>
                            </p>
                        </div>
                    </form>
                    <ForgotPasswordModal isOpen={isForgotModalOpen} onClose={() => setIsForgotModalOpen(false)} role="org_supervisor" />
                </div>
            </div>

            {/* Right Side: Editorial Image */}
            <div className="hidden lg:block lg:w-1/2 relative bg-[#001530] overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary-fixed-dim/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
                
                <img 
                    src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1200" 
                    alt="Corporate Mentor" 
                    className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay" 
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-[#001530] via-transparent to-transparent"></div>
                
                <div className="absolute bottom-24 left-16 right-16">
                    <div className="w-12 h-[2px] bg-secondary-fixed-dim mb-8"></div>
                    <h2 className="text-5xl font-serif text-white leading-tight mb-6">
                        "Shaping the next <br/><span className="italic font-light text-slate-300">generation of</span> <br/>professionals."
                    </h2>
                    <p className="text-slate-400 font-light text-lg uppercase tracking-widest text-xs">Industry Mentorship</p>
                </div>
            </div>
        </div>
    )
}

export default OrgSupervisorSignin
