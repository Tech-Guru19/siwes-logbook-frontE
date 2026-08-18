import React, { useContext, useEffect, useState } from 'react'
import { context } from '../../src/App'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Logo from '../../src/components/Logo'
import user from '../../public/profile.png'
import { BadgeInfo, LogOut, Edit3, Users, CalendarOff, BadgeCheck, UserCheck, FileSignature, X, Star, MessageSquare, CheckCircle2, GraduationCap, Building2, MapPin, Mail, Phone, BookOpen, Clock, Menu, Loader2 } from 'lucide-react'
import { useDialog } from '../../src/context/DialogContext'

const OrgSupervisorDashboard = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate()
    const { organizationSupervisorCred } = useContext(context)
    const { showAlert, showConfirm } = useDialog()
    const [logbooks, setLogbooks] = useState([])
    const [assignedStudents, setAssignedStudents] = useState([])
    const [selectedLog, setSelectedLog] = useState(null)
    const [comment, setComment] = useState('')
    const [rating, setRating] = useState(0)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState(null)
    const [selectedStudentLogs, setSelectedStudentLogs] = useState([])
    const [allLeaveRequests, setAllLeaveRequests] = useState([])
    const [activeTab, setActiveTab] = useState('logbooks')
    const [signingOff, setSigningOff] = useState(false)
    const [updatingLeave, setUpdatingLeave] = useState(null)

    useEffect(() => {
        if (!organizationSupervisorCred) {
            navigate('/register/accountType')
            return
        }
        fetchInternLogbooks()
        fetchAssignedStudents()
        fetchAllLeaves()
    }, [organizationSupervisorCred])

    const fetchAllLeaves = () => {
        if (!organizationSupervisorCred?.id) return
        axios.post('https://siwes-logbook-backend.onrender.com/leave/fetch/org-supervisor-all', {
            org_supervisor_id: organizationSupervisorCred?.id
        })
        .then((res) => setAllLeaveRequests(res?.data?.message || []))
        .catch((err) => console.log(err))
    }

    const fetchInternLogbooks = () => {
        if (!organizationSupervisorCred?.id) return
        axios.post('https://siwes-logbook-backend.onrender.com/user/student/logbook/fetch', {
            org_supervisor_id: organizationSupervisorCred?.id
        })
        .then((res) => {
            setLogbooks(res?.data?.message || [])
        })
        .catch((err) => console.log(err))
    }

    const fetchAssignedStudents = () => {
        if (!organizationSupervisorCred?.id) return
        axios.post('https://siwes-logbook-backend.onrender.com/student/fetch-detailed', {
            organization_supervisor_id: organizationSupervisorCred?.id
        })
        .then((res) => {
            setAssignedStudents(res?.data?.message || [])
        })
        .catch((err) => console.log(err))
    }

    const handleSignOff = (e) => {
        e.preventDefault()
        if (!selectedLog) return

        setSigningOff(true)
        axios.post('https://siwes-logbook-backend.onrender.com/org-supervisor/logbook/sign', {
            id: selectedLog.id,
            org_supervisor_id: organizationSupervisorCred?.id,
            org_supervisor_comment: comment,
            org_supervisor_rating: rating
        })
        .then(() => {
            showAlert('Logbook entry signed off successfully!')
            setSelectedLog(null)
            setComment('')
            setRating(0)
            fetchInternLogbooks()
        })
        .catch((err) => {
            showAlert(err?.response?.data?.message || 'Sign-off failed.')
        })
        .finally(() => setSigningOff(false))
    }

    const handleLeaveAction = async (leave_id, status) => {
        if (!(await showConfirm(`Are you sure you want to ${status} this leave request?`))) return;
        setUpdatingLeave(leave_id);
        try {
            await axios.post('https://siwes-logbook-backend.onrender.com/leave/update-status', {
                leave_id,
                status,
                org_supervisor_id: organizationSupervisorCred.id
            });
            showAlert(`Leave request ${status} successfully.`);
            fetchAllLeaves();
        } catch (error) {
            console.error(error);
            showAlert(error?.response?.data?.message || "Failed to update leave request");
        } finally {
            setUpdatingLeave(null);
        }
    }

    return (
        <div className="flex bg-[#FDFDFB] min-h-screen font-sans selection:bg-primary/20 text-slate-600">
            
            {/* Premium Sidebar */}
            {mobileMenuOpen && <div className="fixed inset-0 bg-slate-900/20 z-40 lg:hidden backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>}
        <aside className={`h-screen w-72 border-r border-slate-100 fixed left-0 top-0 bg-white flex flex-col py-8 z-50 shadow-[4px_0_24px_rgba(0,32,69,0.02)] transition-transform duration-300 lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <Logo size="md" className="px-8 mb-12" subtitle="Industry Supervisor" />
        <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden absolute top-8 right-6 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
          <X className="w-5 h-5" />
        </button>

                <nav className="flex-grow flex flex-col px-4 gap-2">
                    <button 
                        onClick={() => setActiveTab('logbooks')}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm transition-all text-left ${
                            activeTab === 'logbooks' ? 'bg-primary/5 text-primary font-bold shadow-sm' : 'text-slate-500 font-medium hover:bg-primary/5 hover:text-primary'
                        }`}
                    >
                        <Edit3 className="w-5 h-5" />
                        Logbook Review
                    </button>
                    <button 
                        onClick={() => setActiveTab('interns')}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm transition-all text-left flex justify-between ${
                            activeTab === 'interns' ? 'bg-primary/5 text-primary font-bold shadow-sm' : 'text-slate-500 font-medium hover:bg-primary/5 hover:text-primary'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <Users className="w-5 h-5" />
                            Assigned Interns
                        </div>
                        <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-lg text-xs font-bold">{assignedStudents.length}</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('leaves')}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm transition-all text-left flex justify-between ${
                            activeTab === 'leaves' ? 'bg-primary/5 text-primary font-bold shadow-sm' : 'text-slate-500 font-medium hover:bg-primary/5 hover:text-primary'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <CalendarOff className="w-5 h-5" />
                            Leave Requests
                        </div>
                        <span className="bg-amber-100 text-amber-600 px-2 py-0.5 rounded-lg text-xs font-bold">
                            {allLeaveRequests.filter(l => l.status === 'pending').length}
                        </span>
                    </button>
                </nav>

                <div className="mt-auto px-4">
                    <div className="bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-100">
                        <p className="text-xs font-bold text-slate-800 truncate">{organizationSupervisorCred?.Full_Name || 'Supervisor'}</p>
                        <p className="text-[10px] text-slate-500 truncate">{organizationSupervisorCred?.Email_Address}</p>
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
                        <h1 className="text-4xl font-serif text-slate-900 mb-2">Workplace Hub</h1>
                        <p className="text-slate-500 font-light text-lg">Review student daily activities, verify practical hours, and provide weekly sign-offs.</p>
                    </div>
                    <div className="flex gap-4 relative z-10 shrink-0 flex-wrap">
                        <div className="px-6 py-4 bg-amber-50 rounded-2xl border border-amber-100 shadow-sm flex items-center gap-4">
                            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                                <CalendarOff className="text-amber-600 w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600/80 mb-0.5">Pending Leaves</p>
                                <p className="text-2xl font-serif text-amber-900 leading-none">{allLeaveRequests.filter(l => l.status === 'pending').length}</p>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-emerald-50 rounded-2xl border border-emerald-100 shadow-sm flex items-center gap-4">
                            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                                <UserCheck className="text-emerald-600 w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600/80 mb-0.5">Active Interns</p>
                                <p className="text-2xl font-serif text-emerald-900 leading-none">{assignedStudents.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 1: Logbook Entries Table */}
                {activeTab === 'logbooks' && (
                <section className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-[0_20px_50px_rgba(0,32,69,0.03)]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h2 className="text-2xl font-serif text-slate-900 flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                    <FileSignature className="w-5 h-5 text-primary" />
                                </div>
                                Daily Logbook Submissions
                            </h2>
                            <p className="text-sm text-slate-500 mt-2 font-light">Click "Sign Off" on any entry to review, add feedback, and approve work.</p>
                        </div>
                        <span className="text-xs font-bold px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-full shadow-sm">{logbooks.length} Total Entries</span>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                    <th className="p-5">Date / Week</th>
                                    <th className="p-5">Student Name</th>
                                    <th className="p-5">Tasks / Work Done</th>
                                    <th className="p-5">Status</th>
                                    <th className="p-5 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {logbooks.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-10 text-center text-slate-400 font-light text-lg">No logbook submissions found for your assigned interns.</td>
                                    </tr>
                                ) : (
                                    logbooks.map((log) => (
                                        <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="p-5">
                                                <p className="font-bold text-slate-700 mb-1">{log.date ? new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</p>
                                                <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded-lg">Week {log.week_number}</span>
                                            </td>
                                            <td className="p-5">
                                                <span 
                                                    onClick={() => navigate(`/student-performance/${log.student_id}`)}
                                                    className="font-bold text-primary cursor-pointer hover:underline"
                                                >
                                                    {log.Student_Name || `Student #${log.student_id}`}
                                                </span>
                                            </td>
                                            <td className="p-5">
                                                <p className="max-w-[300px] truncate text-slate-600 font-light" title={log.activity_description}>
                                                    {log.activity_description}
                                                </p>
                                            </td>
                                            <td className="p-5">
                                                {log.org_supervisor_signed ? (
                                                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center gap-1 w-max">
                                                        <CheckCircle2 className="w-3 h-3" /> Signed Off
                                                    </span>
                                                ) : (
                                                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-amber-50 text-amber-600 border border-amber-100 flex items-center gap-1 w-max">
                                                        <Clock className="w-3 h-3" /> Pending
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-5 text-right">
                                                <button
                                                    onClick={() => {
                                                        setSelectedLog(log)
                                                        setComment(log.org_supervisor_comment || '')
                                                        setRating(log.org_supervisor_rating || 0)
                                                    }}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm text-xs font-bold uppercase tracking-widest rounded-xl transition-all"
                                                >
                                                    <Edit3 className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary transition-colors" />
                                                    {log.org_supervisor_signed ? 'Edit Sign' : 'Sign Off'}
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

                {/* Section 2: Assigned Interns */}
                {activeTab === 'interns' && (
                <section className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-[0_20px_50px_rgba(0,32,69,0.03)]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h2 className="text-2xl font-serif text-slate-900 flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                    <Users className="w-5 h-5 text-primary" />
                                </div>
                                Assigned Intern Directory
                            </h2>
                            <p className="text-sm text-slate-500 mt-2 font-light">View profiles, contact information, and academic institution details of your interns.</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                    <th className="p-5">Intern Profile</th>
                                    <th className="p-5">Matric No</th>
                                    <th className="p-5">Department</th>
                                    <th className="p-5 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {assignedStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="p-10 text-center text-slate-400 font-light text-lg">No assigned interns found.</td>
                                    </tr>
                                ) : (
                                    assignedStudents.map((intern) => (
                                        <tr key={intern.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="p-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center shadow-sm">
                                                        <img src={intern.Profile_Img || user} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <span 
                                                            onClick={() => navigate(`/student-performance/${intern.id}`)}
                                                            className="font-bold text-slate-900 text-base cursor-pointer hover:underline hover:text-primary transition-colors block"
                                                        >
                                                            {intern.Full_Name}
                                                        </span>
                                                        <span className="text-xs text-slate-500 font-light">{intern.email_address}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-5 font-bold text-slate-600">{intern.Matriculation_No}</td>
                                            <td className="p-5 text-slate-600">{intern.department}</td>
                                            <td className="p-5 text-right">
                                                <button 
                                                    onClick={() => navigate(`/student-performance/${intern.id}`)}
                                                    className="inline-flex items-center justify-center px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 text-xs font-bold uppercase tracking-widest rounded-xl transition-colors"
                                                >
                                                    View Profile
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

                {/* Section 3: Leave Requests */}
                {activeTab === 'leaves' && (
                <section className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-[0_20px_50px_rgba(0,32,69,0.03)]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h2 className="text-2xl font-serif text-slate-900 flex items-center gap-3">
                                <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
                                    <CalendarOff className="w-5 h-5 text-amber-600" />
                                </div>
                                Intern Leave Requests
                            </h2>
                            <p className="text-sm text-slate-500 mt-2 font-light">Manage and approve absence requests from all your assigned interns.</p>
                        </div>
                    </div>

                    <div className="grid gap-6">
                        {allLeaveRequests.length === 0 ? (
                            <div className="p-10 text-center text-slate-400 font-light text-lg border border-dashed border-slate-200 rounded-2xl bg-slate-50">
                                No leave requests found.
                            </div>
                        ) : (
                            allLeaveRequests.map((req) => (
                                <div key={req.id} className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 justify-between group">
                                    <div className="space-y-4 flex-1">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span 
                                                onClick={() => navigate(`/student-performance/${req.student_id}`)}
                                                className="font-serif text-lg text-slate-900 cursor-pointer hover:underline hover:text-primary transition-colors"
                                            >
                                                {req.student_name}
                                            </span>
                                            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded-lg">
                                                {req.matric_no}
                                            </span>
                                            <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1 ${
                                                req.status === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                                req.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                                                'bg-rose-50 text-rose-600 border border-rose-100'
                                            }`}>
                                                {req.status}
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center gap-3 text-sm font-medium text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 w-max">
                                            <CalendarOff className="w-4 h-4 text-slate-400" />
                                            {new Date(req.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} 
                                            <span className="text-slate-300">-</span>
                                            {new Date(req.end_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                        
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Reason for Leave</p>
                                            <p className="text-slate-600 font-light leading-relaxed">"{req.reason}"</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 shrink-0 pt-4 md:pt-0 md:pl-6 border-t md:border-t-0 md:border-l border-slate-100">
                                        {req.status === 'pending' ? (
                                            <>
                                                <button 
                                                    disabled={updatingLeave === req.id}
                                                    onClick={() => handleLeaveAction(req.id, 'rejected')}
                                                    className="px-6 py-3 bg-white text-rose-600 border border-rose-100 hover:bg-rose-50 text-xs font-bold uppercase tracking-widest rounded-xl transition-all disabled:opacity-50"
                                                >
                                                    {updatingLeave === req.id ? <Loader2 className="w-4 h-4 animate-spin inline mr-1" /> : null} Reject
                                                </button>
                                                <button 
                                                    disabled={updatingLeave === req.id}
                                                    onClick={() => handleLeaveAction(req.id, 'approved')}
                                                    className="px-6 py-3 bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100 hover:shadow-sm text-xs font-bold uppercase tracking-widest rounded-xl transition-all disabled:opacity-50"
                                                >
                                                    {updatingLeave === req.id ? <Loader2 className="w-4 h-4 animate-spin inline mr-1" /> : null} Approve
                                                </button>
                                            </>
                                        ) : (
                                            <span className="text-xs font-bold uppercase tracking-widest text-slate-300">Resolved</span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
                )}

                {/* Sign-off Modal */}
                {selectedLog && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-[2.5rem] max-w-lg w-full p-8 shadow-[0_20px_60px_rgba(0,32,69,0.15)] border border-slate-100">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                                <h3 className="font-serif text-2xl text-primary flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                        <FileSignature className="w-5 h-5 text-primary" />
                                    </div>
                                    Logbook Sign-off
                                </h3>
                                <button onClick={() => setSelectedLog(null)} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Date of Entry</p>
                                    <p className="font-bold text-slate-800">{selectedLog.date ? new Date(selectedLog.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : ''}</p>
                                </div>
                                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Work Description</p>
                                    <p className="text-sm font-light text-slate-600 leading-relaxed">{selectedLog.activity_description}</p>
                                </div>
                            </div>

                            <form onSubmit={handleSignOff} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Daily Performance Rating</label>
                                    <div className="flex gap-2 mb-2 bg-slate-50 w-max p-2 rounded-xl border border-slate-100">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button 
                                                type="button"
                                                key={star} 
                                                onClick={() => setRating(star)}
                                                className="focus:outline-none transition-transform hover:scale-110"
                                            >
                                                <Star className={`w-8 h-8 ${rating >= star ? 'fill-amber-400 text-amber-400 drop-shadow-sm' : 'fill-slate-100 text-slate-200'}`} />
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-400 font-light ml-1">Select 1 to 5 stars.</p>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Supervisor Remarks</label>
                                    <div className="relative">
                                        <MessageSquare className="absolute left-4 top-4 text-slate-400 w-5 h-5" />
                                        <textarea
                                            rows="4"
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder="Add constructive comments regarding intern's daily practical performance..."
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all resize-none"
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4 border-t border-slate-100">
                                    <button
                                        type="submit"
                                        disabled={signingOff}
                                        className="flex-1 h-14 bg-primary text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#001530] hover:shadow-[0_10px_20px_rgba(0,32,69,0.15)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                                    >
                                        {signingOff ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                        {signingOff ? 'Signing...' : 'Confirm Sign-off'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedLog(null)}
                                        className="px-6 h-14 bg-slate-100 text-slate-600 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-colors"
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
    )
}

export default OrgSupervisorDashboard
