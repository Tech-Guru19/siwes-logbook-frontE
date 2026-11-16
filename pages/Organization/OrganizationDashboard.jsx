import React, { useContext, useEffect, useState } from 'react'
import { context } from '../../src/App'
import Logo from '../../src/components/Logo'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Building2, ClipboardCheck, Users, IdCard, LogOut, UserCheck, Check, X, Save, UserPlus, Edit3, Trash2, ShieldCheck, ChevronRight, Menu, Download, Upload, Search, Loader2 } from 'lucide-react'
import { useDialog } from '../../src/context/DialogContext'
import { exportToExcel, parseExcelFile } from '../../src/utils/excelUtils'

const OrganizationDashboard = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate()
    const { showAlert, showConfirm } = useDialog()
    const { organizationCred, clearAllCreds } = useContext(context)
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
    const [searchTerm, setSearchTerm] = useState('')
    const fileInputRef = React.useRef(null)
    const [submittingSup, setSubmittingSup] = useState(false)
    const [assigningStudent, setAssigningStudent] = useState(null)
    const [updatingStatus, setUpdatingStatus] = useState(null)
    const [deletingSupId, setDeletingSupId] = useState(null)

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
        setUpdatingStatus(placementId)
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
        .finally(() => setUpdatingStatus(null))
    }

    const handleAssignSupervisor = (studentId, supervisorId) => {
        setAssigningStudent(studentId)
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
        .finally(() => setAssigningStudent(null))
    }

    const handleSubmitSupervisor = (e) => {
        e.preventDefault()
        if (!supName || !supEmail) return showAlert('Please enter supervisor name and email')

        setSubmittingSup(true)
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
            .finally(() => setSubmittingSup(false))
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
            .finally(() => setSubmittingSup(false))
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
        setDeletingSupId(id)
        axios.post('https://siwes-logbook-backend.onrender.com/organization-supervisor/delete', { id })
            .then(() => {
                showAlert('Supervisor deleted')
                fetchSupervisors()
            })
            .catch((err) => showAlert(err?.response?.data?.message || 'Error deleting supervisor'))
            .finally(() => setDeletingSupId(null))
    }
    const handleExport = () => {
        if (supervisors.length === 0) return showAlert("No supervisors to export");
        const exportData = supervisors.map(s => ({
            "Full Name": s.Full_Name,
            "Email Address": s.Email_Address,
            "Department": s.department || '',
            "Contact Address": s.Contact_Adress || '',
            "Intern Capacity": s.capacity || 5,
            "Focus Areas": s.focus_areas || ''
        }));
        exportToExcel(exportData, "Industry_Supervisors");
    };

    const handleDownloadTemplate = () => {
        const templateData = [{
            "Full Name": "Jane Smith",
            "Email Address": "jane.smith@company.com",
            "Department": "Engineering",
            "Contact Address": "123 Tech Lane, Silicon Valley",
            "Intern Capacity": 5,
            "Focus Areas": "Software Development, AI"
        }];
        exportToExcel(templateData, "Organization_Supervisor_Template");
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const data = await parseExcelFile(file);
            if (data.length === 0) return showAlert("The uploaded file is empty.");
            
            // Expected columns: Full Name, Email Address
            const parsedSupervisors = data.map(row => ({
                Full_Name: row["Full Name"] || row.Full_Name || row.FullName,
                Email_Address: row["Email Address"] || row.email_address || row.Email || row.Email_Address,
                department: row["Department"] || row.department,
                Contact_Adress: row["Contact Address"] || row.Contact_Adress || row.ContactAddress,
                capacity: row["Intern Capacity"] || row.capacity || row.Intern_Capacity || 5,
                focus_areas: row["Focus Areas"] || row.focus_areas || row.FocusAreas
            })).filter(s => s.Full_Name && s.Email_Address);
            
            if (parsedSupervisors.length === 0) return showAlert("Could not find valid supervisor data. Please check the columns.");
            
            axios.post("https://siwes-logbook-backend.onrender.com/organization/create/supervisor/batch", {
                supervisors: parsedSupervisors,
                Organization_Id: organizationCred?.id,
                Organization_Mail: organizationCred?.Email_Address
            }).then((res) => {
                showAlert(res.data.message);
                fetchSupervisors();
            }).catch(err => {
                showAlert(err?.response?.data?.message || "Error during batch upload");
            });
        } catch (err) {
            showAlert("Error parsing the file. Please ensure it's a valid Excel/CSV file.");
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const filteredSupervisors = supervisors?.filter(sup => 
        sup.Full_Name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        sup.Email_Address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sup.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );


    return (
        <div className="flex bg-[#FDFDFB] min-h-screen font-sans selection:bg-primary/20 text-slate-600">
            {/* Premium Sidebar */}
            {mobileMenuOpen && <div className="fixed inset-0 bg-slate-900/20 z-40 lg:hidden backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>}
        <aside className={`h-screen w-72 border-r border-slate-100 fixed left-0 top-0 bg-white flex flex-col py-8 z-50 shadow-[4px_0_24px_rgba(0,32,69,0.02)] transition-transform duration-300 lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <Logo size="md" className="px-8 mb-12" title={organizationCred?.Name || 'Organization'} subtitle="SIWES Portal" />
        <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden absolute top-8 right-6 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
          <X className="w-5 h-5" />
        </button>

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
                        <button onClick={() => { clearAllCreds(); navigate("/"); }} className="w-full flex items-center justify-center gap-2 px-4 py-3 text-rose-500 bg-rose-50 hover:bg-rose-100 transition-colors rounded-xl font-bold text-xs uppercase tracking-widest">
                            <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                    </div>
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
                                                                disabled={updatingStatus === p.id}
                                                                onClick={() => handlePlacementStatus(p.id, 'Approved')}
                                                                className="px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs font-bold rounded-xl hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-1.5 disabled:opacity-50"
                                                            >
                                                                {updatingStatus === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Approve
                                                            </button>
                                                            <button
                                                                disabled={updatingStatus === p.id}
                                                                onClick={() => handlePlacementStatus(p.id, 'Rejected')}
                                                                className="px-4 py-2 bg-rose-50 text-rose-600 border border-rose-100 text-xs font-bold rounded-xl hover:bg-rose-600 hover:text-white transition-all flex items-center gap-1.5 disabled:opacity-50"
                                                            >
                                                                {updatingStatus === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />} Reject
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
                                                            disabled={assigningStudent === student.id}
                                                            onClick={() => {
                                                                const selectEl = document.getElementById(`supervisor-select-${student.id}`);
                                                                handleAssignSupervisor(student.id, selectEl?.value);
                                                            }}
                                                            className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-[#001530] hover:shadow-[0_10px_20px_rgba(0,32,69,0.15)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-1.5 inline-flex disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                                                        >
                                                            {assigningStudent === student.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Assign
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
                                        <button type="submit" disabled={submittingSup} className="flex-1 h-12 bg-primary text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-[#001530] hover:shadow-[0_10px_20px_rgba(0,32,69,0.15)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none">
                                            {submittingSup ? <Loader2 className="w-4 h-4 animate-spin" /> : (isEditingSup ? <Save className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />)}
                                            {submittingSup ? 'Saving...' : (isEditingSup ? 'Save Changes' : 'Register Supervisor')}
                                        </button>
                                    </div>
                                </form>
                                
                                {!isEditingSup && (
                                    <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3 text-sm text-blue-800">
                                        <div className="shrink-0 mt-0.5"><Upload className="w-4 h-4 text-blue-600" /></div>
                                        <div className="flex-1">
                                            <p className="font-bold mb-1">Batch Import Guidelines</p>
                                            <p className="font-light mb-2">Upload an Excel (.xlsx, .xls) or CSV file. Ensure your file contains headers exactly matching: <strong>Full Name, Email Address, Department, Contact Address, Intern Capacity, Focus Areas</strong>. Empty rows are ignored.</p>
                                            <button 
                                                type="button" 
                                                onClick={handleDownloadTemplate} 
                                                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary hover:text-[#001530] transition-colors bg-white px-3 py-1.5 rounded-lg border border-blue-200 shadow-sm hover:shadow"
                                            >
                                                <Download className="w-3.5 h-3.5" /> Download Template
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Supervisors Directory */}
                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,32,69,0.03)] p-8 lg:p-10">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                                <div>
                                    <h3 className="text-2xl font-serif text-slate-900">Industry Supervisors</h3>
                                    <p className="text-slate-500 font-light mt-1">Directory of registered organizational supervisors.</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] uppercase tracking-widest font-bold px-4 py-2 bg-blue-50 text-blue-600 rounded-full shadow-sm">{supervisors.length} Registered</span>
                                </div>
                            </div>
                            
                            {/* Toolbar: Search, Export, Import */}
                            <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-slate-50 p-4 rounded-[1.5rem] border border-slate-100 mb-8">
                                <div className="relative w-full lg:w-96">
                                    <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input 
                                        type="text" 
                                        placeholder="Search supervisors..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full h-12 pl-12 pr-4 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-800"
                                    />
                                </div>
                                <div className="flex gap-3 w-full lg:w-auto">
                                    <button onClick={handleExport} className="flex-1 lg:flex-none h-12 px-6 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                                        <Download className="w-4 h-4" /> Export
                                    </button>
                                    <button onClick={() => fileInputRef.current?.click()} className="flex-1 lg:flex-none h-12 px-6 bg-emerald-50 border border-emerald-100 text-emerald-600 font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2">
                                        <Upload className="w-4 h-4" /> Batch Import
                                    </button>
                                    <input type="file" accept=".xlsx, .xls, .csv" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                            <th className="px-6 py-5 pl-8">Full Name</th>
                                            <th className="px-6 py-5">Email Address</th>
                                            <th className="px-6 py-5">Department</th>
                                            <th className="px-6 py-5">Capacity</th>
                                            <th className="px-6 py-5 pr-8 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-sm">
                                        {filteredSupervisors.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="p-10 text-center text-slate-400 font-light text-lg">No industry supervisors found.</td>
                                            </tr>
                                        ) : (
                                            filteredSupervisors.map((s) => (
                                                <tr key={s.id} className="hover:bg-slate-50/50 transition-colors group">
                                                    <td className="px-6 py-5 pl-8">
                                                        <span className="font-bold text-slate-800 text-base">{s.Full_Name}</span>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className="font-medium text-slate-600">{s.Email_Address}</span>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold border border-slate-200 uppercase tracking-widest">{s.department || 'General'}</span>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className="font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg text-sm">{s.capacity || 5} Interns</span>
                                                    </td>
                                                    <td className="px-6 py-5 pr-8 text-right">
                                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button 
                                                                onClick={() => handleEditSup(s)} 
                                                                className="w-8 h-8 flex items-center justify-center text-blue-600 bg-white border border-slate-200 hover:border-primary hover:text-primary rounded-lg shadow-sm transition-colors" 
                                                                title="Edit"
                                                            >
                                                                <Edit3 className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button 
                                                                disabled={deletingSupId === s.id}
                                                                onClick={() => handleDeleteSup(s.id)} 
                                                                className="w-8 h-8 flex items-center justify-center text-rose-600 bg-white border border-slate-200 hover:border-rose-200 hover:bg-rose-50 rounded-lg shadow-sm transition-colors disabled:opacity-50" 
                                                                title="Delete"
                                                            >
                                                                {deletingSupId === s.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>
                )}
            </main>
        </div>
    )
}

export default OrganizationDashboard
