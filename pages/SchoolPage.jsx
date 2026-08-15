import React from 'react';
import { 
    GraduationCap, Building2, BookOpen, Award, 
    Network, LineChart, FileCheck, BellRing, 
    ShieldCheck, Key, History, Shield, CheckCircle2 
} from 'lucide-react';

const SchoolPage = () => {
  return (
    <div className="bg-[#FDFDFB] min-h-screen font-sans selection:bg-primary/20 text-slate-600">
        <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 transition-all duration-200 ease-in-out">
          <div className="flex justify-between items-center px-6 md:px-12 h-20 max-w-7xl mx-auto">
            <div className="text-2xl font-serif font-bold tracking-tight text-primary flex items-center gap-2">
              <div className="w-12 h-12 flex items-center justify-center">
                  <img src="/logo.png" alt="SIWES Logo" className="w-full h-full object-contain" />
              </div>
              SIWES Logbook
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a
                className="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-all"
                href="/"
              >
                Features
              </a>
              <a
                className="text-sm font-bold uppercase tracking-widest text-primary border-b-2 border-primary pb-1"
                href="School"
              >
                For Schools
              </a>
              <a
                className="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-all"
                href="SignUp"
              >
                For Students
              </a>
              <a
                className="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-all"
                href="Support"
              >
                Support
              </a>
            </div>
            <div className="flex items-center gap-4">
              <a href="SignIn">
              <button className="text-[10px] font-bold uppercase tracking-widest text-primary hover:opacity-70 transition-all px-4 py-2">
                Login
              </button>
              </a>
              <a href="SignUp">
              <button className="bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-[#001530] hover:shadow-[0_10px_20px_rgba(0,32,69,0.15)] hover:-translate-y-0.5 transition-all">
                Get Started
              </button>
              </a>
            </div>
          </div>
        </nav>
        <main className="pt-20">
          <section className="relative overflow-hidden bg-[#FDFDFB] py-24 lg:py-32">
            <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-16 items-center">
              <div className="z-10 relative">
                <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-widest mb-8 border border-primary/20">
                  Institutional Solutions
                </span>
                <h1 className="font-serif text-5xl lg:text-7xl text-slate-900 leading-[1.1] mb-8">
                  Streamline SIWES <br />
                  <span className="text-primary italic">Management.</span>
                </h1>
                <p className="font-light text-slate-500 mb-10 max-w-xl text-lg leading-relaxed">
                  A centralized platform for Nigerian higher institutions to
                  oversee student industrial placements, monitor supervisor
                  compliance, and generate real-time reports with absolute
                  precision.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="px-8 h-14 bg-primary text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-xl hover:bg-[#001530] hover:shadow-[0_10px_20px_rgba(0,32,69,0.15)] hover:-translate-y-0.5 transition-all flex items-center justify-center">
                    Partner with Us
                  </button>
                  <button className="px-8 h-14 bg-white border border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-widest rounded-xl hover:border-primary hover:text-primary transition-all flex items-center justify-center">
                    View Case Studies
                  </button>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 bg-primary/5 blur-3xl rounded-[3rem]"></div>
                <div className="relative rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,32,69,0.05)] overflow-hidden bg-white p-2">
                    <img
                    alt="Institutional Dashboard Preview"
                    className="w-full h-full object-cover rounded-2xl"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkYfUyU_ja_n7XoJEp05FzM5uucVJVu6LedsEBfbhrSknlQARbcNpzzwzansvPHqy8EVBkmO1ac0YUHGU3ZHhdhq2lusssARB030HFTVKLim1m3yer0vfmYn_xHPO6TGaSaRJ3Ly12nujAV_aOMdrqQHQTCKtlblL6u0qk1CUHKRxAVUKkuO8BJ4JOpSL82yPe5wexoOcg4-grIE7Lvkmf1zfN_cUC27iIfjUn5__OCUdjLsHaxALc8y9kwgks1yi0dv4OdDeKQreT"
                    />
                </div>
              </div>
            </div>
          </section>
          
          <section className="bg-slate-50 py-16 border-y border-slate-100">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
              <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-10">
                Trusted by leading Nigerian Institutions
              </p>
              <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-8 h-8 text-primary" />
                  <span className="font-serif font-bold text-2xl text-slate-900">UNILAG</span>
                </div>
                <div className="flex items-center gap-3">
                  <Building2 className="w-8 h-8 text-primary" />
                  <span className="font-serif font-bold text-2xl text-slate-900">ABU ZARIA</span>
                </div>
                <div className="flex items-center gap-3">
                  <BookOpen className="w-8 h-8 text-primary" />
                  <span className="font-serif font-bold text-2xl text-slate-900">UI IBADAN</span>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8 text-primary" />
                  <span className="font-serif font-bold text-2xl text-slate-900">COVENANT</span>
                </div>
              </div>
            </div>
          </section>

          <section className="py-32 max-w-7xl mx-auto px-6 md:px-12 bg-[#FDFDFB]">
            <div className="text-center mb-20">
              <h2 className="font-serif text-4xl lg:text-5xl text-slate-900 mb-6">
                Empowering <span className="text-primary italic">Coordinators</span>
              </h2>
              <p className="font-light text-slate-500 max-w-2xl mx-auto text-lg">
                Digitize the entire internship lifecycle with tools designed for
                administrative rigor and efficiency.
              </p>
            </div>
            <div className="grid md:grid-cols-12 gap-8">
              <div className="md:col-span-8 bg-white border border-slate-100 rounded-[2rem] p-10 hover:shadow-[0_20px_50px_rgba(0,32,69,0.05)] hover:-translate-y-1 transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    <Network className="text-primary w-8 h-8" />
                  </div>
                  <h3 className="font-serif font-bold text-3xl text-slate-900 mb-4">
                    Centralized Tracking
                  </h3>
                  <p className="font-light text-slate-500 mb-8 leading-relaxed">
                    Gain a bird's-eye view of all students on industrial
                    attachment. Filter by department, location, or industry
                    partner in real-time. No more chasing manual paper logs.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-100 overflow-hidden bg-slate-50">
                    <img
                    alt="Dashboard Feature"
                    className="w-full h-56 object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgT02wXQBgPHMandKbLZ6xDDJPK7rriEs9Cre6pqwX6dJwgiiIZdYgz-m9GfbmaCN9l2Fsx-SNnK7FwTbdM9JqDqPvlJWDSVwH_4xV0k0z0GzjShu6GIL_WUxTYPy3Mjnv4geuk-FNLst8gGnecZuyK7bjkjXXUy-NoiP-8GM4abyV2iwM44UDFgcNjMAas2Cmyng9iadnEJyE4gR06ckGUDB--TqGB2Tg08EuQHg4aE-8V7b0QVWuLgLNdsoVAXag5hIxRtcSrm2Y"
                    />
                </div>
              </div>
              <div className="md:col-span-4 bg-blue-50 border border-blue-100 rounded-[2rem] p-10 hover:shadow-[0_20px_50px_rgba(0,32,69,0.05)] hover:-translate-y-1 transition-all group">
                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                  <LineChart className="text-blue-500 w-8 h-8" />
                </div>
                <h3 className="font-serif font-bold text-2xl text-slate-900 mb-4">
                  Performance Metrics
                </h3>
                <p className="font-light text-slate-600 leading-relaxed">
                  Monitor industry and academic supervisor engagement. Track
                  visitation frequencies and response times to ensure quality
                  mentorship for every student.
                </p>
              </div>
              <div className="md:col-span-4 bg-emerald-50 border border-emerald-100 rounded-[2rem] p-10 hover:shadow-[0_20px_50px_rgba(0,32,69,0.05)] hover:-translate-y-1 transition-all group">
                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                  <FileCheck className="text-emerald-500 w-8 h-8" />
                </div>
                <h3 className="font-serif font-bold text-2xl text-slate-900 mb-4">
                  Automated Reporting
                </h3>
                <p className="font-light text-slate-600 leading-relaxed">
                  Generate ITF-compliant reports with a single click. Our system
                  validates data integrity automatically, ensuring your
                  institution is always audit-ready.
                </p>
              </div>
              <div className="md:col-span-8 bg-white border border-slate-100 rounded-[2rem] p-10 hover:shadow-[0_20px_50px_rgba(0,32,69,0.05)] hover:-translate-y-1 transition-all flex flex-col md:flex-row items-center gap-10 group">
                <div className="flex-1">
                  <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    <BellRing className="text-amber-500 w-8 h-8" />
                  </div>
                  <h3 className="font-serif font-bold text-3xl text-slate-900 mb-4">Instant Alert System</h3>
                  <p className="font-light text-slate-500 leading-relaxed">
                    Automatically flag students who are falling behind on
                    logbook entries or supervisors who have missed evaluation
                    deadlines.
                  </p>
                </div>
                <div className="hidden sm:block w-full md:w-1/3 bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
                  <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                      <div className="h-2 bg-slate-200 rounded-full flex-1"></div>
                  </div>
                  <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      <div className="h-2 bg-slate-200 rounded-full w-2/3"></div>
                  </div>
                  <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                      <div className="h-2 bg-slate-200 rounded-full w-4/5"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-primary py-32 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
            <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-3 gap-16 text-center relative z-10">
              <div className="flex flex-col items-center">
                <div className="text-6xl lg:text-7xl font-serif font-bold mb-4 drop-shadow-md">40%</div>
                <p className="text-sm font-bold uppercase tracking-widest text-primary-content/80 max-w-[200px]">
                  Reduction in manual grading time
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-6xl lg:text-7xl font-serif font-bold mb-4 drop-shadow-md">100%</div>
                <p className="text-sm font-bold uppercase tracking-widest text-primary-content/80 max-w-[200px]">
                  Data integrity & logbook authenticity
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-6xl lg:text-7xl font-serif font-bold mb-4 drop-shadow-md">24h</div>
                <p className="text-sm font-bold uppercase tracking-widest text-primary-content/80 max-w-[200px]">
                  Real-time oversight across departments
                </p>
              </div>
            </div>
          </section>

          <section className="py-32 bg-white">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
              <div className="flex flex-col lg:flex-row items-center gap-20">
                <div className="lg:w-1/2">
                  <h2 className="font-serif text-4xl lg:text-5xl text-slate-900 mb-12">
                    Fortified for <br/> <span className="text-primary italic">Institutional Integrity</span>
                  </h2>
                  <div className="space-y-12">
                    <div className="flex gap-6 group">
                      <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <ShieldCheck className="text-blue-500 w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-xl text-slate-900 mb-2">
                          Data Integrity & Anti-Fraud
                        </h4>
                        <p className="font-light text-slate-500 leading-relaxed">
                          Cryptographic timestamps and geo-location tagging
                          prevent fraudulent logbook entries and ensure students
                          are actually present at work sites.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-6 group">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Key className="text-emerald-500 w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-xl text-slate-900 mb-2">
                          Institutional Login Integration
                        </h4>
                        <p className="font-light text-slate-500 leading-relaxed">
                          Seamless SSO (Single Sign-On) integration with your
                          existing university portal (LMS or Student Information
                          System).
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-6 group">
                      <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <History className="text-amber-500 w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-xl text-slate-900 mb-2">
                          Immutable Audit Trails
                        </h4>
                        <p className="font-light text-slate-500 leading-relaxed">
                          Every change, approval, and rejection is logged.
                          Maintain a complete historical record for
                          accreditation and internal audits.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="lg:w-1/2 bg-slate-50 p-10 lg:p-12 rounded-[2rem] shadow-[0_20px_50px_rgba(0,32,69,0.03)] border border-slate-100 relative overflow-hidden w-full">
                  <div className="absolute -top-10 -right-10 opacity-5">
                    <Shield className="w-64 h-64 text-primary" />
                  </div>
                  <h4 className="font-serif font-bold text-3xl text-slate-900 mb-8 relative z-10">
                    Security Standards
                  </h4>
                  <ul className="space-y-6 relative z-10">
                    <li className="flex items-center gap-4 py-4 border-b border-slate-200">
                      <CheckCircle2 className="text-emerald-500 w-6 h-6" />
                      <span className="font-medium text-slate-700">
                        AES-256 Data Encryption at Rest
                      </span>
                    </li>
                    <li className="flex items-center gap-4 py-4 border-b border-slate-200">
                      <CheckCircle2 className="text-emerald-500 w-6 h-6" />
                      <span className="font-medium text-slate-700">
                        SOC2 Type II Compliant Infrastructure
                      </span>
                    </li>
                    <li className="flex items-center gap-4 py-4 border-b border-slate-200">
                      <CheckCircle2 className="text-emerald-500 w-6 h-6" />
                      <span className="font-medium text-slate-700">
                        Weekly Automated Security Backups
                      </span>
                    </li>
                    <li className="flex items-center gap-4 py-4">
                      <CheckCircle2 className="text-emerald-500 w-6 h-6" />
                      <span className="font-medium text-slate-700">
                        Role-Based Access Control (RBAC)
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="py-32 bg-[#FDFDFB] text-center px-6">
            <div className="max-w-5xl mx-auto bg-primary rounded-[3rem] p-16 lg:p-24 relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
              <h2 className="font-serif font-bold text-white text-4xl lg:text-6xl mb-8 relative z-10 leading-tight">
                Ready to Modernize Your <br/> SIWES Department?
              </h2>
              <p className="font-light text-primary-content mb-12 max-w-2xl mx-auto relative z-10 text-lg">
                Join forward-thinking institutions using SIWES Logbook to
                increase transparency and eliminate administrative bottlenecks.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
                <button className="px-10 h-14 bg-white text-primary font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-slate-50 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  Schedule a Demo
                </button>
                <button className="px-10 h-14 border-2 border-white/20 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all">
                  Partner with Us
                </button>
              </div>
            </div>
          </section>
        </main>

        <footer className="bg-white w-full border-t border-slate-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 py-12 px-6 md:px-12 max-w-7xl mx-auto">
            <div className="flex flex-col items-center md:items-start gap-2">
              <div className="font-serif font-bold text-2xl text-slate-900 flex items-center gap-2">
                <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
                    <GraduationCap className="text-white w-3 h-3" />
                </div>
                SIWES Logbook
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                © 2024 SIWES Logbook Tracking System. Institutional Reliability
                Guaranteed.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              <a
                className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-primary transition-colors"
                href="#"
              >
                Privacy Policy
              </a>
              <a
                className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-primary transition-colors"
                href="#"
              >
                Terms of Service
              </a>
              <a
                className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-primary transition-colors"
                href="#"
              >
                Contact Us
              </a>
              <a
                className="text-xs font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
                href="#"
              >
                Institutional Access
              </a>
            </div>
          </div>
        </footer>
    </div>
  );
};

export default SchoolPage;
