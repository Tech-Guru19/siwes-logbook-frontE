import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    BookOpen, 
    ChevronLeft, 
    ArrowRight,
    GraduationCap,
    Building2,
    ShieldCheck,
    Users,
    BadgeCheck
} from 'lucide-react';

const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: -30, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    exit: { opacity: 0, transition: { staggerChildren: 0.05, staggerDirection: -1 } }
};

const AccountType = () => {
    const [showAdminMenu, setShowAdminMenu] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#FDFDFB] text-slate-600 font-sans selection:bg-primary/20 flex flex-col relative overflow-hidden">
            {/* Minimal Header */}
            <header className="absolute top-0 left-0 w-full z-50 py-8">
                <nav className="flex justify-between items-center px-6 md:px-12 max-w-7xl mx-auto">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center transition-all duration-700 group-hover:bg-primary group-hover:border-primary">
                            <BookOpen className="text-primary w-4 h-4 transition-colors duration-700 group-hover:text-white" strokeWidth={1.5} />
                        </div>
                        <span className="text-xl font-serif font-medium tracking-tight text-primary">
                            SIWES Logbook.
                        </span>
                    </Link>
                    <Link to="/" className="text-xs uppercase tracking-[0.2em] font-medium text-slate-400 hover:text-primary transition-colors duration-500">
                        Back to Home
                    </Link>
                </nav>
            </header>

            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary-fixed-dim/10 rounded-full blur-[150px] pointer-events-none"></div>

            <main className="flex-1 flex flex-col items-center justify-center px-6 pt-32 pb-20 relative z-10 w-full max-w-6xl mx-auto">
                <AnimatePresence mode="wait">
                    {!showAdminMenu ? (
                        <motion.div 
                            key="main-selection"
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="w-full flex flex-col items-center"
                        >
                            <motion.div variants={fadeUpVariants} className="text-center mb-16 max-w-2xl">
                                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-secondary-fixed-dim mb-6 block">Welcome to the portal</span>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-primary mb-6 leading-tight">Choose your <br/><span className="italic font-light">account type.</span></h1>
                                <p className="text-lg text-slate-500 font-light leading-relaxed">
                                    Select the gateway that best describes your role in the industrial training ecosystem.
                                </p>
                            </motion.div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto">
                                {/* Student Card */}
                                <motion.div variants={fadeUpVariants} className="h-full">
                                    <Link to="/SignIn" className="block h-full group">
                                        <div className="h-full bg-white border border-slate-100 p-10 lg:p-12 rounded-[2.5rem] flex flex-col items-start transition-all duration-700 hover:shadow-[0_20px_60px_rgba(0,32,69,0.06)] hover:border-primary/20 hover:-translate-y-2 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100%] transition-transform duration-700 group-hover:scale-150 group-hover:bg-primary/10"></div>
                                            <div className="w-16 h-16 rounded-2xl bg-primary/5 text-primary flex items-center justify-center mb-8 relative z-10 transition-colors duration-500 group-hover:bg-primary group-hover:text-white">
                                                <GraduationCap className="w-8 h-8" strokeWidth={1.5} />
                                            </div>
                                            <h2 className="text-3xl font-serif text-primary mb-4 relative z-10">Student Intern</h2>
                                            <p className="text-slate-500 font-light leading-relaxed mb-12 relative z-10">
                                                The primary portal for students to log daily tasks, upload photographic evidence, and track their industrial training progress.
                                            </p>
                                            <div className="mt-auto flex items-center gap-3 text-sm font-semibold uppercase tracking-widest text-primary group-hover:text-secondary-fixed-dim transition-colors duration-500 relative z-10">
                                                Proceed <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-2" strokeWidth={2}/>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>

                                {/* Staff & Organizations Gateway */}
                                <motion.div variants={fadeUpVariants} className="h-full">
                                    <button onClick={() => setShowAdminMenu(true)} className="block w-full h-full text-left group">
                                        <div className="h-full bg-primary border border-primary p-10 lg:p-12 rounded-[2.5rem] flex flex-col items-start transition-all duration-700 hover:bg-[#001530] hover:shadow-[0_20px_60px_rgba(0,32,69,0.2)] hover:-translate-y-2 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-fixed-dim/10 rounded-bl-[100%] transition-transform duration-700 group-hover:scale-150"></div>
                                            <div className="w-16 h-16 rounded-2xl bg-white/10 text-white flex items-center justify-center mb-8 relative z-10 transition-colors duration-500 group-hover:bg-secondary-fixed-dim group-hover:text-primary">
                                                <Building2 className="w-8 h-8" strokeWidth={1.5} />
                                            </div>
                                            <h2 className="text-3xl font-serif text-white mb-4 relative z-10">Staff & Organizations</h2>
                                            <p className="text-slate-300 font-light leading-relaxed mb-12 relative z-10">
                                                The gateway for Academic Supervisors, Industry Mentors, School Coordinators, and Company Administrators.
                                            </p>
                                            <div className="mt-auto flex items-center gap-3 text-sm font-semibold uppercase tracking-widest text-secondary-fixed-dim transition-colors duration-500 relative z-10">
                                                View Roles <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-2" strokeWidth={2}/>
                                            </div>
                                        </div>
                                    </button>
                                </motion.div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="admin-selection"
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="w-full flex flex-col items-center max-w-5xl"
                        >
                            <motion.div variants={fadeUpVariants} className="w-full text-center mb-16 relative">
                                <button 
                                    onClick={() => setShowAdminMenu(false)}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-slate-400 hover:text-primary transition-colors duration-300"
                                >
                                    <ChevronLeft className="w-4 h-4" /> Back
                                </button>
                                <h2 className="text-4xl font-serif text-primary inline-block">Staff & Administration</h2>
                            </motion.div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                                {/* School Admin */}
                                <motion.div variants={fadeUpVariants}>
                                    <Link to="/school/signin" className="block group h-full">
                                        <div className="bg-white p-8 rounded-3xl border border-slate-100 flex items-start gap-6 transition-all duration-500 hover:shadow-[0_10px_40px_rgba(0,32,69,0.04)] hover:border-primary/20 h-full">
                                            <div className="w-12 h-12 shrink-0 bg-primary/5 text-primary rounded-xl flex items-center justify-center transition-colors duration-500 group-hover:bg-primary group-hover:text-white">
                                                <ShieldCheck className="w-6 h-6" strokeWidth={1.5} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-serif text-primary mb-2">Institutional Coordinator</h3>
                                                <p className="text-sm text-slate-500 font-light leading-relaxed">Oversee school programs, departments, and manage student rosters.</p>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>

                                {/* Company Admin */}
                                <motion.div variants={fadeUpVariants}>
                                    <Link to="/organization/signin" className="block group h-full">
                                        <div className="bg-white p-8 rounded-3xl border border-slate-100 flex items-start gap-6 transition-all duration-500 hover:shadow-[0_10px_40px_rgba(0,32,69,0.04)] hover:border-primary/20 h-full">
                                            <div className="w-12 h-12 shrink-0 bg-primary/5 text-primary rounded-xl flex items-center justify-center transition-colors duration-500 group-hover:bg-primary group-hover:text-white">
                                                <Building2 className="w-6 h-6" strokeWidth={1.5} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-serif text-primary mb-2">Company Administrator</h3>
                                                <p className="text-sm text-slate-500 font-light leading-relaxed">Manage corporate SIWES placements and register industry supervisors.</p>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>

                                {/* Academic Supervisor */}
                                <motion.div variants={fadeUpVariants}>
                                    <Link to="/Supervisor-Login" className="block group h-full">
                                        <div className="bg-white p-8 rounded-3xl border border-slate-100 flex items-start gap-6 transition-all duration-500 hover:shadow-[0_10px_40px_rgba(0,32,69,0.04)] hover:border-primary/20 h-full">
                                            <div className="w-12 h-12 shrink-0 bg-primary/5 text-primary rounded-xl flex items-center justify-center transition-colors duration-500 group-hover:bg-primary group-hover:text-white">
                                                <Users className="w-6 h-6" strokeWidth={1.5} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-serif text-primary mb-2">Academic Supervisor</h3>
                                                <p className="text-sm text-slate-500 font-light leading-relaxed">Assess student performance, review daily logs, and grade final reports.</p>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>

                                {/* Industry Supervisor */}
                                <motion.div variants={fadeUpVariants}>
                                    <Link to="/organization-supervisor/signin" className="block group h-full">
                                        <div className="bg-white p-8 rounded-3xl border border-slate-100 flex items-start gap-6 transition-all duration-500 hover:shadow-[0_10px_40px_rgba(0,32,69,0.04)] hover:border-primary/20 h-full">
                                            <div className="w-12 h-12 shrink-0 bg-primary/5 text-primary rounded-xl flex items-center justify-center transition-colors duration-500 group-hover:bg-primary group-hover:text-white">
                                                <BadgeCheck className="w-6 h-6" strokeWidth={1.5} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-serif text-primary mb-2">Industry Mentor</h3>
                                                <p className="text-sm text-slate-500 font-light leading-relaxed">Workplace supervisor portal to verify intern tasks and sign logbooks.</p>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
            
            {/* Minimal Footer */}
            <footer className="w-full py-8 text-center text-xs font-light text-slate-400 relative z-10 border-t border-slate-100">
                <p>© 2026 SIWES Logbook Management System. Handcrafted.</p>
            </footer>
        </div>
    );
};

export default AccountType;
