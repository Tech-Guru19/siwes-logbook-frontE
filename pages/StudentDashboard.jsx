import React, { useContext, useEffect, useState } from "react";
import Logo from '../src/components/Logo';
import { Link, useNavigate } from "react-router-dom";
import { context } from "../src/App";
import axios from "axios";
import SupervisorContacts from "../components/Student/SupervisorContacts";
import WeeklyTracker from "../components/Student/WeeklyTracker";
import BankDetailsModal from "../components/Student/BankDetailsModal";
import DocumentUploadModal from "../components/Student/DocumentUploadModal";
import LeaveRequestModal from "../components/Student/LeaveRequestModal";
import { 
  LayoutDashboard, FileEdit, Building2, LogOut, Clock, Calendar, 
  BookOpen, CheckCircle, Building, MapPin, Mail, UserPlus, 
  TrendingUp, Landmark, UploadCloud, CalendarOff, X, Search 
} from "lucide-react";
import { useDialog } from "../src/context/DialogContext";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { showAlert } = useDialog();
  const { studentCred } = useContext(context);
  const [showPlacementModal, setShowPlacementModal] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [logbooks, setLogs] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [detailedProfile, setDetailedProfile] = useState(null);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [showBankModal, setShowBankModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const getInternshipStatus = () => {
    if (!studentCred?.Start_Date || !studentCred?.End_Date) {
      return { status: "not_configured", message: "SIWES Dates Not Configured", desc: "Your SIWES start and end dates are not configured yet.", subMessage: "Please check with your coordinator." };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(studentCred.Start_Date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(studentCred.End_Date);
    end.setHours(0, 0, 0, 0);

    const timeRemaining = end.getTime() - today.getTime();
    const timeBeforeStart = start.getTime() - today.getTime();

    const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));
    const daysBeforeStart = Math.ceil(timeBeforeStart / (1000 * 60 * 60 * 24));

    if (today < start) {
      return {
        status: "not_started",
        message: "Not Started",
        desc: `Your internship is scheduled to start in ${daysBeforeStart} day${daysBeforeStart !== 1 ? 's' : ''}.`,
        subMessage: `Schedule: ${start.toLocaleDateString()} to ${end.toLocaleDateString()}`,
        badgeColor: "bg-amber-100 text-amber-700"
      };
    } else if (today > end) {
      return {
        status: "ended",
        message: "Ended",
        desc: "The registered SIWES internship period has expired.",
        subMessage: `Completed on: ${end.toLocaleDateString()}`,
        badgeColor: "bg-rose-100 text-rose-700"
      };
    } else {
      return {
        status: "active",
        message: "Active",
        desc: `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining of your training.`,
        subMessage: `Ends on: ${end.toLocaleDateString()}`,
        badgeColor: "bg-emerald-100 text-emerald-700"
      };
    }
  };

  const timeline = getInternshipStatus();

  useEffect(() => {
    if (!studentCred) {
      navigate("/register/accountType");
      return;
    }
    fetchLogs();
    fetchPlacements();
    fetchDetailedProfile();
    fetchLeaves();
  }, [studentCred]);

  const fetchDetailedProfile = () => {
    axios.post("https://siwes-logbook-backend.onrender.com/student/fetch-detailed", { student_id: studentCred?.id })
      .then((res) => {
        if (res?.data?.message?.length > 0) {
          setDetailedProfile(res.data.message[0]);
        }
      })
      .catch((err) => console.log(err));
  };

  const fetchLeaves = () => {
    axios.post("https://siwes-logbook-backend.onrender.com/leave/fetch/student", { student_id: studentCred?.id })
      .then((res) => setLeaveRequests(res?.data?.message || []))
      .catch((err) => console.log(err));
  };

  const fetchLogs = () => {
    axios.post("https://siwes-logbook-backend.onrender.com/user/student/logbook/fetch", { student_id: studentCred?.id })
      .then((res) => setLogs(res?.data?.message || []))
      .catch((err) => console.log(err));
  };

  const fetchPlacements = () => {
    axios.post("https://siwes-logbook-backend.onrender.com/organization/placements/fetch", { student_id: studentCred?.id })
      .then((res) => {
        setPlacements(res?.data?.message || []);
      })
      .catch((err) => console.log(err));
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    axios.post("https://siwes-logbook-backend.onrender.com/organization/search", { query: value })
      .then((res) => {
        setOrganizations(res?.data?.message || []);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (showPlacementModal) {
      handleSearchChange("");
    }
  }, [showPlacementModal]);

  const handleApplyPlacement = (e) => {
    e.preventDefault();
    if (!selectedOrg) return showAlert("Please select a company to apply");

    axios.post("https://siwes-logbook-backend.onrender.com/user/student/placement/apply", {
      student_id: studentCred?.id,
      organization_id: selectedOrg.id
    })
    .then(() => {
      showAlert("Placement application submitted successfully!");
      setShowPlacementModal(false);
      setSelectedOrg(null);
      setSearchQuery("");
      fetchPlacements();
    })
    .catch((err) => showAlert(err?.response?.data?.message || "Error submitting application"));
  };

  return (
    <div className="flex bg-[#FDFDFB] min-h-screen font-sans selection:bg-primary/20 text-slate-600">
      {/* Premium Sidebar */}
      <aside className="h-screen w-72 border-r border-slate-100 fixed left-0 top-0 bg-white flex flex-col py-8 z-40 shadow-[4px_0_24px_rgba(0,32,69,0.02)] hidden lg:flex">
        <Logo size="md" className="px-8 mb-12" subtitle="Student Dash" />

        <nav className="flex-grow flex flex-col px-4 gap-2">
          <Link
            className="flex items-center gap-3 px-4 py-3.5 text-primary font-semibold bg-primary/5 rounded-2xl"
            to="/student-dashboard"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-sm">Overview</span>
          </Link>
          <Link
            className="flex items-center gap-3 px-4 py-3.5 text-slate-500 font-medium hover:text-primary hover:bg-primary/5 transition-all rounded-2xl"
            to="/student-dashboard/daily-logs"
          >
            <FileEdit className="w-5 h-5" />
            <span className="text-sm">Daily Logbook</span>
          </Link>
          <button
            onClick={() => setShowPlacementModal(true)}
            className="flex items-center gap-3 px-4 py-3.5 text-slate-500 font-medium hover:text-primary hover:bg-primary/5 transition-all rounded-2xl text-left w-full"
          >
            <Building2 className="w-5 h-5" />
            <span className="text-sm">Placements</span>
          </button>
        </nav>

        <div className="mt-auto px-4">
          <div className="bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-100">
            <p className="text-xs font-bold text-slate-800 truncate">{studentCred?.Full_Name}</p>
            <p className="text-[10px] text-slate-500 truncate">{studentCred?.Email_Address}</p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-rose-500 bg-rose-50 hover:bg-rose-100 transition-colors rounded-xl font-bold text-xs uppercase tracking-widest"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 flex-1 p-6 lg:p-12 xl:p-16 pt-4 lg:pt-8 xl:pt-8 space-y-12">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h2 className="text-4xl font-serif text-slate-900 mb-2">
              Welcome back, <span className="text-primary italic">{studentCred?.Full_Name?.split(' ')[0] || "Student"}</span>
            </h2>
            <p className="text-slate-500 font-light flex items-center gap-2">
              Matric: <span className="font-semibold text-slate-700">{studentCred?.Matriculation_No || "Enrolled"}</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full mx-2"></span>
              Dept: <span className="font-semibold text-slate-700">{studentCred?.department || "General"}</span>
            </p>
          </div>
          <button
            onClick={() => navigate("/student-dashboard/daily-logs")}
            className="bg-primary text-white font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:bg-[#001530] hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
            <FileEdit className="w-4 h-4" />
            Write Log
          </button>
        </header>

        {/* Timeline & Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,32,69,0.03)] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
            
            <div className="flex items-center justify-between relative z-10 mb-8">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Internship Timeline
              </h3>
              {studentCred?.Start_Date && studentCred?.End_Date && (
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${timeline.badgeColor}`}>
                  {timeline.message}
                </span>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 relative z-10">
              <div>
                <p className="text-2xl font-serif text-slate-800 mb-2">{timeline.desc}</p>
                <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> {timeline.subMessage}
                </p>
              </div>
              {timeline.status === "active" && (
                <div className="flex items-center gap-4 bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100">
                  <span className="text-5xl font-serif text-primary">{timeline.desc.split(" ")[0]}</span>
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-tight">Days<br/>Left</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,32,69,0.03)] flex items-center gap-6">
              <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-widest font-bold block mb-1">Total Logs</span>
                <h3 className="text-3xl font-serif text-slate-800">{logbooks.length}</h3>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,32,69,0.03)] flex items-center gap-6">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center shrink-0">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-widest font-bold block mb-1">Signed Off</span>
                <h3 className="text-3xl font-serif text-slate-800">
                  {logbooks.filter(l => l.org_supervisor_signed).length}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Link to="/student-dashboard/daily-logs" className="group bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-[0_20px_50px_rgba(0,32,69,0.05)] hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FileEdit className="w-5 h-5 text-primary" />
            </div>
            <h4 className="font-serif text-xl text-slate-800 mb-2">Daily Logbook</h4>
            <p className="text-sm text-slate-500 font-light">Record today's tasks and upload visual evidence.</p>
          </Link>

          <button onClick={() => setShowPlacementModal(true)} className="text-left group bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-[0_20px_50px_rgba(0,32,69,0.05)] hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <UserPlus className="w-5 h-5 text-emerald-500" />
            </div>
            <h4 className="font-serif text-xl text-slate-800 mb-2">Apply Placement</h4>
            <p className="text-sm text-slate-500 font-light">Submit an IT placement request to a host company.</p>
          </button>

          <Link to={`/student-performance/${studentCred?.id}`} className="group bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-[0_20px_50px_rgba(0,32,69,0.05)] hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5 text-indigo-500" />
            </div>
            <h4 className="font-serif text-xl text-slate-800 mb-2">Performance</h4>
            <p className="text-sm text-slate-500 font-light">View your academic grades and metrics.</p>
          </Link>

          <button onClick={() => setShowBankModal(true)} className="text-left group bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-[0_20px_50px_rgba(0,32,69,0.05)] hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Landmark className="w-5 h-5 text-amber-500" />
            </div>
            <h4 className="font-serif text-xl text-slate-800 mb-2">Bank Details</h4>
            <p className="text-sm text-slate-500 font-light">Update account info for ITF stipend disbursement.</p>
          </button>

          <button onClick={() => setShowUploadModal(true)} className="text-left group bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-[0_20px_50px_rgba(0,32,69,0.05)] hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 bg-sky-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-5 h-5 text-sky-500" />
            </div>
            <h4 className="font-serif text-xl text-slate-800 mb-2">Documents</h4>
            <p className="text-sm text-slate-500 font-light">Upload Acceptance Letter and ITF Form 8.</p>
          </button>

          <button onClick={() => setShowLeaveModal(true)} className="text-left group bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-[0_20px_50px_rgba(0,32,69,0.05)] hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <CalendarOff className="w-5 h-5 text-rose-500" />
            </div>
            <h4 className="font-serif text-xl text-slate-800 mb-2">Request Leave</h4>
            <p className="text-sm text-slate-500 font-light">Apply for an official leave of absence.</p>
          </button>
        </div>

        {/* Mentors & Trackers */}
        <SupervisorContacts profile={detailedProfile} />
        <WeeklyTracker logbooks={logbooks} />

        {/* Placements Card */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,32,69,0.03)] space-y-6">
          <h3 className="text-xl font-serif text-primary flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center">
              <Building className="text-primary w-5 h-5" />
            </div>
            IT Placement Status
          </h3>
          
          {placements.length === 0 ? (
            <div className="p-8 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
              <div>
                <p className="text-lg font-serif text-slate-800">No Placement Request Submitted</p>
                <p className="text-sm text-slate-500 font-light mt-1">Apply for a workplace target to start your SIWES supervisor onboarding.</p>
              </div>
              <button 
                onClick={() => setShowPlacementModal(true)} 
                className="px-6 py-3 bg-primary text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-[#001530] hover:shadow-lg hover:-translate-y-0.5 transition-all shrink-0"
              >
                Find Placements
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {placements.map((p) => (
                <div key={p.id} className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col justify-between">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-bold text-slate-800 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      {p.Organization_Name}
                    </h4>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      p.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                      p.status === 'Rejected' ? 'bg-rose-100 text-rose-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {p.status || 'Pending'}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" /> {p.Organization_Email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modals */}
        {showBankModal && (
          <BankDetailsModal
            profile={detailedProfile}
            onClose={() => setShowBankModal(false)}
            onSuccess={() => {
              setShowBankModal(false);
              fetchDetailedProfile();
            }}
          />
        )}
        
        {showUploadModal && (
          <DocumentUploadModal
            profile={detailedProfile}
            onClose={() => setShowUploadModal(false)}
            onSuccess={() => {
              setShowUploadModal(false);
              fetchDetailedProfile();
            }}
          />
        )}

        {showLeaveModal && (
          <LeaveRequestModal
            profile={detailedProfile}
            onClose={() => setShowLeaveModal(false)}
            onSuccess={() => {
              setShowLeaveModal(false);
              fetchLeaves();
            }}
          />
        )}

        {/* Apply Placement Modal */}
        {showPlacementModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] max-w-lg w-full p-8 space-y-6 shadow-[0_20px_60px_rgba(0,32,69,0.15)] border border-slate-100">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="font-serif text-2xl text-primary flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  Apply for Placement
                </h3>
                <button onClick={() => setShowPlacementModal(false)} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Search Partner Company</label>
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Search by company name or state..."
                    className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* Company Directory List */}
              <div className="max-h-60 overflow-y-auto space-y-3 custom-scrollbar">
                {organizations.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <p className="text-sm text-slate-500 font-light">No matching partner companies registered.</p>
                  </div>
                ) : (
                  organizations.map((org) => (
                    <div
                      key={org.id}
                      onClick={() => setSelectedOrg(org)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedOrg?.id === org.id
                          ? "bg-primary/5 border-primary shadow-sm"
                          : "bg-white border-slate-200 hover:border-primary/30"
                      }`}
                    >
                      <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2 mb-2">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        {org.Name}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium flex items-center gap-2 mb-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {org.Location || "N/A"}
                      </p>
                      <p className="text-xs text-slate-500 font-medium flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        {org.Email_Address}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleApplyPlacement} className="space-y-5 pt-4 border-t border-slate-100">
                {selectedOrg && (
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-emerald-600 mb-1">Selected Target</p>
                    <p className="font-bold text-emerald-900">{selectedOrg.Name}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={!selectedOrg}
                    className="flex-1 h-12 bg-primary text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#001530] hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPlacementModal(false);
                      setSelectedOrg(null);
                      setSearchQuery("");
                    }}
                    className="px-6 h-12 bg-slate-100 text-slate-600 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-colors"
                  >
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

export default StudentDashboard;
