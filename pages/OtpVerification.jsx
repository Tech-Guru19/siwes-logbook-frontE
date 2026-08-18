import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { context } from "../src/App";
import { Shield, Clock, ArrowLeft } from "lucide-react";

const OtpVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setAdminCred } = useContext(context);
  const [otp, setOpt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    if (!otp) return;
    setLoading(true);
    setError("");

    try {
      const email = location.state?.email;
      const isSuperAdmin = location.state?.isSuperAdmin;
      
      if (isSuperAdmin) {
        const res = await axios.post("http://localhost:5687/admin/verify-otp", {
          email,
          otp
        });
        
        if (res.data.status === "OK") {
          setAdminCred(location.state.adminData);
          navigate("/Admin/Dashboard");
        }
      } else {
        // Here we could handle normal user OTP if it existed
        // For now just error
        setError("Invalid flow");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FDFDFB] min-h-screen flex flex-col font-sans selection:bg-primary/20 text-slate-600">
        <header className="fixed top-0 w-full bg-white/80 backdrop-blur-xl border-b border-slate-100 flex justify-between items-center px-6 lg:px-12 h-20 z-50 transition-all duration-200 ease-in-out">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-serif font-bold text-primary">
              SIWES Tracker
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/" >
            <button className="bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-[#001530] hover:shadow-[0_10px_20px_rgba(0,32,69,0.15)] hover:-translate-y-0.5 transition-all">
              Back to Home
            </button>
            </Link>
            <button className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">
              Help Support
            </button>
          </div>
        </header>

        <main className="flex-grow flex items-center justify-center px-6 pt-32 pb-16">
          <div className="max-w-[480px] w-full">
            <div className="bg-white border border-slate-100 p-10 lg:p-12 rounded-[2rem] shadow-[0_20px_50px_rgba(0,32,69,0.03)] animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col items-center mb-10">
                <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mb-4 md:mb-6 shadow-sm">
                  <img src="/logo.png" alt="SIWES Logo" className="w-full h-full object-contain" />
                </div>
                <h1 className="font-serif font-bold text-3xl text-slate-900 mb-3 text-center">
                  Verify Identity
                </h1>
                <p className="font-light text-slate-500 text-center max-w-[340px]">
                  We've sent a secure 4-digit verification code to your registered email ({location.state?.email || 'your email'}).
                </p>
                {error && <div className="mt-4 px-4 py-2 bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold rounded-xl text-center w-full">{error}</div>}
              </div>
              <form className="space-y-8">
                <div>
                  <input 
                    value={otp} 
                    onChange={(e)=>{setOpt(e.target.value)}}
                    className="w-full h-16 text-center text-3xl font-serif font-bold text-primary tracking-[1em] border border-slate-200 rounded-2xl bg-slate-50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                    maxLength="4"
                    placeholder="••••"
                    type="number"
                  /> 
                </div>
                <button
                  onClick={handleVerify}
                  disabled={loading}
                  className="w-full h-14 bg-primary text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[#001530] hover:shadow-[0_10px_20px_rgba(0,32,69,0.15)] hover:-translate-y-0.5 transition-all flex items-center justify-center disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                  type="button"
                >
                  {loading ? 'Verifying Code...' : 'Verify Identity'}
                </button>
                <div className="flex flex-col items-center gap-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <span>Didn't receive the code?</span>
                    <button
                      className="text-primary hover:text-[#001530] transition-colors"
                      type="button"
                    >
                      Resend Now
                    </button>
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Resend available in 0:59</span>
                  </div>
                </div>
              </form>
              <div className="mt-10 pt-8 border-t border-slate-100 flex justify-center">
                <Link
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors group"
                  to="/Admin"
                >
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                  Back to Login
                </Link>
              </div>
            </div>
            <div className="mt-8 px-6 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Facing issues? Contact the IT helpdesk at{" "}
                <span className="text-primary">support@university.edu.ng</span>
              </p>
            </div>
          </div>
        </main>

        <footer className="w-full py-8 border-t bg-white border-slate-100 flex flex-col md:flex-row justify-between items-center px-6 lg:px-12 gap-6 mt-auto">
          <div className="font-serif font-bold text-slate-900 text-lg">
            SIWES Tracker
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center">
            © 2024 SIWES Logbook Management System. All academic rights
            reserved.
          </div>
          <div className="flex gap-6">
            <a
              className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors"
              href="#"
            >
              Privacy
            </a>
            <a
              className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors"
              href="#"
            >
              Terms
            </a>
            <a
              className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors"
              href="#"
            >
              Support
            </a>
          </div>
        </footer>
    </div>
  );
};

export default OtpVerification;
