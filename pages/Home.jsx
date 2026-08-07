import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { 
  ArrowRight,
  Heart,
  Users,
  PenTool,
  MessageCircle,
  Coffee,
  BookOpen,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Briefcase,
  Cloud,
  Code
} from "lucide-react";

// Ultra-smooth animation variants
const revealUp = {
  hidden: { opacity: 0, y: 60, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] } }
};

const staggerGroup = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
};

const ecosystemPanels = [
  {
    id: "admin",
    title: "The School Administration Panel",
    subtitle: "Institutional Coordinator",
    description: "This panel acts as the master control room for the school to set up and monitor the entire SIWES program.",
    steps: [
      { title: "System Initialization", desc: "The school administrator logs in to register the institution and set up the academic structure by creating departments (e.g., Computer Science)." },
      { title: "User Generation", desc: "The admin creates profiles for the students who are eligible for industrial training and registers the school's internal academic supervisors." },
      { title: "Supervisor Assignment", desc: "The admin assigns each student to an internal academic supervisor who will eventually grade their final defense." },
      { title: "Program Oversight", desc: "Throughout the internship period, the coordinator uses this dashboard to track which students have successfully secured placements, monitor their active logging streaks, and ensure all participants are complying with the scheme's rules." }
    ]
  },
  {
    id: "corporate",
    title: "The Corporate Panel",
    subtitle: "Host Company",
    description: "This panel is designed for the tech companies and organizations hosting the students.",
    steps: [
      { title: "Corporate Registration", desc: "The company creates a profile on the platform, providing their official details and verifying their email." },
      { title: "Accepting Interns", desc: "When a student applies or is posted to the company, the company administrator logs in to formally accept the student into their digital system." },
      { title: "Assigning Mentors", desc: "The company creates accounts for their senior staff members and assigns a specific workplace supervisor to oversee and mentor each newly accepted student." }
    ]
  },
  {
    id: "student",
    title: "The Student Dashboard",
    subtitle: "Intern Panel",
    description: "This is the core interface where the actual daily documentation happens.",
    steps: [
      { title: "Account Activation & Linking", desc: "The student logs in using the credentials created by the school. Their first action is to link their profile to the specific company they are attached to, officially starting their digital logbook." },
      { title: "Daily Documentation", desc: "Every workday, the student clicks 'Add New Entry.' They write a description of the tasks they performed and the technical skills they applied." },
      { title: "Multimedia Evidence", desc: "Within the daily entry form, the student uploads visual proof—such as screenshots of their code, server configurations, or photos of their workspace. These are instantly saved to the cloud." },
      { title: "Weekly Lock & Submit", desc: "At the end of the week, the student reviews their five daily entries. They click a button to lock the week's logbook and submit it directly to their assigned workplace supervisor for grading." }
    ]
  },
  {
    id: "mentor",
    title: "The Workplace Supervisor Dashboard",
    subtitle: "Industry Mentor",
    description: "This interface makes it fast and easy for industry professionals to evaluate their interns without dealing with physical paperwork.",
    steps: [
      { title: "Weekly Notification", desc: "The supervisor logs into their dashboard and immediately sees a list of pending logbooks submitted by their assigned students." },
      { title: "Review & Verification", desc: "They click on a student's submission to read the daily text entries and view the attached photographic evidence to verify the work was actually done." },
      { title: "Feedback & Grading", desc: "The supervisor uses a built-in form to type out constructive feedback on the student's performance for that week and assigns a weekly score." },
      { title: "Digital Signature", desc: "Finally, the supervisor clicks 'Approve.' This acts as a verified digital signature, permanently locking the week's grade and automatically updating the student's and the school's dashboards with the results." }
    ]
  }
];

const Home = () => {
  const [scrolled, setScrolled] = useState(false);
  
  // Parallax Refs
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroImageY = useTransform(heroScroll, [0, 1], ["0%", "30%"]);
  const heroTextY = useTransform(heroScroll, [0, 1], ["0%", "15%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);

  const panelsRef = useRef(null);
  const { scrollYProgress: panelsScroll } = useScroll({ target: panelsRef, offset: ["start end", "end start"] });
  const panelImgY1 = useTransform(panelsScroll, [0, 1], ["-10%", "10%"]);
  const panelImgY2 = useTransform(panelsScroll, [0, 1], ["10%", "-10%"]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFDFB] text-slate-600 font-sans selection:bg-primary/20 overflow-x-hidden">
      
      {/* LUXURY HEADER */}
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ease-out ${scrolled ? 'bg-[#FDFDFB]/90 backdrop-blur-2xl border-b border-primary/10 py-4 shadow-[0_4px_30px_rgba(0,32,69,0.05)]' : 'bg-transparent py-8'}`}>
        <nav className="flex items-center justify-between w-full px-6 md:px-12 lg:px-24">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center transition-all duration-700 group-hover:bg-primary group-hover:border-primary">
              <BookOpen className="text-primary w-4 h-4 transition-colors duration-700 group-hover:text-white" strokeWidth={1.5} />
            </div>
            <span className="text-xl font-serif font-medium tracking-tight text-primary">
              SIWES Logbook.
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-14">
            <a href="#features" className="text-xs uppercase tracking-[0.2em] font-medium text-slate-500 hover:text-primary transition-colors duration-500">Our Approach</a>
            <Link to="/Docs" className="text-xs uppercase tracking-[0.2em] font-medium text-slate-500 hover:text-primary transition-colors duration-500">Documentation</Link>
            <Link to="/Support" className="text-xs uppercase tracking-[0.2em] font-medium text-slate-500 hover:text-primary transition-colors duration-500">Support</Link>
          </div>

          <div className="flex items-center gap-8">
            <Link to="/SignIn" className="hidden sm:block text-xs uppercase tracking-[0.2em] font-medium text-slate-500 hover:text-primary transition-colors duration-500">
              Log in
            </Link>
            <Link to="/register/accountType" className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-primary px-8 py-4 text-xs uppercase tracking-[0.1em] font-medium text-white transition-all duration-700 hover:bg-[#001530] hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1">
              <span className="mr-3">Begin</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-700 group-hover:translate-x-2" strokeWidth={1.5} />
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* PARALLAX HERO SECTION */}
        <section ref={heroRef} className="relative min-h-[100vh] flex items-center pt-32 pb-20 overflow-hidden bg-[#FDFDFB]">
          {/* Subtle Grain Overlay */}
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
          
          <div className="w-full px-6 md:px-12 lg:px-24 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full relative">
              
              {/* Massive Hero Image Background layer */}
              <motion.div 
                style={{ y: heroImageY, opacity: heroOpacity }}
                className="absolute right-0 top-0 lg:top-auto lg:-bottom-24 w-full lg:w-[65%] h-[60vh] lg:h-[85vh] rounded-[2rem] lg:rounded-[4rem] overflow-hidden shadow-2xl shadow-primary/10 z-0 origin-bottom"
              >
                <img
                  alt="Student documenting journey"
                  className="w-full h-full object-cover scale-105"
                  src="https://i.pinimg.com/736x/ec/72/f0/ec72f0f25dc88116b5a887875ca98207.jpg"
                />
                <div className="absolute inset-0 bg-primary/5"></div>
              </motion.div>

              {/* Overlapping Glassmorphism Text Composition */}
              <motion.div 
                style={{ y: heroTextY }}
                initial="hidden"
                animate="visible"
                variants={staggerGroup}
                className="lg:col-span-7 xl:col-span-6 relative z-10 mt-64 lg:mt-0"
              >
                <div className="bg-white/80 backdrop-blur-3xl border border-white p-10 lg:p-16 rounded-[2rem] lg:rounded-[3rem] shadow-[0_20px_60px_rgba(0,32,69,0.08)]">
                  <motion.div variants={revealUp} className="mb-8">
                    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-secondary-fixed-dim">The Modern Standard</span>
                  </motion.div>
                  
                  <motion.h1 variants={revealUp} className="text-6xl sm:text-7xl lg:text-[5.5rem] font-serif text-primary leading-[1.05] tracking-tight mb-8">
                    Your journey, <br />
                    <span className="italic font-light text-slate-500">beautifully</span> <br />
                    documented.
                  </motion.h1>
                  
                  <motion.p variants={revealUp} className="text-xl text-slate-500 leading-relaxed font-light mb-12 max-w-lg">
                    We believe tracking your industrial training shouldn't feel like a chore. Connect with mentors, share your progress, and reflect on your growth.
                  </motion.p>
                  
                  <motion.div variants={revealUp} className="flex flex-wrap gap-6">
                    <Link to="/register/accountType" className="inline-flex items-center justify-center rounded-full bg-primary px-10 py-5 text-sm uppercase tracking-widest font-medium text-white transition-all duration-700 hover:bg-[#001530] hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1">
                      Begin your story
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
              
            </div>
          </div>
        </section>

        {/* PROBLEM VS SOLUTION */}
        <section className="py-32 relative bg-white border-t border-slate-100">
          <div className="w-full px-6 md:px-12 lg:px-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealUp}>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-6">The Traditional Challenge</h3>
                <h4 className="text-4xl sm:text-5xl font-serif text-slate-900 mb-8 leading-tight">Fragile & <br/>Inefficient.</h4>
                <p className="text-lg text-slate-500 font-light leading-relaxed mb-10 max-w-md">
                  For decades, industrial training relied on manual, paper-based logbooks. This antiquated method introduced severe administrative challenges, exposing vital academic records to unnecessary risks.
                </p>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4 text-slate-500 font-light text-base"><XCircle className="w-5 h-5 text-slate-300"/> Vulnerable to physical damage and data loss</div>
                  <div className="flex items-center gap-4 text-slate-500 font-light text-base"><XCircle className="w-5 h-5 text-slate-300"/> Severely delayed academic evaluations</div>
                  <div className="flex items-center gap-4 text-slate-500 font-light text-base"><XCircle className="w-5 h-5 text-slate-300"/> Poor monitoring by institutional supervisors</div>
                </div>
              </motion.div>
              
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealUp} className="bg-slate-50 p-12 lg:p-16 rounded-[3rem] border border-primary/10 shadow-[0_20px_60px_rgba(0,32,69,0.03)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-fixed-dim/10 rounded-full blur-3xl"></div>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-secondary-fixed-dim mb-6 relative z-10">The Digital Reality</h3>
                <h4 className="text-4xl sm:text-5xl font-serif text-primary mb-8 leading-tight relative z-10">Centralized & <br/>Secure.</h4>
                <p className="text-lg text-slate-600 font-light leading-relaxed mb-10 relative z-10">
                  We designed a web-based, multi-tier ecosystem that eliminates physical logbook mobility. Unifying trainees, academic faculty, and industry professionals into a single digital space drastically improves transparency and operational efficiency.
                </p>
                <div className="flex flex-col gap-4 relative z-10">
                  <div className="flex items-center gap-4 text-primary font-medium text-base"><CheckCircle2 className="w-5 h-5 text-secondary-fixed-dim"/> Secure Centralized Database</div>
                  <div className="flex items-center gap-4 text-primary font-medium text-base"><CheckCircle2 className="w-5 h-5 text-secondary-fixed-dim"/> Real-time Remote Sign-offs</div>
                  <div className="flex items-center gap-4 text-primary font-medium text-base"><CheckCircle2 className="w-5 h-5 text-secondary-fixed-dim"/> Strict Role-Based Access Control</div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* PARALLAX EDITORIAL PANELS */}
        <section id="features" ref={panelsRef} className="py-40 relative bg-[#FDFDFB] border-t border-slate-100 overflow-hidden">
          <div className="w-full px-6 md:px-12 lg:px-24">
            
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={revealUp}
              className="text-center max-w-3xl mx-auto mb-40"
            >
              <h2 className="text-5xl sm:text-6xl font-serif text-primary mb-8 tracking-tight leading-tight">Focus on learning.<br />We'll handle the rest.</h2>
              <p className="text-slate-500 text-xl leading-relaxed font-light">We've removed the friction from industrial training, creating an environment that encourages meaningful reflections and authentic mentorship.</p>
            </motion.div>

            <div className="space-y-48">
              {/* Panel 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
                <motion.div 
                  initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="lg:col-span-5 order-2 lg:order-1"
                >
                  <div className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center mb-10 bg-primary/5">
                    <PenTool className="w-5 h-5 text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-4xl sm:text-5xl font-serif text-primary mb-8 leading-[1.1]">Meaningful logs, <br/><span className="italic font-light text-slate-500">made simple.</span></h3>
                  <p className="text-lg text-slate-500 leading-relaxed font-light mb-10">
                    Capture your daily experiences with text, photos, and tags. Our interface feels like a personal journal rather than a rigid institutional form.
                  </p>
                  <ul className="space-y-5 text-slate-600 font-medium">
                    <li className="flex items-center gap-4 border-b border-slate-100 pb-4"><CheckCircle2 className="w-5 h-5 text-secondary-fixed-dim" strokeWidth={2} /> Gentle automated reminders</li>
                    <li className="flex items-center gap-4"><CheckCircle2 className="w-5 h-5 text-secondary-fixed-dim" strokeWidth={2} /> Rich media integration</li>
                  </ul>
                </motion.div>
                
                <div className="lg:col-span-7 order-1 lg:order-2 relative h-[50vh] lg:h-[80vh] w-full rounded-[2rem] lg:rounded-[3rem] overflow-hidden bg-slate-100">
                  <motion.div style={{ y: panelImgY1 }} className="absolute inset-[-10%] w-[120%] h-[120%]">
                    <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200" alt="Students collaborating" className="w-full h-full object-cover" />
                  </motion.div>
                </div>
              </div>

              {/* Panel 2 */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
                <div className="lg:col-span-7 relative h-[50vh] lg:h-[80vh] w-full rounded-[2rem] lg:rounded-[3rem] overflow-hidden bg-slate-100">
                  <motion.div style={{ y: panelImgY2 }} className="absolute inset-[-10%] w-[120%] h-[120%]">
                    <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=1200" alt="Mentor giving feedback" className="w-full h-full object-cover" />
                  </motion.div>
                </div>
                
                <motion.div 
                  initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="lg:col-span-5"
                >
                  <div className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center mb-10 bg-primary/5">
                    <Heart className="w-5 h-5 text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-4xl sm:text-5xl font-serif text-primary mb-8 leading-[1.1]">Authentic mentorship, <br/><span className="italic font-light text-slate-500">bridging the gap.</span></h3>
                  <p className="text-lg text-slate-500 leading-relaxed font-light mb-10">
                    We believe in guidance, not just grading. Supervisors can review logs, leave encouraging feedback, and sign off on progress instantly.
                  </p>
                  <ul className="space-y-5 text-slate-600 font-medium">
                    <li className="flex items-center gap-4 border-b border-slate-100 pb-4"><CheckCircle2 className="w-5 h-5 text-secondary-fixed-dim" strokeWidth={2} /> Real-time feedback loops</li>
                    <li className="flex items-center gap-4"><CheckCircle2 className="w-5 h-5 text-secondary-fixed-dim" strokeWidth={2} /> One-click digital signatures</li>
                  </ul>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* BOLD MOBILE APP SECTION - MIDDLE */}
        <section className="py-40 relative bg-gradient-to-br from-primary via-[#002f5a] to-[#001530] text-white overflow-hidden">
          {/* Vibrant Glowing Accents */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[800px] h-[800px] bg-secondary-fixed-dim/30 rounded-full blur-[150px] pointer-events-none mix-blend-screen"></div>
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
          
          <div className="w-full px-6 md:px-12 lg:px-24 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-center">
              
              {/* Massive Floating Phone on Left */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealUp} className="order-2 lg:order-1 lg:col-span-6 relative flex justify-center lg:justify-end lg:pr-12">
                <div className="absolute inset-0 bg-secondary-fixed-dim/20 rounded-[4rem] blur-2xl transform rotate-6 scale-95"></div>
                {/* Image scaled to the sweet spot between too big and too small */}
                <img src="/mobile_app.png" alt="SIWES Logbook Mobile App" className="relative z-10 w-full max-w-[350px] lg:max-w-[550px] mx-auto lg:mx-0 drop-shadow-[0_40px_80px_rgba(0,0,0,0.6)] rounded-[3rem] border-2 border-white/20" />
              </motion.div>

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealUp} className="order-1 lg:order-2 lg:col-span-6 lg:pl-16">
                <h3 className="text-sm font-semibold uppercase tracking-[0.4em] text-secondary-fixed-dim mb-8 flex items-center gap-4">
                  <span className="w-12 h-[1px] bg-secondary-fixed-dim"></span> Anywhere, Anytime
                </h3>
                <h4 className="text-5xl sm:text-6xl lg:text-[5.5rem] font-serif text-white mb-10 leading-[1.05] tracking-tight">Your portal, <br/>in your pocket.</h4>
                <p className="text-xl text-slate-300 font-light leading-relaxed mb-12 max-w-xl">
                  We built a dedicated mobile experience so you can log your daily tasks directly from the workshop floor, the server room, or the field. Capture photos with your phone and upload them instantly to the cloud.
                </p>
                <div className="flex flex-col sm:flex-row gap-6">
                  <button className="flex items-center justify-center gap-3 bg-secondary-fixed-dim text-primary px-10 py-5 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-white transition-colors duration-500 hover:shadow-[0_0_50px_rgba(137,211,212,0.5)]">
                    Get it on Android
                  </button>
                  <button className="flex items-center justify-center gap-3 bg-transparent border border-white/30 text-white px-10 py-5 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-white/10 transition-colors duration-500 hover:border-white">
                    Download for iOS
                  </button>
                </div>
              </motion.div>
              
            </div>
          </div>
        </section>

        {/* PLATFORM CAPABILITIES */}
        <section className="py-32 relative bg-white border-t border-slate-100">
          <div className="w-full px-6 md:px-12 lg:px-24">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealUp} className="text-center max-w-3xl mx-auto mb-24">
              <h2 className="text-4xl sm:text-5xl font-serif text-primary mb-6 tracking-tight">Robust Architecture.</h2>
              <p className="text-slate-500 text-lg leading-relaxed font-light">Developed using Agile software methodology, our platform is built upon a highly secure, scalable modern technology stack.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: ShieldCheck, title: "OTP Verification", desc: "A secure email verification system ensures all accounts across the 6-tier hierarchy remain strictly protected." },
                { icon: Briefcase, title: "Placement Matching", desc: "A seamless application portal allows students to discover and formally apply to approved host organizations." },
                { icon: Cloud, title: "Cloud Integration", desc: "Integrated with Cloudinary for fast, reliable upload and cloud storage of multimedia evidence for daily tasks." },
                { icon: Code, title: "Modern Tech Stack", desc: "A reactive React frontend paired with a powerful Node.js server and structured SQL database for flawless management." }
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-slate-50 p-10 rounded-[2.5rem] border border-primary/5 hover:bg-white hover:shadow-[0_20px_50px_rgba(0,32,69,0.05)] hover:-translate-y-2 transition-all duration-500">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm border border-slate-100">
                    <item.icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
                  </div>
                  <h4 className="text-xl font-serif text-primary mb-4">{item.title}</h4>
                  <p className="text-sm text-slate-500 font-light leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SYSTEM ARCHITECTURE - STICKY SCROLL */}
        <section className="relative bg-[#FDFDFB] border-t border-slate-100">
          <div className="w-full px-6 md:px-12 lg:px-24 pt-40 pb-20">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealUp}
              className="text-center mb-16"
            >
              <h2 className="text-5xl sm:text-6xl font-serif text-primary mb-8 tracking-tight">The Complete Ecosystem.</h2>
              <p className="text-slate-500 text-xl font-light max-w-3xl mx-auto leading-relaxed">
                A detailed breakdown of how our platform seamlessly connects institutions, host companies, interns, and mentors in one unified environment.
              </p>
            </motion.div>
          </div>

          <div className="w-full px-6 md:px-12 lg:px-24">
            {ecosystemPanels.map((panel, idx) => (
              <div key={idx} className="min-h-screen grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 py-32 border-t border-primary/10">
                
                {/* Sticky Left Column */}
                <div className="lg:col-span-5 relative">
                  <div className="lg:sticky lg:top-40">
                    <motion.div 
                      initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary-fixed-dim mb-6 block">0{idx + 1} / {panel.subtitle}</span>
                      <h3 className="text-4xl lg:text-[2.75rem] font-serif text-primary mb-8 leading-tight">{panel.title}</h3>
                      <p className="text-slate-500 text-lg leading-relaxed font-light">{panel.description}</p>
                    </motion.div>
                  </div>
                </div>

                {/* Scrolling Right Column (Steps) */}
                <div className="lg:col-span-7 lg:mt-0 mt-8 space-y-24">
                  {panel.steps.map((step, stepIdx) => (
                    <motion.div 
                      key={stepIdx}
                      initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: stepIdx * 0.1 }}
                      className="group"
                    >
                      <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-start">
                        <div className="text-sm font-semibold text-slate-300 group-hover:text-secondary-fixed-dim transition-colors duration-500 pt-2 shrink-0">
                          Step 0{stepIdx + 1}
                        </div>
                        <div>
                          <h4 className="text-3xl font-serif text-primary mb-4">{step.title}</h4>
                          <p className="text-slate-500 text-lg leading-relaxed font-light">{step.desc}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

              </div>
            ))}
          </div>
        </section>

        {/* MINIMAL CTA */}
        <section className="py-40 relative bg-white overflow-hidden text-center">
          <div className="max-w-4xl mx-auto px-6 relative z-10">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealUp}
            >
              <h2 className="text-6xl md:text-8xl font-serif text-primary mb-12 tracking-tight leading-[1.1]">
                Ready for a <br/>
                <span className="italic font-light text-slate-400">better journey?</span>
              </h2>
              <div className="flex flex-col sm:flex-row justify-center gap-6 mt-16">
                <Link to="/register/accountType" className="inline-flex items-center justify-center rounded-full bg-primary px-12 py-6 text-sm uppercase tracking-widest font-semibold text-white transition-all duration-700 hover:scale-105 hover:bg-[#001530] hover:shadow-[0_20px_40px_rgba(0,32,69,0.2)]">
                  Begin Now
                </Link>
                <button className="inline-flex items-center justify-center rounded-full bg-transparent border border-primary/20 px-12 py-6 text-sm uppercase tracking-widest font-semibold text-primary transition-all duration-700 hover:border-primary hover:bg-primary/5">
                  Talk to our team
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      {/* EDITORIAL FOOTER */}
      <footer className="bg-[#001530] text-slate-400 border-t border-white/5">
        <div className="w-full px-6 md:px-12 lg:px-24 py-24">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
            <div className="col-span-1 md:col-span-2">
              <div className="text-2xl font-serif text-white flex items-center gap-4 mb-8">
                SIWES Logbook.
              </div>
              <p className="text-slate-400 text-lg max-w-sm font-light leading-relaxed">
                Bringing warmth, reflection, and human connection to industrial training.
              </p>
            </div>
            <div>
              <h5 className="uppercase tracking-[0.2em] text-xs font-semibold text-white/50 mb-8">Platform</h5>
              <ul className="space-y-4 text-sm font-light">
                <li><a className="hover:text-secondary-fixed-dim transition-colors duration-500" href="#">Our Approach</a></li>
                <li><Link to="/Docs" className="hover:text-secondary-fixed-dim transition-colors duration-500">Documentation</Link></li>
                <li><Link to="/Support" className="hover:text-secondary-fixed-dim transition-colors duration-500">Support</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="uppercase tracking-[0.2em] text-xs font-semibold text-white/50 mb-8">Company</h5>
              <ul className="space-y-4 text-sm font-light">
                <li><a className="hover:text-secondary-fixed-dim transition-colors duration-500" href="#">Our Story</a></li>
                <li><a className="hover:text-secondary-fixed-dim transition-colors duration-500" href="#">Contact</a></li>
                <li><a className="hover:text-secondary-fixed-dim transition-colors duration-500" href="#">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-10 border-t border-white/10 flex justify-between items-center text-xs font-light tracking-wider text-white/40">
            <p>© 2026 SIWES Logbook.</p>
            <p>Handcrafted.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
