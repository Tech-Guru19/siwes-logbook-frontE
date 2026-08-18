import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { uploadImg } from '../../Cloudinary'
import { ArrowLeft, Mail, Lock, KeyRound, CheckCircle2, RefreshCw, UploadCloud, X, MapPin, BadgeCheck, Eye, EyeOff } from 'lucide-react';
import { useDialog } from '../../src/context/DialogContext'

const OrgSupervisorSignup = () => {
  const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate()
    const { showAlert } = useDialog()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [contactAddress, setContactAddress] = useState('')
    const [profileImg, setProfileImg] = useState('')
    const [otpCode, setOtpCode] = useState('')
    const [isOtpSent, setIsOtpSent] = useState(false)
    const [isOtpVerified, setIsOtpVerified] = useState(false)
    const [otpLoading, setOtpLoading] = useState(false)
    const [loading, setLoading] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState("")

    const handleImageSelect = (file) => {
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            return showAlert("Please select an image file.");
        }
        setSelectedFile(file);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreviewUrl(reader.result);
        };
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        handleImageSelect(file);
    };

    const handleActivate = async (e) => {
        e.preventDefault()
        if (!email || !password || !contactAddress || !otpCode) {
            return showAlert('Please fill in all required fields including OTP code')
        }
        if (!isOtpVerified) {
            return showAlert('Please verify your email address with the OTP code first.')
        }

        setLoading(true)
        
        let uploadedUrl = profileImg;
        if (selectedFile) {
            try {
                const base64 = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = (err) => reject(err);
                    reader.readAsDataURL(selectedFile);
                });
                const secureUrl = await uploadImg(base64);
                if (secureUrl) {
                    uploadedUrl = secureUrl;
                }
            } catch (err) {
                setLoading(false);
                return showAlert("Image upload failed. Please try again.");
            }
        }

        axios.post('http://localhost:5687/organization-supervisor/signup', {
            email_address: email,
            password: password,
            Contact_Adress: contactAddress,
            Profile_Img: uploadedUrl || null,
            otp_code: otpCode
        })
        .then(() => {
            showAlert('Industry Supervisor account activated successfully! You can now log in.')
            navigate('/organization-supervisor/signin')
        })
        .catch((err) => {
            showAlert(err?.response?.data?.message || 'Activation failed. Please check that your email was pre-registered by your organization.')
        })
        .finally(() => {
            setLoading(false)
        })
    }

    const handleSendOtp = async () => {
        if (!email) return showAlert("Please enter your email address first.");
        setOtpLoading(true);
        try {
            await axios.post("http://localhost:5687/auth/otp/send", { email_address: email });
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
            await axios.post("http://localhost:5687/auth/otp/verify", { email_address: email, otp_code: otpCode });
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
            <div className="w-full lg:w-1/2 flex flex-col relative px-4 sm:px-6 md:px-16 py-8 md:py-12 h-screen overflow-y-auto custom-scrollbar">
                <Link to="/register/accountType" className="absolute top-6 md:top-8 left-4 sm:left-6 md:left-12 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors duration-300 z-10">
                    <ArrowLeft className="w-4 h-4" /> Back to Gateway
                </Link>

                <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto mt-24 lg:mt-12 mb-10">
                    <div className="mb-10">
                        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                <img src="/logo.png" alt="SIWES Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Supervisor Activation</span>
            </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-primary mb-2 sm:mb-4 leading-tight">Activate Profile.</h1>
                        <p className="text-slate-500 font-light leading-relaxed">
                            Activate your pre-registered Industry Supervisor profile to monitor interns and submit weekly sign-offs.
                        </p>
                    </div>
                    
                    <form onSubmit={handleActivate} className="space-y-6">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Pre-registered Email Address *</label>
                            <div className="relative flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" strokeWidth={1.5} />
                                    <input
                                        className="w-full h-14 pl-12 pr-4 bg-white border border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none text-sm font-medium transition-all disabled:opacity-60 disabled:bg-slate-50"
                                        placeholder="supervisor@company.com"
                                        type="email"
                                        required
                                        disabled={isOtpVerified}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    {isOtpVerified && (
                                        <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                                    )}
                                </div>
                                {!isOtpVerified && (
                                    <button
                                        type="button"
                                        onClick={handleSendOtp}
                                        disabled={otpLoading || !email}
                                        className="h-14 px-6 bg-primary/5 text-primary border border-primary/10 hover:bg-primary hover:text-white font-semibold uppercase tracking-widest text-xs rounded-xl transition-all duration-300 disabled:opacity-50 whitespace-nowrap flex items-center gap-2"
                                    >
                                        {otpLoading ? <RefreshCw className="w-4 h-4 animate-spin"/> : null}
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
                                        {otpLoading ? <RefreshCw className="w-4 h-4 animate-spin"/> : null}
                                        Verify
                                    </button>
                                </div>
                            </div>
                        )}

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

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Office Address / Desk *</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" strokeWidth={1.5} />
                                <input
                                    className="w-full h-14 pl-12 pr-4 bg-white border border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none text-sm font-medium transition-all"
                                    placeholder="e.g. Building A, Floor 2, Room 204"
                                    type="text"
                                    required
                                    value={contactAddress}
                                    onChange={(e) => setContactAddress(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Profile Image <span className="lowercase font-normal opacity-70">(Optional)</span></label>
                            <div
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                className="border-2 border-dashed border-slate-200 hover:border-primary rounded-xl p-6 bg-white flex flex-col items-center justify-center cursor-pointer transition-all space-y-2 relative"
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="profile-image-upload"
                                    className="hidden"
                                    onChange={(e) => handleImageSelect(e.target.files[0])}
                                />
                                {previewUrl ? (
                                    <div className="flex items-center gap-4 w-full justify-between">
                                        <div className="flex items-center gap-4">
                                            <img src={previewUrl} alt="Preview" className="w-14 h-14 object-cover rounded-full shadow-sm border border-slate-100" />
                                            <div>
                                                <p className="text-sm font-semibold text-slate-700">Ready for upload</p>
                                                <span className="text-xs text-slate-500 block truncate max-w-[180px]">{selectedFile?.name}</span>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                setSelectedFile(null);
                                                setPreviewUrl("");
                                            }}
                                            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-500 flex items-center justify-center transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <label htmlFor="profile-image-upload" className="w-full h-full flex flex-col items-center justify-center py-4 cursor-pointer">
                                        <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary mb-3">
                                            <UploadCloud className="w-6 h-6" strokeWidth={1.5} />
                                        </div>
                                        <p className="text-sm font-semibold text-slate-700">Drag & Drop or <span className="text-primary hover:underline">browse</span></p>
                                        <p className="text-xs text-slate-400 mt-1">Upload a professional headshot</p>
                                    </label>
                                )}
                            </div>
                        </div>

                        <button
                            className="w-full h-14 bg-primary text-white font-semibold uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-3 hover:bg-[#001530] hover:shadow-[0_15px_30px_rgba(0,32,69,0.15)] hover:-translate-y-0.5 transition-all duration-300 mt-8 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                            type="submit"
                            disabled={loading || !isOtpVerified}
                        >
                            <BadgeCheck className="w-4 h-4" />
                            {loading ? "Activating..." : "Activate Supervisor Profile"}
                        </button>

                        <div className="text-center pt-6 border-t border-slate-100 mt-8 pb-8">
                            <p className="text-sm text-slate-500 font-light">
                                Already activated?{' '}
                                <Link to="/organization-supervisor/signin" className="text-primary font-medium hover:text-secondary-fixed-dim transition-colors">
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
                    src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200" 
                    alt="Corporate Mentor Activation" 
                    className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay" 
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-[#001530] via-transparent to-transparent"></div>
                
                <div className="absolute bottom-24 left-16 right-16">
                    <div className="w-12 h-[2px] bg-secondary-fixed-dim mb-8"></div>
                    <h2 className="text-5xl font-serif text-white leading-tight mb-6">
                        "Guide, assess, <br/><span className="italic font-light text-slate-300">and inspire</span> <br/>future talent."
                    </h2>
                    <p className="text-slate-400 font-light text-lg uppercase tracking-widest text-xs">Mentor Activation</p>
                </div>
            </div>
        </div>
    )
}

export default OrgSupervisorSignup
