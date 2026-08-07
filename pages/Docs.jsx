import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ShieldCheck, HelpCircle, FileText, ChevronRight, Menu, X, ArrowLeft } from 'lucide-react';

const Docs = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('intro');

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'intro', label: '1. Introduction and Overview' },
    { id: 'getting-started', label: '2. Getting Started: The Ecosystem Flow' },
    { id: 'school-admin', label: '3. Institutional Administrator Guide (For Schools)' },
    { id: 'corp-admin', label: '4. Corporate Administrator Guide (For Host Companies)' },
    { id: 'student', label: '5. Student Dashboard Guide (For Interns)' },
    { id: 'supervisor', label: '6. Workplace Supervisor Guide (For Industry Mentors)' },
    { id: 'security', label: '7. Account Security and Troubleshooting' },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFB] font-sans text-slate-600 selection:bg-primary/20 flex flex-col">
      {/* HEADER */}
      <header className="sticky top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <nav className="flex items-center justify-between px-6 lg:px-12 h-16 max-w-[1600px] mx-auto">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full border border-primary/20 flex items-center justify-center transition-all duration-300 group-hover:bg-primary group-hover:border-primary">
              <BookOpen className="text-primary w-4 h-4 transition-colors duration-300 group-hover:text-white" strokeWidth={1.5} />
            </div>
            <span className="text-lg font-serif font-medium tracking-tight text-primary">
              SIWES Docs
            </span>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link to="/Support" className="text-sm font-semibold text-slate-500 hover:text-primary transition-colors hidden sm:block">
              Help & Support
            </Link>
            <Link to="/register/accountType" className="bg-primary text-white text-xs font-semibold uppercase tracking-widest px-6 py-2.5 rounded-full hover:bg-[#001530] transition-colors hidden sm:block">
              Go to Portal
            </Link>
            <button 
              className="lg:hidden text-slate-500 hover:text-primary"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>
      </header>

      <div className="flex-1 flex max-w-[1600px] mx-auto w-full relative">
        {/* SIDEBAR NAVIGATION */}
        <aside className={`fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-72 bg-white border-r border-slate-200 overflow-y-auto custom-scrollbar z-40 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="p-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Documentation</h3>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left text-sm transition-all duration-300 ${activeSection === item.id ? 'bg-primary/5 text-primary font-bold' : 'text-slate-600 hover:bg-slate-50 font-medium'}`}
                >
                  <span className="truncate pr-2">{item.label}</span>
                  {activeSection === item.id && <ChevronRight className="w-4 h-4 shrink-0" />}
                </button>
              ))}
            </nav>
            
            <div className="mt-12 pt-8 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Need more help?</h3>
              <Link to="/Support" className="flex items-center gap-3 text-sm font-semibold text-primary hover:text-[#001530] transition-colors">
                <HelpCircle className="w-4 h-4" /> Visit Support Center
              </Link>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 min-w-0 px-6 lg:px-24 py-12 lg:py-20 pb-32">
          <div className="max-w-3xl">
            
            <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors mb-12">
              <ArrowLeft className="w-4 h-4" /> Back Home
            </Link>

            <h1 className="text-4xl lg:text-5xl font-serif text-primary mb-6 leading-tight">Platform Documentation</h1>
            <p className="text-xl text-slate-500 font-light leading-relaxed mb-16">
              The official guide for institutions, organizations, supervisors, and students using the SIWES Electronic Logbook system.
            </p>

            <div className="space-y-24">
              
              {/* 1. Introduction */}
              <section id="intro" className="scroll-mt-24">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-3xl font-serif text-slate-900">1. Introduction and Overview</h2>
                </div>
                <div className="prose prose-slate prose-lg max-w-none font-light leading-relaxed text-slate-600">
                  <p>
                    Welcome to the official documentation for the electronic Student Industrial Work Experience Scheme (SIWES) tracking portal. This platform was developed to completely digitize and streamline the industrial training process, replacing the traditional, easily damaged paper logbooks with a secure, cloud-based ecosystem.
                  </p>
                  <p>
                    This guide is designed to help all stakeholders—educational institutions, corporate organizations, students, and workplace supervisors—understand how to navigate their specific dashboards, complete their required tasks, and maximize the efficiency of the platform. The system operates on a strict multi-tier architecture, ensuring that every user only sees the tools and data relevant to their specific role.
                  </p>
                </div>
              </section>

              {/* 2. Getting Started */}
              <section id="getting-started" className="scroll-mt-24">
                <h2 className="text-3xl font-serif text-slate-900 mb-6">2. Getting Started: The Ecosystem Flow</h2>
                <div className="prose prose-slate prose-lg max-w-none font-light leading-relaxed text-slate-600">
                  <p>
                    Before diving into individual dashboards, it is important to understand how the platform connects everyone. The application relies on a sequential onboarding process:
                  </p>
                  <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 my-8 space-y-4 font-medium">
                    <div className="flex items-center gap-4"><div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary shadow-sm border border-slate-200">1</div>The School registers and sets up the academic environment.</div>
                    <div className="flex items-center gap-4"><div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary shadow-sm border border-slate-200">2</div>The Company registers and sets up their corporate environment.</div>
                    <div className="flex items-center gap-4"><div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary shadow-sm border border-slate-200">3</div>The Student logs in, links to their school and company, and begins daily logging.</div>
                    <div className="flex items-center gap-4"><div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary shadow-sm border border-slate-200">4</div>The Supervisor evaluates and digitally signs the student's work weekly.</div>
                  </div>
                </div>
              </section>

              {/* 3. School Admin */}
              <section id="school-admin" className="scroll-mt-24">
                <h2 className="text-3xl font-serif text-slate-900 mb-6">3. Institutional Administrator Guide (For Schools)</h2>
                <div className="prose prose-slate prose-lg max-w-none font-light leading-relaxed text-slate-600">
                  <p className="mb-8">
                    This module is built for the school's SIWES Coordinators and IT administrators. It acts as the central command center for managing the entire student body's industrial training lifecycle.
                  </p>
                  
                  <h3 className="text-xl font-bold text-slate-800 mt-10 mb-4">3.1 Registering the Institution</h3>
                  <p>
                    To begin, the school administrator must create the master institutional profile. This requires verifying the institution's official email address via an automated OTP (One-Time Password) to ensure high-level security. Once verified, the administrator gains access to the global dashboard.
                  </p>

                  <h3 className="text-xl font-bold text-slate-800 mt-10 mb-4">3.2 Structuring Departments and Supervisors</h3>
                  <p>Before students can use the platform, the academic structure must be built:</p>
                  <ul>
                    <li><strong>Creating Departments:</strong> Administrators must add all participating departments (e.g., Computer Science, Engineering).</li>
                    <li><strong>Onboarding Academic Supervisors:</strong> The school admin generates accounts for internal lecturers who will serve as institutional supervisors. These supervisors will oversee the students' final academic defense.</li>
                  </ul>

                  <h3 className="text-xl font-bold text-slate-800 mt-10 mb-4">3.3 Managing Student Profiles</h3>
                  <p>
                    The platform allows administrators to register eligible students into the system. Once a student profile is created, the system generates secure login credentials that the student will use to access their portal. The dashboard provides real-time analytics showing how many students are actively logging their daily tasks versus those who are falling behind.
                  </p>
                </div>
              </section>

              {/* 4. Corporate Admin */}
              <section id="corp-admin" className="scroll-mt-24">
                <h2 className="text-3xl font-serif text-slate-900 mb-6">4. Corporate Administrator Guide (For Host Companies)</h2>
                <div className="prose prose-slate prose-lg max-w-none font-light leading-relaxed text-slate-600">
                  <p className="mb-8">
                    This module is for the HR managers or IT directors of the companies accepting students for industrial training.
                  </p>

                  <h3 className="text-xl font-bold text-slate-800 mt-10 mb-4">4.1 Establishing the Corporate Profile</h3>
                  <p>
                    The host company must register their organization on the portal. This process involves entering the company’s name, industry sector, and contact details. This profile makes the company visible to students searching for their placement location in the database.
                  </p>

                  <h3 className="text-xl font-bold text-slate-800 mt-10 mb-4">4.2 Accepting Interns</h3>
                  <p>
                    When a student officially begins their internship at the company, the corporate administrator will receive a placement request on their dashboard. The admin must review and "Accept" the student, which formally binds the student's logbook to that specific company.
                  </p>

                  <h3 className="text-xl font-bold text-slate-800 mt-10 mb-4">4.3 Assigning Workplace Supervisors</h3>
                  <p>
                    The corporate admin is responsible for creating accounts for their senior staff members who will act as mentors. Once these mentor accounts are created, the admin assigns specific students to specific supervisors, ensuring every intern has a direct manager to grade their weekly submissions.
                  </p>
                </div>
              </section>

              {/* 5. Student Dashboard */}
              <section id="student" className="scroll-mt-24">
                <h2 className="text-3xl font-serif text-slate-900 mb-6">5. Student Dashboard Guide (For Interns)</h2>
                <div className="prose prose-slate prose-lg max-w-none font-light leading-relaxed text-slate-600">
                  <p className="mb-8">
                    The student interface is the most actively used portion of the application. It is designed to be highly responsive, meaning it works flawlessly on both desktop computers and mobile phones.
                  </p>

                  <h3 className="text-xl font-bold text-slate-800 mt-10 mb-4">5.1 Account Setup and Linking</h3>
                  <p>
                    Upon logging in for the first time using the credentials provided by the school, the student must complete their profile. The most critical step is the "Company Linking" phase. The student searches for their host company from the registered database and sends a connection request. Once the company accepts, the digital logbook is officially activated.
                  </p>

                  <h3 className="text-xl font-bold text-slate-800 mt-10 mb-4">5.2 Creating Daily Log Entries</h3>
                  <p>Every workday, the student is required to document their activities:</p>
                  <ul>
                    <li><strong>Selecting the Date:</strong> The user selects the current working day from the built-in calendar.</li>
                    <li><strong>Task Description:</strong> A rich-text editor allows the student to thoroughly explain the tasks they performed, the software they used, and the problems they solved (e.g., "Configured a local Node.js server and resolved database routing errors").</li>
                  </ul>

                  <h3 className="text-xl font-bold text-slate-800 mt-10 mb-4">5.3 Uploading Multimedia Evidence</h3>
                  <p>
                    To prevent record falsification, the platform features a secure media upload tool powered by Cloudinary. Students can upload screenshots of their code, architectural diagrams, or photos of their physical workspace. The system automatically optimizes these images for fast loading and attaches them permanently to that specific day's record.
                  </p>

                  <h3 className="text-xl font-bold text-slate-800 mt-10 mb-4">5.4 The Weekly Submission and Lock</h3>
                  <p>
                    At the end of the work week (typically Friday), the student must review their daily entries. By clicking the "Submit Week for Review" button, the logbook for that week is permanently locked to prevent any tampering or backdating. An automated alert is immediately sent to their assigned workplace supervisor.
                  </p>
                </div>
              </section>

              {/* 6. Workplace Supervisor */}
              <section id="supervisor" className="scroll-mt-24">
                <h2 className="text-3xl font-serif text-slate-900 mb-6">6. Workplace Supervisor Guide (For Industry Mentors)</h2>
                <div className="prose prose-slate prose-lg max-w-none font-light leading-relaxed text-slate-600">
                  <p className="mb-8">
                    This dashboard is engineered for speed and efficiency, allowing busy tech professionals to evaluate their interns without the hassle of physical paperwork.
                  </p>

                  <h3 className="text-xl font-bold text-slate-800 mt-10 mb-4">6.1 Monitoring Submissions</h3>
                  <p>
                    When a supervisor logs in, they are presented with a clean interface highlighting any "Pending Reviews." They can see exactly which students have submitted their weekly logs and which are overdue.
                  </p>

                  <h3 className="text-xl font-bold text-slate-800 mt-10 mb-4">6.2 Reviewing Visuals and Text</h3>
                  <p>
                    Clicking on a pending submission opens the student's full week in a clear, readable format. The supervisor can read the daily task descriptions and click on the attached Cloudinary image links to view the visual proof of the work performed.
                  </p>

                  <h3 className="text-xl font-bold text-slate-800 mt-10 mb-4">6.3 Grading and Digital Signatures</h3>
                  <p>At the bottom of the weekly review page, the supervisor is provided with an evaluation form:</p>
                  <ul>
                    <li><strong>Feedback/Remarks:</strong> A text box to offer constructive criticism or praise for the week's performance.</li>
                    <li><strong>Scoring:</strong> A metric system to award weekly marks based on the company's grading criteria.</li>
                    <li><strong>Digital Approval:</strong> By clicking "Approve and Sign," the supervisor digitally locks the grade. This action automatically updates the student's dashboard and pushes the records to the school's central database for academic credit.</li>
                  </ul>
                </div>
              </section>

              {/* 7. Security */}
              <section id="security" className="scroll-mt-24">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  </div>
                  <h2 className="text-3xl font-serif text-slate-900">7. Account Security and Troubleshooting</h2>
                </div>
                <div className="prose prose-slate prose-lg max-w-none font-light leading-relaxed text-slate-600">
                  <p className="mb-8">
                    To ensure the integrity of the data, the platform employs modern security protocols:
                  </p>
                  <ul>
                    <li><strong>Role-Based Access Control (RBAC):</strong> Students cannot view administrative pages, and supervisors can only view the data of students directly assigned to them.</li>
                    <li><strong>Password Management:</strong> If a user forgets their password, they can utilize the automated "Forgot Password" link on the login page. This triggers a secure OTP email verification process to safely reset their credentials.</li>
                    <li><strong>Support Ticketing:</strong> If any user encounters a technical bug or an onboarding issue, they can utilize the built-in Help Desk button to send a direct message to the system administrators for swift resolution.</li>
                  </ul>
                  
                  <div className="mt-12 p-8 bg-blue-50 border border-blue-100 rounded-3xl text-center">
                    <h3 className="text-xl font-bold text-blue-900 mb-2">Still need help?</h3>
                    <p className="text-blue-800/80 mb-6">Our support team is available 24/7 to assist with technical issues.</p>
                    <Link to="/Support" className="inline-flex items-center gap-2 bg-primary text-white font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-full hover:bg-[#001530] transition-colors shadow-md">
                      Contact Support <HelpCircle className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </section>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Docs;
