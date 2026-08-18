import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Key, ShieldCheck, X, Loader2, ArrowRight } from 'lucide-react';
import { useDialog } from '../../context/DialogContext';

const ForgotPasswordModal = ({ isOpen, onClose, role }) => {
    const { showAlert } = useDialog();
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSendOTP = async (e) => {
        e.preventDefault();
        if (!email) return showAlert("Please enter your email address.");
        
        setLoading(true);
        try {
            await axios.post('http://localhost:5687/auth/password/reset/send-otp', {
                email,
                role
            });
            showAlert("An OTP has been sent to your email address.");
            setStep(2);
        } catch (error) {
            showAlert(error?.response?.data?.message || "Failed to send OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = (e) => {
        e.preventDefault();
        if (!otp || otp.length < 4) return showAlert("Please enter a valid OTP.");
        // We will verify the OTP along with the new password in step 3 to save an API call, 
        // or we could verify it here if we had a dedicated endpoint. Let's just move to step 3.
        setStep(3);
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (newPassword.length < 6) return showAlert("Password must be at least 6 characters long.");
        if (newPassword !== confirmPassword) return showAlert("Passwords do not match.");
        
        setLoading(true);
        try {
            await axios.post('http://localhost:5687/auth/password/reset/update', {
                email,
                role,
                newPassword,
                otpCode: otp
            });
            showAlert("Password updated successfully! You can now sign in.");
            handleClose();
        } catch (error) {
            showAlert(error?.response?.data?.message || "Failed to update password. Invalid OTP or expired.");
            // If OTP is invalid, go back to step 2
            setStep(2);
            setOtp('');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setStep(1);
        setEmail('');
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={handleClose}></div>
            <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,32,69,0.1)] p-8 md:p-10 z-10 animate-in fade-in zoom-in-95 duration-300">
                
                <button 
                    onClick={handleClose}
                    className="absolute top-6 right-6 w-10 h-10 bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full flex items-center justify-center transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="mb-8">
                    <div className="w-16 h-16 bg-primary/5 text-primary rounded-2xl flex items-center justify-center mb-6">
                        {step === 1 && <Mail className="w-8 h-8" />}
                        {step === 2 && <ShieldCheck className="w-8 h-8" />}
                        {step === 3 && <Key className="w-8 h-8" />}
                    </div>
                    <h2 className="text-3xl font-serif text-slate-900 mb-2">
                        {step === 1 ? 'Reset Password' : step === 2 ? 'Enter OTP' : 'New Password'}
                    </h2>
                    <p className="text-slate-500 font-light">
                        {step === 1 && 'Enter your account email to receive a recovery code.'}
                        {step === 2 && `We sent a code to ${email}. Please enter it below.`}
                        {step === 3 && 'Secure your account with a strong new password.'}
                    </p>
                </div>

                {step === 1 && (
                    <form onSubmit={handleSendOTP} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Email Address</label>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-slate-700 px-6"
                                required
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-primary text-white h-14 rounded-2xl text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(0,32,69,0.15)] hover:bg-[#001530] transition-all disabled:opacity-70 disabled:hover:translate-y-0"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                <>Send Recovery Code <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifyOTP} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">4-Digit Code</label>
                            <input 
                                type="text" 
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="e.g. 1234"
                                className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl text-xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-bold text-slate-700 px-6 text-center tracking-widest"
                                required
                                maxLength={4}
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="w-full bg-primary text-white h-14 rounded-2xl text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(0,32,69,0.15)] hover:bg-[#001530] transition-all"
                        >
                            Verify Code <ArrowRight className="w-4 h-4" />
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setStep(1)}
                            className="w-full text-center text-sm font-bold text-slate-400 hover:text-primary transition-colors"
                        >
                            Back to Email
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleUpdatePassword} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">New Password</label>
                            <input 
                                type="password" 
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-slate-700 px-6"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Confirm Password</label>
                            <input 
                                type="password" 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-slate-700 px-6"
                                required
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-primary text-white h-14 rounded-2xl text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(0,32,69,0.15)] hover:bg-[#001530] transition-all disabled:opacity-70 disabled:hover:translate-y-0"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                <>Update Password <Key className="w-4 h-4" /></>
                            )}
                        </button>
                    </form>
                )}

            </div>
        </div>
    );
};

export default ForgotPasswordModal;
