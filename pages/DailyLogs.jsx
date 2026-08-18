import React, { useContext, useEffect, useState } from "react";
import Logo from '../src/components/Logo';
import { Link, useNavigate } from "react-router-dom";
import { context } from "../src/App";
import axios from "axios";
import { uploadImg } from "../Cloudinary";
import { GraduationCap, LayoutDashboard, FileEdit, LogOut, User, AlertTriangle, Edit2, PlusCircle, UploadCloud, Trash2, RefreshCw, Save, Send, History, Image as ImageIcon, CheckCircle, CalendarDays, Menu, X, Clock } from "lucide-react";
import { useDialog } from "../src/context/DialogContext";

const DailyLogs = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { showAlert, showConfirm } = useDialog();
  const { studentCred } = useContext(context);
  const [logs, setLogs] = useState([]);
  
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split("T")[0]);
  const [weekNumber, setWeekNumber] = useState(1);
  const [activityDescription, setActivityDescription] = useState("");
  const [imageAttachment, setImageAttachment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingLogId, setEditingLogId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

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

  const getLogBlockReason = () => {
    if (!profile) return null;
    
    if (!profile.Organization_Id || !profile.Organization_Supervisor_Id || !profile.School_Supervisor_Id) {
      return {
        title: "Logbook Entry Blocked",
        desc: "You cannot fill your SIWES logbook yet because your training profile is not fully registered. Please ensure you have been accepted at a company, and both your industry supervisor and school supervisor have been assigned."
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (profile.Start_Date) {
      const start = new Date(profile.Start_Date);
      start.setHours(0, 0, 0, 0);
      if (today < start) {
        const daysBeforeStart = Math.ceil((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return {
          title: "Internship Not Started",
          desc: `Your internship is scheduled to start on ${start.toLocaleDateString()} (in ${daysBeforeStart} day${daysBeforeStart !== 1 ? 's' : ''}). You cannot record daily log entries before this date.`
        };
      }
    }

    if (profile.End_Date) {
      const end = new Date(profile.End_Date);
      end.setHours(0, 0, 0, 0);
      if (today > end) {
        return {
          title: "Internship Period Ended",
          desc: `Your internship period ended on ${end.toLocaleDateString()}. Submitting new logs is now locked.`
        };
      }
    }

    return null;
  };

  const blockReason = getLogBlockReason();

  useEffect(() => {
    if (!studentCred) {
      navigate("/register/accountType");
      return;
    }
    axios.post("http://localhost:5687/user/student/profile", { id: studentCred?.id })
      .then((res) => {
        setProfile(res?.data?.message || null);
      })
      .catch((err) => console.log(err));
    fetchLogs();
  }, [studentCred]);

  const fetchLogs = () => {
    if (!studentCred?.id) return;
    axios.post("http://localhost:5687/user/student/logbook/fetch", {
      student_id: studentCred?.id
    })
    .then((res) => {
      setLogs(res?.data?.message || []);
    })
    .catch((err) => console.log(err));
  };

  const handleSubmitLog = async (e) => {
    e.preventDefault();
    if (!entryDate || !activityDescription) return showAlert("Please fill in entry date and description");

    const dateExists = logs.some(log => {
      if (isEditing && log.id === editingLogId) return false;
      return new Date(log.date).toISOString().split('T')[0] === entryDate;
    });
    if (dateExists) {
      return showAlert("You have already recorded a logbook entry for this date.");
    }

    const selectedTime = new Date(entryDate).setHours(0,0,0,0);
    const todayTime = new Date().setHours(0,0,0,0);
    if (selectedTime > todayTime) {
      return showAlert("Cannot record a logbook entry for a future date.");
    }

    if (profile?.End_Date) {
      const endTime = new Date(profile.End_Date).setHours(0,0,0,0);
      if (selectedTime > endTime) {
        return showAlert("Cannot record a logbook entry after your SIWES end date.");
      }
    }

    setUploading(true);
    let uploadedUrl = imageAttachment;
    try {
      if (selectedFile) {
        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = (err) => reject(err);
          reader.readAsDataURL(selectedFile);
        });
        const secureUrl = await uploadImg(base64);
        if (!secureUrl) {
          showAlert("Image upload failed. Please try again.");
          setUploading(false);
          return;
        }
        uploadedUrl = secureUrl;
      }

      if (isEditing) {
        await axios.post("http://localhost:5687/user/student/logbook/update", {
          id: editingLogId,
          activity_description: activityDescription,
          image_attachment: uploadedUrl || null
        });
        showAlert("Log entry updated successfully!");
        resetForm();
        fetchLogs();
      } else {
        await axios.post("http://localhost:5687/user/student/logbook/create", {
          student_id: studentCred?.id,
          date: entryDate,
          week_number: weekNumber,
          activity_description: activityDescription,
          image_attachment: uploadedUrl || null
        });
        showAlert("Daily log entry recorded!");
        resetForm();
        fetchLogs();
      }
    } catch (err) {
      showAlert(err?.response?.data?.message || "Error submitting log entry");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setEntryDate(new Date().toISOString().split("T")[0]);
    setWeekNumber(1);
    setActivityDescription("");
    setImageAttachment("");
    setSelectedFile(null);
    setPreviewUrl("");
    setIsEditing(false);
    setEditingLogId(null);
  };

  const handleEditClick = (log) => {
    setIsEditing(true);
    setEditingLogId(log.id);
    setEntryDate(log.date ? new Date(log.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]);
    setWeekNumber(log.week_number || 1);
    setActivityDescription(log.activity_description || "");
    setImageAttachment(log.image_attachment || "");
    setPreviewUrl(log.image_attachment || "");
    setSelectedFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = async (id) => {
    const confirm = await showConfirm("Are you sure you want to delete this logbook entry?");
    if (!confirm) return;
    axios.post("http://localhost:5687/user/student/logbook/delete", { id })
      .then(() => {
        showAlert("Log entry deleted");
        fetchLogs();
      })
      .catch((err) => showAlert(err?.response?.data?.message || "Error deleting entry"));
  };

  return (
    <div className="flex bg-[#FDFDFB] min-h-screen font-sans selection:bg-primary/20 text-slate-600">
      
      {/* Premium Sidebar */}
      {mobileMenuOpen && <div className="fixed inset-0 bg-slate-900/20 z-40 lg:hidden backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>}
        <aside className={`h-screen w-72 border-r border-slate-100 fixed left-0 top-0 bg-white flex flex-col py-8 z-50 shadow-[4px_0_24px_rgba(0,32,69,0.02)] transition-transform duration-300 lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Logo size="md" className="px-8 mb-12" subtitle="Student Dash" />
        <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden absolute top-8 right-6 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
          <X className="w-5 h-5" />
        </button>

        <nav className="flex-grow flex flex-col px-4 gap-2">
          <Link
            className="flex items-center gap-3 px-4 py-3.5 text-slate-500 font-medium hover:text-primary hover:bg-primary/5 transition-all rounded-2xl"
            to="/student-dashboard"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-sm">Overview</span>
          </Link>
          <Link
            className="flex items-center gap-3 px-4 py-3.5 text-primary font-semibold bg-primary/5 rounded-2xl"
            to="/student-dashboard/daily-logs"
          >
            <FileEdit className="w-5 h-5" />
            <span className="text-sm">Daily Logbook</span>
          </Link>
        </nav>

        <div className="mt-auto px-4">
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
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl font-serif text-slate-900 mb-2">Daily Logbook</h1>
            <p className="text-slate-500 font-light">Record your daily practical training activities, tasks, and reflections.</p>
          </div>
          <div className="flex items-center gap-3 px-5 py-3 bg-white border border-slate-200 rounded-full shadow-sm">
            <User className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary tracking-wide">{studentCred?.Full_Name || "Student"}</span>
          </div>
        </header>

        {/* Form Block */}
        {blockReason ? (
          <section className="bg-amber-50 border border-amber-200 rounded-[2rem] p-10 text-center space-y-4 shadow-[0_10px_30px_rgba(245,158,11,0.05)]">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="text-amber-600 w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl text-amber-900">{blockReason.title}</h3>
            <p className="text-sm text-amber-700/80 font-medium max-w-lg mx-auto leading-relaxed">
              {blockReason.desc}
            </p>
          </section>
        ) : (
          <section className="bg-white border border-slate-100 rounded-[2rem] p-8 lg:p-12 shadow-[0_20px_50px_rgba(0,32,69,0.03)] relative overflow-hidden">
            {isEditing && (
              <div className="absolute top-0 left-0 w-full h-1 bg-amber-400"></div>
            )}
            <h2 className="text-2xl font-serif text-slate-900 mb-8 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isEditing ? 'bg-amber-50 text-amber-500' : 'bg-primary/10 text-primary'}`}>
                {isEditing ? <Edit2 className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
              </div>
              {isEditing ? "Edit Logbook Entry" : "Record New Entry"}
            </h2>
            
            <form onSubmit={handleSubmitLog} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Entry Date</label>
                  <input
                    type="date"
                    required
                    disabled={isEditing}
                    min={profile?.Start_Date ? new Date(profile.Start_Date).toISOString().split("T")[0] : undefined}
                    max={(() => {
                      const todayStr = new Date().toISOString().split("T")[0];
                      if (!profile?.End_Date) return todayStr;
                      const endStr = new Date(profile.End_Date).toISOString().split("T")[0];
                      return endStr < todayStr ? endStr : todayStr;
                    })()}
                    value={entryDate}
                    onChange={(e) => setEntryDate(e.target.value)}
                    className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all disabled:opacity-50 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">SIWES Week</label>
                  <select
                    required
                    disabled={isEditing}
                    value={weekNumber}
                    onChange={(e) => setWeekNumber(Number(e.target.value))}
                    className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all disabled:opacity-50 cursor-pointer appearance-none"
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>Week {i + 1}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Detailed Task Description</label>
                <textarea
                  rows="6"
                  required
                  value={activityDescription}
                  onChange={(e) => setActivityDescription(e.target.value)}
                  placeholder="Explain your tasks, the tools you used, and what you learned today..."
                  className="w-full p-5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all resize-none leading-relaxed"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Visual Evidence (Optional)</label>
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-slate-200 hover:border-primary rounded-2xl p-6 bg-slate-50/50 flex flex-col items-center justify-center cursor-pointer transition-colors"
                >
                  <input
                    type="file"
                    accept="image/*"
                    id="logbook-image-file"
                    className="hidden"
                    onChange={(e) => handleImageSelect(e.target.files[0])}
                  />
                  {previewUrl ? (
                    <div className="flex flex-col sm:flex-row items-center gap-6 w-full justify-between">
                      <div className="flex items-center gap-4">
                        <img src={previewUrl} alt="Preview" className="w-24 h-24 object-cover rounded-xl border border-slate-200 shadow-sm" />
                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            {selectedFile ? "Ready for upload" : "Current Attachment"}
                          </p>
                          <span className="text-xs text-slate-400 truncate max-w-[200px] block mt-1">
                            {selectedFile ? selectedFile.name : "Stored in Cloudinary"}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedFile(null);
                          setPreviewUrl("");
                          setImageAttachment("");
                        }}
                        className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold uppercase tracking-widest rounded-xl transition-colors flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" /> Remove
                      </button>
                    </div>
                  ) : (
                    <label htmlFor="logbook-image-file" className="w-full py-6 flex flex-col items-center cursor-pointer">
                      <div className="w-16 h-16 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center mb-4 text-slate-400">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-medium text-slate-600">Drag & Drop or <span className="text-primary hover:underline">browse</span></p>
                      <p className="text-xs text-slate-400 mt-2 font-light">Supports JPG, PNG (Max 5MB)</p>
                    </label>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 h-14 bg-primary text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#001530] hover:shadow-[0_10px_20px_rgba(0,32,69,0.15)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {uploading ? (
                    <><RefreshCw className="w-4 h-4 animate-spin" /> Saving & Uploading...</>
                  ) : (
                    isEditing ? <><Save className="w-4 h-4" /> Save Changes</> : <><Send className="w-4 h-4" /> Publish Log</>
                  )}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={resetForm}
                    className="px-8 h-14 bg-slate-100 text-slate-600 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>
        )}

        {/* History Log */}
        <section className="bg-white border border-slate-100 rounded-[2rem] p-8 lg:p-12 shadow-[0_20px_50px_rgba(0,32,69,0.03)]">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
            <h2 className="text-2xl font-serif text-slate-900 flex items-center gap-3">
              <History className="w-6 h-6 text-slate-400" />
              Logbook History
            </h2>
            <span className="bg-slate-100 text-slate-600 font-bold text-xs px-4 py-2 rounded-full">
              {logs.length} Entries
            </span>
          </div>

          <div className="space-y-6">
            {logs.length === 0 ? (
              <div className="text-center py-16">
                <CalendarDays className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-light text-lg">No entries found. Start journaling above!</p>
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="p-6 bg-slate-50 border border-slate-100 rounded-2xl hover:border-primary/20 transition-colors group flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-serif text-lg text-slate-800">
                        {log.date ? new Date(log.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : ""}
                      </span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Week {log.week_number}</span>
                      
                      {log.org_supervisor_signed ? (
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Signed
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Pending
                        </span>
                      )}
                    </div>
                    
                    <p className="text-slate-600 font-light leading-relaxed">{log.activity_description}</p>
                    
                    {log.image_attachment && (
                      <a href={log.image_attachment} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:text-[#001530] transition-colors mt-2">
                        <ImageIcon className="w-4 h-4" /> View Attachment
                      </a>
                    )}
                    
                    {log.org_supervisor_comment && (
                      <div className="mt-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100/50">
                        <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-1">Mentor Feedback</p>
                        <p className="text-sm text-blue-900 font-medium italic">"{log.org_supervisor_comment}"</p>
                      </div>
                    )}
                    
                    {log.school_supervisor_grade && (
                      <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-100">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Grade</span>
                        <span className="text-sm font-black text-emerald-800">{log.school_supervisor_grade}%</span>
                      </div>
                    )}
                  </div>

                  {/* Allow edit/delete only if unsigned AND it's today's log (as per original logic) */}
                  {!log.org_supervisor_signed && new Date(log.date).setHours(0,0,0,0) === new Date().setHours(0,0,0,0) && (
                    <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-4">
                      <button onClick={() => handleEditClick(log)} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteClick(log.id)} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default DailyLogs;
