import React, { useContext, useEffect, useState } from 'react'
import { context } from '../../src/App'
import Logo from '../../src/components/Logo'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { 
    Building2, ClipboardCheck, Users, IdCard, 
    LogOut, UserCheck, Check, X, Save, 
    UserPlus, Edit3, Trash2, ShieldCheck, ChevronRight 
} from 'lucide-react'
import { useDialog } from '../../src/context/DialogContext'

const OrganizationDashboard = () => {
    const navigate = useNavigate()
    const { showAlert, showConfirm } = useDialog()
    const { organizationCred } = useContext(context)
    const [placements, setPlacements] = useState([])
    const [supervisors, setSupervisors] = useState([])
    const [acceptedInterns, setAcceptedInterns] = useState([])
    const [activeTab, setActiveTab] = useState('placements')

    // Supervisor Form State
    const [supName, setSupName] = useState('')
    const [supEmail, setSupEmail] = useState('')
    const [supDept, setSupDept] = useState('Engineering')
    const [supAddress, setSupAddress] = useState('')
    const [supCapacity, setSupCapacity] = useState(5)
    const [supFocus, setSupFocus] = useState('')
    const [isEditingSup, setIsEditingSup] = useState(false)
    const [editingSupId, setEditingSupId] = useState(null)

    const fetchSingleStudentDetail = (studentId) => {
        navigate(`/student-performance/${studentId}`)
    }

    useEffect(() => {
        if (!organizationCred) {
            navigate('/register/accountType')
            return
        }
        fetchPlacements()
        fetchSupervisors()
        fetchAcceptedInterns()
    }, [organizationCred])

    const fetchPlacements = () => {
        if (!organizationCred?.id) return
        axios.post('https://siwes-logbook-backend.onrender.com/organization/placements/fetch', { organizationId: organizationCred?.id })
            .then((res) => {
                setPlacements(res?.data?.message || [])
            })
            .catch((err) => console.log(err))
    }

    const fetchAcceptedInterns = () => {
        if (!organizationCred?.id) return
        axios.post('https://siwes-logbook-backend.onrender.com/student/fetch-detailed', { organization_id: organizationCred?.id })
            .then((res) => {
                setAcceptedInterns(res?.data?.message || [])
            })
            .catch((err) => console.log(err))
    }

    const fetchSupervisors = () => {
        if (!organizationCred?.id) return
        axios.post('https://siwes-logbook-backend.onrender.com/organization/fetch/supervisor', { id: organizationCred?.id })
            .then((res) => {
                setSupervisors(res?.data?.message || [])
            })
            .catch((err) => console.log(err))
    }

    const handlePlacementStatus = (placementId, status) => {
        axios.post('https://siwes-logbook-backend.onrender.com/organization/placements/status', {
            placementId,
            status
        })
        .then(() => {
            showAlert(`Placement request ${status.toLowerCase()} successfully`)
            fetchPlacements()
            fetchAcceptedInterns()
        })
        .catch((err) => {
            showAlert(err?.response?.data?.message || 'Error updating placement status')
        })
    }

    const handleAssignSupervisor = (studentId, supervisorId) => {
        axios.post('https://siwes-logbook-backend.onrender.com/organization/assign-supervisor', {
            studentId,
            supervisorId
        })
        .then(() => {
            showAlert('Industry supervisor assigned successfully!')
            fetchAcceptedInterns()
        })
        .catch((err) => {
            showAlert(err?.response?.data?.message || 'Error assigning supervisor')
        })
    }

    const handleSubmitSupervisor = (e) => {
        e.preventDefault()
        if (!supName || !supEmail) return showAlert('Please enter supervisor name and email')

        if (isEditingSup) {
            axios.post('https://siwes-logbook-backend.onrender.com/organization-supervisor/update', {
                id: editingSupId,
                Full_Name: supName,
                Email_Address: supEmail,
                department: supDept,
                Contact_Adress: supAddress,
                capacity: supCapacity,
                focus_areas: supFocus
            })
            .then(() => {
                showAlert('Supervisor updated successfully')
                resetSupForm()
                fetchSupervisors()
            })
            .catch((err) => showAlert(err?.response?.data?.message || 'Error updating supervisor'))
        } else {
            axios.post('https://siwes-logbook-backend.onrender.com/organization/create/supervisor', {
                Organization_Id: organizationCred?.id,
                Organization_Mail: organizationCred?.Email_Address,
                department: supDept,
                Contact_Adress: supAddress,
                Full_Name: supName,
                Email_Address: supEmail,
                capacity: supCapacity,
                focus_areas: supFocus
            })
            .then(() => {
                showAlert('Supervisor pre-registered successfully! They can now activate their account.')
                resetSupForm()
                fetchSupervisors()
            })
            .catch((err) => showAlert(err?.response?.data?.message || 'Error creating supervisor'))
        }
    }

    const resetSupForm = () => {
        setSupName('')
        setSupEmail('')
        setSupDept('Engineering')
        setSupAddress('')
        setSupCapacity(5)
        setSupFocus('')
        setIsEditingSup(false)
        setEditingSupId(null)
    }

    const handleEditSup = (sup) => {
        setIsEditingSup(true)
        setEditingSupId(sup.id)
        setSupName(sup.Full_Name)
        setSupEmail(sup.Email_Address)
        setSupDept(sup.department || 'Engineering')
        setSupAddress(sup.Contact_Adress || '')
        setSupCapacity(sup.capacity || 5)
        setSupFocus(sup.focus_areas || '')
        setActiveTab('supervisors')
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleDeleteSup = async (id) => {
        const confirm = await showConfirm('Are you sure you want to delete this supervisor?')
        if (!confirm) return
        axios.post('https://siwes-logbook-backend.onrender.com/organization-supervisor/delete', { id })
            .then(() => {
                showAlert('Supervisor deleted')
                fetchSupervisors()
            })
            .catch((err) => showAlert(err?.response?.data?.message || 'Error deleting supervisor'))
    }

    return (
        <div className="flex bg-[#FDFDFB] min-h-screen font-sans selection:bg-primary/20 text-slate-600">
            {/* Premium Sidebar */}
            <aside className="h-screen w-72 border-r border-slate-100 fixed left-0 top-0 bg-white flex flex-col py-8 z-40 shadow-[4px_0_24px_rgba(0,32,69,0.02)] hidden lg:flex">
                <Logo size="md" className="px-8 mb-12" title={organizationCred?.Name || 'Organization'} subtitle="SIWES Portal" />

                <nav className="flex-grow flex flex-col px-4 gap-2 overflow-y-auto custom-scrollbar">
                    <button 
                        onClick={() => setActiveTab('placements')}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm transition-all font-medium text-left ${
                            activeTab === 'placements' ? 'bg-primary/5 text-primary font-bold shadow-sm' : 'text-slate-500 hover:bg-primary/5 hover:text-primary'
                        }`}
                    >
                        <ClipboardCheck className="w-5 h-5" />
                        Placement Requests
                    </button>
                    <button 
                        onClick={() => setActiveTab('accepted-interns')}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm transition-all font-medium text-left ${
                            activeTab === 'accepted-interns' ? 'bg-primary/5 text-primary font-bold shadow-sm' : 'text-slate-500 hover:bg-primary/5 hover:text-primary'
                        }`}
                    >
                        <Users className="w-5 h-5" />
                        Accepted Interns
                    </button>
                    <button 
                        onClick={() => setActiveTab('supervisors')}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm transition-all font-medium text-left ${
                            activeTab === 'supervisors' ? 'bg-primary/5 text-primary font-bold shadow-sm' : 'text-slate-500 hover:bg-primary/5 hover:text-primary'
                        }`}
                    >
                        <IdCard className="w-5 h-5" />
                        Industry Supervisors
                    </button>
                </nav>

                <div className="mt-auto px-4 space-y-4">
                    <div className="pt-4 border-t border-slate-100">
                        <button onClick={() => navigate("/")} className="w-full flex items-center justify-center gap-2 px-4 py-3 text-rose-500 bg-rose-50 hover:bg-rose-100 transition-colors rounded-xl font-bold text-xs uppercase tracking-widest">
                            <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="lg:ml-72 flex-1 p-6 lg:p-12 xl:p-16 pt-4 lg:pt-8 xl:pt-8 space-y-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 pb-6">
                    <div>
                        <nav className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">
                            <span className="hover:text-primary transition-colors cursor-pointer" onClick={() => setActiveTab('placements')}>Portal</span>
                            <ChevronRight className="w-3 h-3" />
                            <span className="text-primary">
                                {activeTab === 'placements' ? 'Placements' : activeTab === 'accepted-interns' ? 'Interns' : 'Supervisors'}
                            </span>
                        </nav>
                        <h1 className="text-3xl md:text-4xl font-serif text-slate-900">Welcome, {organizationCred?.Name}</h1>
                        <p className="text-slate-500 font-light mt-2">Manage SIWES student placements, approvals, and assigned workplace supervisors.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="px-5 py-2.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-sm">
                            <ShieldCheck className="w-4 h-4" />
                            Verified Organization
                        </span>
                    </div>
                </div>

                {/* Section 1: Placement Applications */}
                {activeTab === 'placements' && (
                    <section className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,32,69,0.03)] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between p-8 border-b border-slate-100 bg-slate-50">
                            <div>
                                <h2 className="text-xl font-serif text-slate-900 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                        <UserCheck className="w-5 h-5 text-primary" />
                                    </div>
                                    Student Placement Applications
                                </h2>
                                <p className="text-sm text-slate-500 font-light mt-2 ml-14">Review and approve SIWES internship applications from students.</p>
                            </div>
                            <span className="text-[10px] uppercase tracking-widest font-bold px-4 py-2 bg-blue-50 text-blue-600 rounded-full shadow-sm">{placements.length} Requests</span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                        <th className="px-6 py-5 pl-8">Student Name</th>
                                        <th className="px-6 py-5">Matric No</th>
                                        <th className="px-6 py-5">Department</th>
                                        <th className="px-6 py-5">Duration</th>
                                        <th className="px-6 py-5">Status</th>
                                        <th className="px-6 py-5 pr-8 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {placements.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="p-10 text-center text-slate-400 font-light text-lg">No placement applications found yet.</td>
                                        </tr>
                                    ) : (
                                        placements.map((p) => (
                                            <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-6 py-5 pl-8">
                                                    <span 
                                                        onClick={() => fetchSingleStudentDetail(p.student_id)}
                                                        className="font-bold text-slate-800 text-base cursor-pointer group-hover:text-primary transition-colors"
                                                    >
                                                        {p.Student_Name || p.Full_Name || `Student #${p.student_id}`}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className="font-medium text-slate-600">{p.Matriculation_No || 'N/A'}</span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold border border-slate-200 uppercase tracking-widest">{p.department || 'General'}</span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className="font-light text-slate-500">
                                                        {p.Start_Date ? new Date(p.Start_Date).toLocaleDateString() : 'N/A'} - {p.End_Date ? new Date(p.End_Date).toLocaleDateString() : 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                                                        p.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                                        p.status === 'rejected' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                                                        'bg-amber-50 text-amber-600 border border-amber-100'
                                                    }`}>
                                                        {p.status ? p.status : 'Pending'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 pr-8 text-right">
                                                    {(!p.status || p.status.toLowerCase() === 'pending') && (
                                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => handlePlacementStatus(p.id, 'Approved')}
                                                                className="px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs font-bold rounded-xl hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-1.5"
                                                            >
                                                                <Check className="w-4 h-4" /> Approve
                                                            </button>
                                                            <button
                                                                onClick={() => handlePlacementStatus(p.id, 'Rejected')}
                                                                className="px-4 py-2 bg-rose-50 text-rose-600 border border-rose-100 text-xs font-bold rounded-xl hover:bg-rose-600 hover:text-white transition-all flex items-center gap-1.5"
                                                            >
                                                                <X className="w-4 h-4" /> Reject
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {/* Section 2: Accepted Interns Directory & Assignment */}
                {activeTab === 'accepted-interns' && (
                    <section className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,32,69,0.03)] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between p-8 border-b border-slate-100 bg-slate-50">
                            <div>
                                <h2 className="text-xl font-serif text-slate-900 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                        <Users className="w-5 h-5 text-primary" />
                                    </div>
                                    Accepted Interns Directory
                                </h2>
                                <p className="text-sm text-slate-500 font-light mt-2 ml-14">View your approved students and assign corporate supervisors to them.</p>
                            </div>
                            <span className="text-[10px] uppercase tracking-widest font-bold px-4 py-2 bg-blue-50 text-blue-600 rounded-full shadow-sm">{acceptedInterns.length} Accepted</span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                        <th className="px-6 py-5 pl-8">Student Name</th>
                                        <th className="px-6 py-5">Matric No</th>
                                        <th className="px-6 py-5">Department</th>
                                        <th className="px-6 py-5">Duration</th>
                                        <th className="px-6 py-5">Industry Supervisor</th>
                                        <th className="px-6 py-5 pr-8 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {acceptedInterns.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="p-10 text-center text-slate-400 font-light text-lg">No accepted students found for your organization yet.</td>
                                        </tr>
                                    ) : (
                                        acceptedInterns.map((student) => {
                                            return (
                                                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                                                    <td className="px-6 py-5 pl-8">
                                                        <span 
                                                            onClick={() => fetchSingleStudentDetail(student.id)}
                                                            className="font-bold text-slate-800 text-base cursor-pointer group-hover:text-primary transition-colors"
                                                        >
                                                            {student.student_name || student.Full_Name}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className="font-medium text-slate-600">{student.student_matric || student.Matriculation_No}</span>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold border border-slate-200 uppercase tracking-widest">{student.student_department || student.department || 'General'}</span>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className="font-light text-slate-500">
                                                            {student.student_start_date ? new Date(student.student_start_date).toLocaleDateString() : 'N/A'} - {student.student_end_date ? new Date(student.student_end_date).toLocaleDateString() : 'N/A'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="relative">
                                                            <select
                                                                defaultValue={student.Organization_Supervisor_Id || ""}
                                                                id={`supervisor-select-${student.id}`}
                                                                className="w-full h-10 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all appearance-none cursor-pointer"
                                                            >
                                                                <option value="" disabled>-- Assign Supervisor --</option>
                                                                {supervisors.map(sup => (
                                                                    <option key={sup.id} value={sup.id}>{sup.Full_Name} ({sup.department})</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 pr-8 text-right">
                                                        <button
                                                            onClick={() => {
                                                                const selectEl = document.getElementById(`supervisor-select-${student.id}`);
                                                                handleAssignSupervisor(student.id, selectEl?.value);
                                                            }}
                                                            className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-[#001530] hover:shadow-[0_10px_20px_rgba(0,32,69,0.15)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-1.5 inline-flex"
                                                        >
                                                            <Save className="w-3.5 h-3.5" /> Assign
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {/* Section 3: Industry Supervisor Management */}
                {activeTab === 'supervisors' && (
                    <section className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Add/Edit Form */}
                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,32,69,0.03)] overflow-hidden">
                            <div className="p-8 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-serif text-slate-900 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                            <UserPlus className="w-5 h-5 text-primary" />
                                        </div>
                                        {isEditingSup ? 'Edit Organization Supervisor' : 'Pre-register Industry Supervisor'}
                                    </h2>
                                    <p className="text-sm text-slate-500 font-light mt-2 ml-14">
                                        {isEditingSup ? 'Update supervisor details and assignments.' : 'Add a new supervisor and invite them to the platform.'}
                                    </p>
                                </div>
                            </div>
                            <div className="p-8 lg:p-10">
                                <form onSubmit={handleSubmitSupervisor} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={supName}
                                            onChange={(e) => setSupName(e.target.value)}
                                            placeholder="e.g. Engr. Alex Morgan"
                                            className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-800"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address *</label>
                                        <input
                                            type="email"
                                            required
                                            value={supEmail}
                                            onChange={(e) => setSupEmail(e.target.value)}
                                            placeholder="alex.morgan@company.com"
                                            className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-800"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Department</label>
                                        <input
                                            type="text"
                                            value={supDept}
                                            onChange={(e) => setSupDept(e.target.value)}
                                            placeholder="Software Engineering"
                                            className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-800"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Contact Address</label>
                                        <input
                                            type="text"
                                            value={supAddress}
                                            onChange={(e) => setSupAddress(e.target.value)}
                                            placeholder="Building B, Floor 3"
                                            className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-800"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Max Intern Capacity</label>
                                        <input
                                            type="number"
                                            value={supCapacity}
                                            onChange={(e) => setSupCapacity(e.target.value)}
                                            className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-800"
                                        />
                                    </div>
                                    <div className="flex items-end gap-4">
                                        {isEditingSup && (
                                            <button type="button" onClick={resetSupForm} className="h-12 px-6 bg-slate-100 text-slate-600 font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors">
                                                Cancel
                                            </button>
                                        )}
                                        <button type="submit" className="flex-1 h-12 bg-primary text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-[#001530] hover:shadow-[0_10px_20px_rgba(0,32,69,0.15)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                                            {isEditingSup ? <Save className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                                            {isEditingSup ? 'Save Changes' : 'Register Supervisor'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Supervisors Directory */}
                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,32,69,0.03)] p-8 lg:p-10">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                                <div>
                                    <h3 className="text-2xl font-serif text-slate-900">Industry Supervisors</h3>
                                    <p className="text-slate-500 font-light mt-1">Directory of registered organizational supervisors.</p>
                                </div>
                                <span className="text-[10px] uppercase tracking-widest font-bold px-4 py-2 bg-blue-50 text-blue-600 rounded-full shadow-sm">{supervisors.length} Registered</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {supervisors.map((s) => (
                                    <div key={s.id} className="p-8 bg-slate-50 border border-slate-100 rounded-[2rem] flex flex-col justify-between hover:shadow-md hover:-translate-y-1 transition-all group relative overflow-hidden">
                                        <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEditSup(s)} className="w-8 h-8 flex items-center justify-center text-blue-600 bg-white border border-slate-200 hover:border-primary hover:text-primary rounded-lg shadow-sm transition-colors" title="Edit">
                                                <Edit3 className="w-3.5 h-3.5" />
                                            </button>
                                            <button onClick={() => handleDeleteSup(s.id)} className="w-8 h-8 flex items-center justify-center text-rose-600 bg-white border border-slate-200 hover:border-rose-200 hover:bg-rose-50 rounded-lg shadow-sm transition-colors" title="Delete">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        <div className="mb-6">
                                            <h4 className="font-serif font-bold text-slate-900 text-xl leading-tight group-hover:text-primary transition-colors">{s.Full_Name}</h4>
                                            <p className="text-sm text-slate-500 font-light mt-1 mb-4">{s.Email_Address}</p>
                                            
                                            <div className="flex flex-wrap gap-2 mt-4">
                                                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-slate-200">{s.department}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                                            <span className="text-xs text-slate-500 font-light">Capacity</span>
                                            <span className="font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg text-sm">{s.capacity || 5} Interns</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {supervisors.length === 0 && (
                                <div className="p-10 text-center text-slate-400 font-light text-lg border border-dashed border-slate-200 rounded-[2rem] bg-slate-50">
                                    No industry supervisors registered yet.
                                </div>
                            )}
                        </div>
                    </section>
                )}
            </main>
        </div>
    )
}

export default OrganizationDashboard
