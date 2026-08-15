import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { context } from '../../src/App'
import axios from 'axios'
import user from '../../public/profile.png'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis } from 'recharts'
import { 
    ArrowLeft, Sparkles, Phone, MapPin, Landmark, FileText, 
    ExternalLink, TrendingUp, History, CalendarOff, CheckCircle2, 
    XCircle, ClipboardCheck, MessageSquare, Clock, Image as ImageIcon,
    Building2, Mail, Users
} from 'lucide-react'
import { useDialog } from '../../src/context/DialogContext'

const StudentPerformanceView = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { showAlert, showConfirm } = useDialog()
    const { organizationSupervisorCred, schoolSupervisorCred, schoolCred, studentCred, organizationCred } = useContext(context)
    const [student, setStudent] = useState(null)
    const [logbooks, setLogbooks] = useState([])
    const [evaluation, setEvaluation] = useState(null)
    const [leaveRequests, setLeaveRequests] = useState([])
    const [loading, setLoading] = useState(true)

    // Form state for evaluation
    const [evalForm, setEvalForm] = useState({
        attendance_score: '', attitude_score: '', work_quality_score: '',
        independence_score: '', professionalism_score: '', communication_score: '', leadership_score: '',
        final_remarks: ''
    })

    const isOrgSupervisor = !!organizationSupervisorCred;
    const isOrganization = !!organizationCred;
    const isSchoolSupervisor = !!schoolSupervisorCred;
    const isSchoolAdmin = !!schoolCred;
    const isStudent = !!studentCred;

    useEffect(() => {
        if (!isOrgSupervisor && !isSchoolSupervisor && !isSchoolAdmin && !isStudent && !isOrganization) {
            navigate('/register/accountType')
            return
        }
        fetchData()
    }, [id])

    const fetchData = async () => {
        try {
            const studentRes = await axios.post('https://siwes-logbook-backend.onrender.com/student/fetch-detailed', { student_id: id })
            setStudent(studentRes.data.message[0])

            const logsRes = await axios.post('https://siwes-logbook-backend.onrender.com/user/student/logbook/fetch', { student_id: id })
            setLogbooks(logsRes.data.message || [])

            const evalRes = await axios.post('https://siwes-logbook-backend.onrender.com/student/evaluation/fetch', { student_id: id })
            setEvaluation(evalRes.data.message || null)

            const leaveRes = await axios.post('https://siwes-logbook-backend.onrender.com/leave/fetch/student', { student_id: id })
            setLeaveRequests(leaveRes.data.message || [])

            setLoading(false)
        } catch (error) {
            console.error(error)
            setLoading(false)
        }
    }

    const calculateAutoGrade = () => {
        if (!logbooks || logbooks.length === 0) return 0
        const ratedLogs = logbooks.filter(l => l.org_supervisor_rating > 0)
        if (ratedLogs.length === 0) return 0
        const total = ratedLogs.reduce((acc, curr) => acc + curr.org_supervisor_rating, 0)
        const avg = total / ratedLogs.length
        return Math.round((avg / 5) * 100)
    }

    const handleEvaluationSubmit = async (e) => {
        e.preventDefault()
        if (Object.values(evalForm).some(v => v === '')) {
            showAlert("Please fill in all evaluation fields.")
            return
        }

        const gradeValue = { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'F': 1 }
        const total_score = 
            gradeValue[evalForm.attendance_score] + gradeValue[evalForm.attitude_score] +
            gradeValue[evalForm.work_quality_score] + gradeValue[evalForm.independence_score] +
            gradeValue[evalForm.professionalism_score] + gradeValue[evalForm.communication_score] +
            gradeValue[evalForm.leadership_score];

        try {
            await axios.post('https://siwes-logbook-backend.onrender.com/org-supervisor/evaluate', {
                student_id: id,
                org_supervisor_id: organizationSupervisorCred.id,
                ...evalForm,
                total_score
            })
            showAlert("Evaluation submitted successfully!")
            fetchData()
        } catch (error) {
            console.error(error)
            showAlert("Failed to submit evaluation")
        }
    }

    const handleLeaveAction = async (leave_id, status) => {
        const confirmResult = await showConfirm(`Are you sure you want to ${status} this leave request?`);
        if (!confirmResult) return;
        try {
            await axios.post('https://siwes-logbook-backend.onrender.com/leave/update-status', {
                leave_id,
                status,
                org_supervisor_id: organizationSupervisorCred.id
            });
            showAlert(`Leave request ${status} successfully.`);
            fetchData();
        } catch (error) {
            console.error(error);
            showAlert(error?.response?.data?.message || "Failed to update leave request");
        }
    };

    const chartData = logbooks.filter(l => l.org_supervisor_signed).map(l => ({
        name: `Wk ${l.week_number}`,
        rating: l.org_supervisor_rating || 0
    }))

    const radarData = evaluation ? [
        { subject: 'Attendance', A: { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'F': 1 }[evaluation.attendance_score] || 0, fullMark: 5 },
        { subject: 'Attitude', A: { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'F': 1 }[evaluation.attitude_score] || 0, fullMark: 5 },
        { subject: 'Quality', A: { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'F': 1 }[evaluation.work_quality_score] || 0, fullMark: 5 },
        { subject: 'Independence', A: { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'F': 1 }[evaluation.independence_score] || 0, fullMark: 5 },
        { subject: 'Professionalism', A: { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'F': 1 }[evaluation.professionalism_score] || 0, fullMark: 5 },
        { subject: 'Communication', A: { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'F': 1 }[evaluation.communication_score] || 0, fullMark: 5 },
        { subject: 'Leadership', A: { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'F': 1 }[evaluation.leadership_score] || 0, fullMark: 5 },
    ] : [];

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#FDFDFB]">
            <div className="w-16 h-16 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
        </div>
    )

    return (
        <div className="min-h-screen bg-[#FDFDFB] p-6 md:p-12 font-sans text-slate-600">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header Section */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 hover:border-slate-300 rounded-full text-slate-600 hover:text-slate-900 transition-all font-bold text-xs uppercase tracking-widest shadow-sm">
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>
                    {(isSchoolSupervisor || isSchoolAdmin) && (
                        <div className="px-6 py-3 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center gap-4 shadow-[0_5px_15px_rgba(99,102,241,0.1)]">
                            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-indigo-500" />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest font-bold text-indigo-400 mb-0.5">System Autograde</p>
                                <p className="text-2xl font-serif text-indigo-900 leading-none">{calculateAutoGrade()}%</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile Overview */}
                <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 border border-slate-100 shadow-[0_20px_50px_rgba(0,32,69,0.03)] flex flex-col md:flex-row gap-10 items-start relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    
                    <div className="w-40 h-40 rounded-3xl bg-slate-100 border-8 border-white shadow-xl overflow-hidden shrink-0 z-10 relative group">
                        <img src={student?.Profile_Img || user} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    </div>
                    
                    <div className="z-10 flex-1">
                        <div className="flex flex-wrap items-center gap-4 mb-3">
                            <h1 className="text-4xl font-serif text-slate-900">{student?.Full_Name}</h1>
                            <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-emerald-100 flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Active
                            </span>
                        </div>
                        <p className="text-slate-500 font-light flex items-center gap-4 mb-8">
                            <span className="flex items-center gap-2"><Mail className="w-4 h-4 text-slate-400" /> {student?.email_address}</span>
                            <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-400" /> {student?.Contact_Adress || 'No Address'}</span>
                        </p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-slate-50 border border-slate-100 rounded-2xl">
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Matric No</p>
                                <p className="font-bold text-slate-800">{student?.Matriculation_No}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Department</p>
                                <p className="font-bold text-slate-800">{student?.department || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Institution</p>
                                <p className="font-bold text-slate-800">{student?.institution_name}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">CGPA</p>
                                <p className="font-bold text-slate-800">{student?.cgpa || 'N/A'}</p>
                            </div>
                        </div>
                        
                        {/* Attachment Details */}
                        <div className="mt-8 pt-8 border-t border-slate-100">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Attachment Personnel & Institutions</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                                <div className="p-5 bg-white border border-slate-200 rounded-2xl hover:border-primary/30 transition-colors group">
                                    <p className="text-[10px] text-primary/70 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <Building2 className="w-3.5 h-3.5" /> Institution
                                    </p>
                                    <p className="text-sm font-bold text-slate-800 mb-2">{student?.institution_name || 'Not Assigned'}</p>
                                    <div className="space-y-1.5 text-xs text-slate-500">
                                        <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-400" /> <span className="truncate">{student?.institution_mail || 'N/A'}</span></p>
                                        <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-400" /> {student?.institution_contact || 'No Phone'}</p>
                                    </div>
                                </div>
                                <div className="p-5 bg-white border border-slate-200 rounded-2xl hover:border-primary/30 transition-colors group">
                                    <p className="text-[10px] text-primary/70 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <Users className="w-3.5 h-3.5" /> Academic Mentor
                                    </p>
                                    <p className="text-sm font-bold text-slate-800 mb-2">{student?.school_supervisor_name || 'Not Assigned'}</p>
                                    <div className="space-y-1.5 text-xs text-slate-500">
                                        <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-400" /> <span className="truncate">{student?.school_supervisor_email || 'N/A'}</span></p>
                                        <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-400" /> {student?.school_supervisor_contact || 'No Phone'}</p>
                                    </div>
                                </div>
                                <div className="p-5 bg-white border border-slate-200 rounded-2xl hover:border-primary/30 transition-colors group">
                                    <p className="text-[10px] text-primary/70 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <Building2 className="w-3.5 h-3.5" /> Organization
                                    </p>
                                    <p className="text-sm font-bold text-slate-800 mb-2">{student?.organization_name || 'Not Assigned'}</p>
                                    <div className="space-y-1.5 text-xs text-slate-500">
                                        <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-400" /> <span className="truncate">{student?.organization_email || 'N/A'}</span></p>
                                        <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-400" /> {student?.organization_contact || 'No Phone'}</p>
                                    </div>
                                </div>
                                <div className="p-5 bg-white border border-slate-200 rounded-2xl hover:border-primary/30 transition-colors group">
                                    <p className="text-[10px] text-primary/70 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <Users className="w-3.5 h-3.5" /> Industry Mentor
                                    </p>
                                    <p className="text-sm font-bold text-slate-800 mb-2">{student?.org_supervisor_name || 'Not Assigned'}</p>
                                    <div className="space-y-1.5 text-xs text-slate-500">
                                        <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-400" /> <span className="truncate">{student?.org_supervisor_email || 'N/A'}</span></p>
                                        <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-400" /> {student?.org_supervisor_contact || 'No Phone'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Administrative Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-[0_20px_50px_rgba(0,32,69,0.03)]">
                        <h3 className="text-xl font-serif text-slate-900 mb-6 flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
                                <Landmark className="text-amber-500 w-5 h-5" />
                            </div>
                            Stipend Account Details
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Bank Name</span>
                                <span className="font-bold text-slate-800">{student?.bank_name || 'Not Provided'}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Account Number</span>
                                <span className="font-bold text-slate-800">{student?.account_number || 'Not Provided'}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Account Name</span>
                                <span className="font-bold text-slate-800">{student?.account_name || 'Not Provided'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-[0_20px_50px_rgba(0,32,69,0.03)]">
                        <h3 className="text-xl font-serif text-slate-900 mb-6 flex items-center gap-3">
                            <div className="w-10 h-10 bg-sky-500/10 rounded-xl flex items-center justify-center">
                                <FileText className="text-sky-500 w-5 h-5" />
                            </div>
                            Official Documents
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                                <span className="text-sm font-bold text-slate-700">Company Acceptance Letter</span>
                                {student?.acceptance_letter_url ? (
                                    <a href={student.acceptance_letter_url} target="_blank" rel="noreferrer" className="px-4 py-2 bg-white border border-slate-200 hover:border-primary hover:text-primary rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors">
                                        View <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                ) : <span className="text-xs text-slate-400 italic">Not Uploaded</span>}
                            </div>
                            <div className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                                <span className="text-sm font-bold text-slate-700">ITF Form 8 (End of Program)</span>
                                {student?.itf_form8_url ? (
                                    <a href={student.itf_form8_url} target="_blank" rel="noreferrer" className="px-4 py-2 bg-white border border-slate-200 hover:border-primary hover:text-primary rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors">
                                        View <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                ) : <span className="text-xs text-slate-400 italic">Not Uploaded</span>}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Metrics & Logs Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Performance Chart */}
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-[0_20px_50px_rgba(0,32,69,0.03)]">
                            <h3 className="text-xl font-serif text-slate-900 mb-8 flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                    <TrendingUp className="text-primary w-5 h-5" />
                                </div>
                                Daily Rating Trend
                            </h3>
                            <div className="h-72 w-full">
                                {chartData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase'}} dy={10} />
                                            <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 'bold'}} dx={-10} />
                                            <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 10px 25px rgba(0,32,69,0.1)', padding: '12px' }} />
                                            <Line type="monotone" dataKey="rating" stroke="var(--primary)" strokeWidth={4} dot={{r: 4, strokeWidth: 2, fill: 'white'}} activeDot={{r: 6, fill: 'var(--primary)', stroke: 'white', strokeWidth: 2}} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-slate-400 font-light border border-dashed border-slate-200 rounded-2xl bg-slate-50">
                                        Not enough rated logbooks to generate trend.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Logbook Timeline */}
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-[0_20px_50px_rgba(0,32,69,0.03)]">
                            <h3 className="text-xl font-serif text-slate-900 mb-8 flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                                    <History className="text-slate-500 w-5 h-5" />
                                </div>
                                Recent Logbook Entries
                            </h3>
                            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                {logbooks.length === 0 ? (
                                    <div className="p-10 text-center text-slate-400 font-light border border-dashed border-slate-200 rounded-2xl bg-slate-50">
                                        No logbook entries available.
                                    </div>
                                ) : (
                                    logbooks.map(log => (
                                        <div key={log.id} className="p-6 border border-slate-100 rounded-3xl bg-slate-50 hover:bg-white hover:border-primary/20 hover:shadow-lg transition-all group">
                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-bold text-slate-800 text-sm">
                                                        {log.date ? new Date(log.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' }) : ''}
                                                    </span>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                                    <span className="px-2.5 py-1 bg-white border border-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded-lg">
                                                        Week {log.week_number}
                                                    </span>
                                                </div>
                                                <div className="flex gap-1">
                                                    {[1,2,3,4,5].map(star => (
                                                        <Star key={star} className={`w-4 h-4 ${log.org_supervisor_rating >= star ? 'fill-amber-400 text-amber-400' : 'fill-slate-100 text-slate-200'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                            
                                            <p className="text-slate-600 font-light leading-relaxed mb-4">{log.activity_description}</p>
                                            
                                            {log.image_attachment && (
                                                <a href={log.image_attachment} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/5 px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-colors w-max">
                                                    <ImageIcon className="w-3.5 h-3.5" /> View Attachment
                                                </a>
                                            )}
                                            
                                            {log.org_supervisor_comment && (
                                                <div className="mt-6 p-4 bg-white rounded-2xl border border-slate-100 flex gap-3">
                                                    <MessageSquare className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Mentor Feedback</p>
                                                        <p className="text-sm text-slate-700 italic leading-relaxed">"{log.org_supervisor_comment}"</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Leave Requests Section */}
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-[0_20px_50px_rgba(0,32,69,0.03)]">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-serif text-slate-900 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
                                        <CalendarOff className="text-amber-600 w-5 h-5" />
                                    </div>
                                    Leave Requests
                                </h3>
                            </div>
                            
                            {leaveRequests.length === 0 ? (
                                <div className="p-10 text-center text-slate-400 font-light border border-dashed border-slate-200 rounded-2xl bg-slate-50">
                                    No leave requests submitted.
                                </div>
                            ) : (
                                <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {leaveRequests.map(req => (
                                        <div key={req.id} className="p-6 border border-slate-100 rounded-3xl bg-slate-50 flex flex-col md:flex-row justify-between gap-6">
                                            <div className="flex-1 space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${
                                                        req.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                        req.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                                    }`}>{req.status}</span>
                                                    <span className="text-xs font-bold text-slate-500 flex items-center gap-2">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {new Date(req.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} 
                                                        <span className="text-slate-300 mx-1">-</span>
                                                        {new Date(req.end_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-700 font-light">"{req.reason}"</p>
                                            </div>
                                            
                                            {isOrgSupervisor && req.status === 'pending' && (
                                                <div className="flex items-center gap-3 shrink-0 pt-4 md:pt-0 md:pl-6 border-t md:border-t-0 md:border-l border-slate-200">
                                                    <button 
                                                        onClick={() => handleLeaveAction(req.id, 'rejected')}
                                                        className="flex-1 md:flex-none px-4 py-2 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl flex items-center justify-center gap-2 transition-colors font-bold text-[10px] uppercase tracking-widest"
                                                    >
                                                        <XCircle className="w-4 h-4" /> Reject
                                                    </button>
                                                    <button 
                                                        onClick={() => handleLeaveAction(req.id, 'approved')}
                                                        className="flex-1 md:flex-none px-4 py-2 bg-emerald-50 border border-emerald-100 text-emerald-600 hover:bg-emerald-100 rounded-xl flex items-center justify-center gap-2 transition-colors font-bold text-[10px] uppercase tracking-widest"
                                                    >
                                                        <CheckCircle2 className="w-4 h-4" /> Approve
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Evaluation Column */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-[0_20px_50px_rgba(0,32,69,0.03)] sticky top-8">
                            <h3 className="text-xl font-serif text-slate-900 mb-2 flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                                    <ClipboardCheck className="text-indigo-500 w-5 h-5" />
                                </div>
                                Final Evaluation
                            </h3>
                            <p className="text-xs text-slate-500 font-light mb-8">Comprehensive performance metrics based on ITF Assessment standards.</p>

                            {evaluation ? (
                                <div className="space-y-8">
                                    <div className="h-64 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                                <PolarGrid stroke="#f1f5f9" />
                                                <PolarAngleAxis dataKey="subject" tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 'bold'}} />
                                                <Radar name="Student" dataKey="A" stroke="#6366f1" strokeWidth={2} fill="#6366f1" fillOpacity={0.15} />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="space-y-4">
                                        {[
                                            { label: 'Attendance', val: evaluation.attendance_score },
                                            { label: 'Attitude', val: evaluation.attitude_score },
                                            { label: 'Quality', val: evaluation.work_quality_score },
                                            { label: 'Independence', val: evaluation.independence_score },
                                            { label: 'Professionalism', val: evaluation.professionalism_score },
                                            { label: 'Communication', val: evaluation.communication_score },
                                            { label: 'Leadership', val: evaluation.leadership_score }
                                        ].map(item => (
                                            <div key={item.label} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                                                <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">{item.label}</span>
                                                <span className={`px-3 py-1 rounded-lg font-black text-xs ${
                                                    item.val === 'A' ? 'bg-emerald-100 text-emerald-700' :
                                                    item.val === 'B' ? 'bg-blue-100 text-blue-700' :
                                                    item.val === 'C' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-rose-100 text-rose-700'
                                                }`}>{item.val}</span>
                                            </div>
                                        ))}
                                    </div>
                                    {evaluation.final_remarks && (
                                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                <MessageSquare className="w-3.5 h-3.5" /> Remarks
                                            </p>
                                            <p className="text-sm text-slate-700 font-light italic leading-relaxed">"{evaluation.final_remarks}"</p>
                                        </div>
                                    )}
                                </div>
                            ) : isOrgSupervisor ? (
                                <form onSubmit={handleEvaluationSubmit} className="space-y-5">
                                    {[
                                        { key: 'attendance_score', label: 'Attendance & Punctuality' },
                                        { key: 'attitude_score', label: 'Attitude to Work' },
                                        { key: 'work_quality_score', label: 'Work Quality & Competence' },
                                        { key: 'independence_score', label: 'Independence & Problem Solving' },
                                        { key: 'professionalism_score', label: 'Professionalism & Conduct' },
                                        { key: 'communication_score', label: 'Communication Skills' },
                                        { key: 'leadership_score', label: 'Leadership & Initiative' }
                                    ].map(field => (
                                        <div key={field.key}>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{field.label}</label>
                                            <select 
                                                className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all appearance-none cursor-pointer"
                                                value={evalForm[field.key]}
                                                onChange={e => setEvalForm({...evalForm, [field.key]: e.target.value})}
                                                required
                                            >
                                                <option value="" disabled>Select Grade...</option>
                                                <option value="A">Excellent (A)</option>
                                                <option value="B">Very Good (B)</option>
                                                <option value="C">Good (C)</option>
                                                <option value="D">Fair (D)</option>
                                                <option value="F">Poor (F)</option>
                                            </select>
                                        </div>
                                    ))}
                                    <div className="pt-2">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Overall Remarks (Optional)</label>
                                        <textarea 
                                            rows="4" 
                                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all resize-none"
                                            value={evalForm.final_remarks}
                                            onChange={e => setEvalForm({...evalForm, final_remarks: e.target.value})}
                                            placeholder="Final comments on student's performance..."
                                        />
                                    </div>
                                    <button type="submit" className="w-full h-14 bg-primary text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#001530] hover:shadow-[0_10px_20px_rgba(0,32,69,0.15)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 mt-4">
                                        <ClipboardCheck className="w-4 h-4" />
                                        Submit Evaluation
                                    </button>
                                </form>
                            ) : (
                                <div className="p-10 text-center text-slate-400 font-light border border-dashed border-slate-200 rounded-2xl bg-slate-50">
                                    <ClipboardCheck className="w-8 h-8 text-slate-300 mx-auto mb-4" />
                                    Industry Supervisor has not submitted the final evaluation yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StudentPerformanceView
