import React, { useContext, useEffect, useState } from "react";
import Logo from '../src/components/Logo';
import { useNavigate, Link } from "react-router-dom";
import { context } from "../src/App";
import axios from "axios";
import user from "../public/profile.png";
import { GraduationCap, Users, FileCheck, LogOut, ShieldCheck, PenTool, Clock, BookUser, ClipboardCheck, Award, X, Edit3, Menu, Loader2 } from "lucide-react";
import { useDialog } from "../src/context/DialogContext";

const SupervisorDashboard = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { showAlert } = useDialog();
  const { schoolSupervisorCred } = useContext(context);
  const [logbooks, setLogbooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [activeTab, setActiveTab] = useState("roster"); // "roster" or "grading"
  const [selectedLog, setSelectedLog] = useState(null);
  const [grade, setGrade] = useState(85);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [submittingGrade, setSubmittingGrade] = useState(false);

  const handleOpenStudentDetails = (student) => {
    navigate(`/student-performance/${student.id}`);
  };

  useEffect(() => {
    if (!schoolSupervisorCred) {
      navigate("/register/accountType");
      return;
    }
    fetchLogbooks();
    fetchAssignedStudents();
  }, [schoolSupervisorCred]);

  const fetchLogbooks = () => {
    if (!schoolSupervisorCred?.id) return;
    axios.post("https://siwes-logbook-backend.onrender.com/user/student/logbook/fetch", {
      school_supervisor_id: schoolSupervisorCred?.id
    })
    .then((res) => {
      setLogbooks(res?.data?.message || []);
    })
    .catch((err) => console.log(err));
  };

  const fetchAssignedStudents = () => {
    if (!schoolSupervisorCred?.id) return;
    axios.post("https://siwes-logbook-backend.onrender.com/student/fetch-detailed", {
      school_supervisor_id: schoolSupervisorCred?.id
    })
    .then((res) => {
      setStudents(res?.data?.message || []);
    })
    .catch((err) => console.log(err));
  };

  const handleGradeSubmission = (e) => {
    e.preventDefault();
    if (!selectedLog) return;
    setSubmittingGrade(true);

    axios.post("https://siwes-logbook-backend.onrender.com/school-supervisor/logbook/grade", {
      id: selectedLog.id,
      school_supervisor_id: schoolSupervisorCred?.id,
      school_supervisor_grade: grade.toString()
    })
    .then(() => {
      showAlert("Academic grade saved successfully!");
      setSelectedLog(null);
      fetchLogbooks();
    })
    .catch((err) => showAlert(err?.response?.data?.message || "Error submitting grade"))
    .finally(() => setSubmittingGrade(false));
  };

  const unsignedCount = logbooks.filter(l => !l.school_supervisor_grade).length;
  const verifiedLogsCount = logbooks.filter(l => l.org_supervisor_signed).length;

  return (
    <div className="flex bg-[#FDFDFB] min-h-screen font-sans selection:bg-primary/20 text-slate-600">
      
      {/* Premium Sidebar */}
      {mobileMenuOpen && <div className="fixed inset-0 bg-slate-900/20 z-40 lg:hidden backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>}
        <aside className={`h-screen w-72 border-r border-slate-100 fixed left-0 top-0 bg-white flex flex-col py-8 z-50 shadow-[4px_0_24px_rgba(0,32,69,0.02)] transition-transform duration-300 lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Logo size="md" className="px-8 mb-12" subtitle="Academic Mentor" />
        <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden absolute top-8 right-6 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
          <X className="w-5 h-5" />
        </button>

        <nav className="flex-grow flex flex-col px-4 gap-2">
          <button
            onClick={() => setActiveTab("roster")}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm transition-all text-left flex justify-between ${
              activeTab === "roster" ? "bg-primary/5 text-primary font-bold shadow-sm" : "text-slate-500 font-medium hover:bg-primary/5 hover:text-primary"
            }`}
          >
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5" />
              Assigned Interns
            </div>
            <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-lg text-xs font-bold">{students.length}</span>
          </button>
          <button
            onClick={() => setActiveTab("grading")}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm transition-all text-left flex justify-between ${
              activeTab === "grading" ? "bg-primary/5 text-primary font-bold shadow-sm" : "text-slate-500 font-medium hover:bg-primary/5 hover:text-primary"
            }`}
          >
            <div className="flex items-center gap-3">
              <FileCheck className="w-5 h-5" />
              Grade Logbooks
            </div>
            <span className="bg-amber-100 text-amber-600 px-2 py-0.5 rounded-lg text-xs font-bold">{unsignedCount}</span>
          </button>
        </nav>

        <div className="mt-auto px-4">
          <div className="bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-100">
            <p className="text-xs font-bold text-slate-800 truncate">{schoolSupervisorCred?.Full_Name}</p>
            <p className="text-[10px] text-slate-500 truncate">{schoolSupervisorCred?.Email_Address || 'Lecturer'}</p>
          </div>
          <button onClick={() => navigate("/")} className="w-full flex items-center justify-center gap-2 px-4 py-3 text-rose-500 bg-rose-50 hover:bg-rose-100 transition-colors rounded-xl font-bold text-xs uppercase tracking-widest">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 flex-1 p-4 sm:p-6 lg:p-12 xl:p-16 pt-4 lg:pt-8 xl:pt-8 space-y-8 sm:space-y-12 w-full overflow-x-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 sticky top-4 z-30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10">
              <img src="/logo.png" alt="SIWES Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-serif font-bold text-primary">SIWES Logbook</span>
          </div>
          <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-primary focus:outline-none bg-primary/5 rounded-xl hover:bg-primary/10 transition-colors">
            <Menu className="w-6 h-6" />
          </button>
        </div>
        
        {/* Header Banner */}
        <div className="bg-white p-8 lg:p-10 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,32,69,0.03)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="relative z-10">
                <h1 className="text-4xl font-serif text-slate-900 mb-2">Academic Supervision</h1>
                <p className="text-slate-500 font-light text-lg">Grade student logs, monitor company mentor verification, and review training progress.</p>
            </div>
            <div className="flex gap-4 relative z-10 shrink-0">
                <div className="px-6 py-4 bg-primary/5 rounded-2xl border border-primary/10 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <ShieldCheck className="text-primary w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary/70 mb-0.5">Assigned Dept</p>
                        <p className="text-xl font-serif text-slate-900 leading-none">{schoolSupervisorCred?.department || "General"}</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6 group hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block mb-1">Students Assigned</span>
              <h3 className="text-3xl font-serif text-slate-800">{students.length}</h3>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6 group hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <PenTool className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block mb-1">Verified by Industry</span>
              <h3 className="text-3xl font-serif text-slate-800">{verifiedLogsCount}</h3>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6 group hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block mb-1">Pending Grading</span>
              <h3 className="text-3xl font-serif text-slate-800">{unsignedCount}</h3>
            </div>
          </div>
        </div>

        {/* Roster Tab Content */}
        {activeTab === "roster" && (
          <section className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-[0_20px_50px_rgba(0,32,69,0.03)]">
            <h2 className="text-2xl font-serif text-slate-900 flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <BookUser className="w-5 h-5 text-primary" />
              </div>
              Assigned Intern Directory
            </h2>

            <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    <th className="p-5">Student Name</th>
                    <th className="p-5">Matric No</th>
                    <th className="p-5">Department</th>
                    <th className="p-5">SIWES Duration</th>
                    <th className="p-5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-10 text-center text-slate-400 font-light text-lg">No students currently assigned to your supervision profile.</td>
                    </tr>
                  ) : (
                    students.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-5">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shadow-sm">
                              <img src={student.Profile_Img || user} alt="" className="w-full h-full object-cover" />
                            </div>
                            <span 
                              onClick={() => handleOpenStudentDetails(student)}
                              className="font-bold text-slate-800 cursor-pointer hover:underline hover:text-primary transition-colors text-base"
                            >
                              {student.Full_Name}
                            </span>
                          </div>
                        </td>
                        <td className="p-5 font-bold text-slate-600">{student.Matriculation_No}</td>
                        <td className="p-5 text-slate-600 font-light">{student.department || "General"}</td>
                        <td className="p-5 text-slate-600 font-light">
                          {student.Start_Date ? new Date(student.Start_Date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) : 'N/A'} - {student.End_Date ? new Date(student.End_Date).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'}) : 'N/A'}
                        </td>
                        <td className="p-5 text-right">
                          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[10px] font-bold uppercase tracking-widest">Active</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Grading Tab Content */}
        {activeTab === "grading" && (
          <section className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-[0_20px_50px_rgba(0,32,69,0.03)]">
            <h2 className="text-2xl font-serif text-slate-900 flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <ClipboardCheck className="w-5 h-5 text-primary" />
              </div>
              SIWES Logbook Grading Center
            </h2>

            <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    <th className="p-5">Date / Week</th>
                    <th className="p-5">Student Name</th>
                    <th className="p-5">Activity Description</th>
                    <th className="p-5">Mentor Verify</th>
                    <th className="p-5">Grade</th>
                    <th className="p-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {logbooks.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-10 text-center text-slate-400 font-light text-lg">No logbook entries found for your assigned students.</td>
                    </tr>
                  ) : (
                    logbooks.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="p-5">
                          <p className="font-bold text-slate-700 mb-1">{log.date ? new Date(log.date).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'}) : ""}</p>
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded-lg">Week {log.week_number}</span>
                        </td>
                        <td className="p-5">
                          <span 
                            onClick={() => {
                              const target = students.find(s => s.id === log.student_id);
                              if (target) {
                                handleOpenStudentDetails(target);
                              }
                            }}
                            className="font-bold text-primary cursor-pointer hover:underline transition-colors block"
                          >
                            {log.Student_Name}
                          </span>
                        </td>
                        <td className="p-5">
                            <p className="max-w-[250px] truncate text-slate-600 font-light" title={log.activity_description}>
                                {log.activity_description}
                            </p>
                        </td>
                        <td className="p-5">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest w-max flex items-center gap-1 ${
                            log.org_supervisor_signed ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-amber-50 text-amber-600 border border-amber-100"
                          }`}>
                            {log.org_supervisor_signed ? "Verified" : "Pending"}
                          </span>
                        </td>
                        <td className="p-5">
                            {log.school_supervisor_grade ? (
                                <span className="text-xl font-black text-slate-800">{log.school_supervisor_grade}%</span>
                            ) : (
                                <span className="text-xs text-slate-400 italic">Not Graded</span>
                            )}
                        </td>
                        <td className="p-5 text-right">
                          <button
                            onClick={() => {
                              setSelectedLog(log);
                              setGrade(log.school_supervisor_grade || 85);
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm text-xs font-bold uppercase tracking-widest rounded-xl transition-all"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary transition-colors" />
                            {log.school_supervisor_grade ? "Update" : "Grade"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Grade Modal */}
        {selectedLog && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] max-w-lg w-full p-8 shadow-[0_20px_60px_rgba(0,32,69,0.15)] border border-slate-100">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <h3 className="font-serif text-2xl text-primary flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Award className="w-5 h-5 text-primary" />
                  </div>
                  Record Academic Grade
                </h3>
                <button onClick={() => setSelectedLog(null)} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 mb-8">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Student Name</p>
                        <p className="font-bold text-slate-800">{selectedLog.Student_Name}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Logbook Week</p>
                        <p className="font-bold text-slate-800">Week {selectedLog.week_number}</p>
                    </div>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Activity Log</p>
                    <p className="text-sm font-light text-slate-600 leading-relaxed">{selectedLog.activity_description}</p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Industry Mentor Status</p>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${selectedLog.org_supervisor_signed ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                        {selectedLog.org_supervisor_signed ? "Verified" : "Pending"}
                    </span>
                </div>
              </div>

              <form onSubmit={handleGradeSubmission} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Academic Score (%) *</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-xl text-lg font-black text-slate-800 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-center"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button type="submit" disabled={submittingGrade} className="flex-1 h-14 bg-primary text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#001530] hover:shadow-[0_10px_20px_rgba(0,32,69,0.15)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none">
                    {submittingGrade ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving Grade...</> : <><Award className="w-4 h-4" /> Save Grade</>}
                  </button>
                  <button type="button" onClick={() => setSelectedLog(null)} className="px-6 h-14 bg-slate-100 text-slate-600 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default SupervisorDashboard;
