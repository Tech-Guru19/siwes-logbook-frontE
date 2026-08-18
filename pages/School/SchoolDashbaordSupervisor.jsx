import React, { useContext, useEffect, useState } from 'react'
import { context } from '../../src/App'
import Logo from '../../src/components/Logo'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import user from '../../public/profile.png'
import { Building2, LayoutDashboard, GraduationCap, Users, Building, LogOut, ChevronRight, UserPlus, Save, Plus, Edit3, Trash2, IdCard, Mail, UsersRound, Headset, Menu, X, Upload, Filter, Download } from 'lucide-react'
import { useDialog } from '../../src/context/DialogContext'
import { parseExcelFile, exportToExcel } from '../../src/utils/excelUtils'

const SchoolDashbaordSupervisor = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate()
    const { showAlert, showConfirm } = useDialog()
    const { schoolCred, studentList, schoolDepartments, schoolSupervisors, setSchoolSupervisors } = useContext(context)
    const [fullName, setFullName] = useState("")
    const [emailAddress, setEmailAddress] = useState('')
    const [Department, setDepartment] = useState("")
    const [isEditing, setIsEditing] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [searchQuery, setSearchQuery] = useState("")
    const fileInputRef = React.useRef(null)

    useEffect(() => {
        if (!schoolCred) return navigate("/register/accountType")
        
        axios.post("https://siwes-logbook-backend.onrender.com/school/fetch/supervisor", { id: schoolCred?.id })
            .then((res) => {
                setSchoolSupervisors(res?.data?.message || [])
            })
            .catch((err) => {
                console.log(err)
            })
    }, [schoolCred])

    useEffect(() => {
        if (schoolDepartments?.length > 0 && !Department) {
            setDepartment(schoolDepartments[0].department_name)
        }
    }, [schoolDepartments])

    const handleSubmitSupervisor = () => {
        if (!fullName || !emailAddress || !Department) return showAlert("Please fill in all parameters")
        
        if (isEditing) {
            axios.post("https://siwes-logbook-backend.onrender.com/school/supervisor/update", {
                id: editingId,
                Full_Name: fullName,
                Email_Address: emailAddress,
                department: Department
            })
            .then(() => {
                setSchoolSupervisors(prev => prev.map(s => s.id === editingId ? {
                    ...s,
                    Full_Name: fullName,
                    Email_Address: emailAddress,
                    department: Department
                } : s))
                resetForm()
                showAlert("Supervisor updated successfully")
            })
            .catch((err) => {
                showAlert(err?.response?.data?.message || "Error updating supervisor")
            })
        } else {
            axios.post("https://siwes-logbook-backend.onrender.com/school/register/supervisor", {
                Full_Name: fullName,
                Email_Address: emailAddress,
                Instituition_Id: schoolCred?.id,
                department: Department
            })
            .then((res) => {
                const newId = res?.data?.message
                setSchoolSupervisors(prev => [...prev, {
                    id: newId,
                    Full_Name: fullName,
                    Email_Address: emailAddress,
                    Instituition_Id: schoolCred?.id,
                    department: Department
                }])
                resetForm()
                showAlert("Supervisor registered successfully")
            })
            .catch((error) => {
                showAlert(error?.response?.data?.message || "Error adding supervisor")
            })
        }
    }

    const resetForm = () => {
        setFullName("")
        setEmailAddress("")
        if (schoolDepartments?.length > 0) {
            setDepartment(schoolDepartments[0].department_name)
        } else {
            setDepartment("")
        }
        setIsEditing(false)
        setEditingId(null)
    }

    const handleEditClick = (sup) => {
        setIsEditing(true)
        setEditingId(sup.id)
        setFullName(sup.Full_Name)
        setEmailAddress(sup.Email_Address)
        setDepartment(sup.department)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleDeleteClick = async (id) => {
        const confirm = await showConfirm("Are you sure you want to delete this supervisor?")
        if (!confirm) return
        axios.post("https://siwes-logbook-backend.onrender.com/school/supervisor/delete", { id })
            .then(() => {
                setSchoolSupervisors(prev => prev.filter(s => s.id !== id))
                showAlert("Supervisor deleted successfully")
            })
            .catch((err) => {
                showAlert(err?.response?.data?.message || "Error deleting supervisor")
            })
    }

    const handleExport = () => {
        if (!schoolSupervisors || schoolSupervisors.length === 0) return showAlert("No supervisors to export");
        const exportData = schoolSupervisors.map(sup => ({
            "Full Name": sup.Full_Name,
            "Email Address": sup.Email_Address,
            "Department": sup.department
        }));
        exportToExcel(exportData, "Supervisors_Export");
    }

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const data = await parseExcelFile(file);
            if (data.length === 0) return showAlert("The uploaded file is empty.");
            
            // Expected columns: "Full Name", "Email Address", "Department"
            const supervisors = data.map(row => ({
                Full_Name: row["Full Name"] || row.Full_Name || row.FullName,
                Email_Address: row["Email Address"] || row.Email_Address || row.Email,
                Department: row["Department"] || row.department
            })).filter(s => s.Full_Name && s.Email_Address);
            
            if (supervisors.length === 0) return showAlert("Could not find valid supervisor data. Please check the columns.");
            
            axios.post("https://siwes-logbook-backend.onrender.com/school/register/supervisor/batch", {
                supervisors,
                Instituition_Id: schoolCred?.id
            }).then((res) => {
                showAlert(res.data.message);
                axios.post("https://siwes-logbook-backend.onrender.com/school/fetch/supervisor", { id: schoolCred?.id })
                    .then((res) => {
                        setSchoolSupervisors(res?.data?.message || [])
                    })
            }).catch(err => {
                showAlert(err?.response?.data?.message || "Error during batch upload");
            });
        } catch (err) {
            showAlert("Error parsing the file. Please ensure it's a valid Excel/CSV file.");
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    }

    const filteredSupervisors = schoolSupervisors?.filter(sup => 
        sup?.Full_Name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sup?.Email_Address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sup?.department?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];
    
    return (
        <div className="flex bg-[#FDFDFB] min-h-screen font-sans selection:bg-primary/20 text-slate-600">
            {/* Premium Sidebar */}
            {mobileMenuOpen && <div className="fixed inset-0 bg-slate-900/20 z-40 lg:hidden backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>}
        <aside className={`h-screen w-72 border-r border-slate-100 fixed left-0 top-0 bg-white flex flex-col py-8 z-50 shadow-[4px_0_24px_rgba(0,32,69,0.02)] transition-transform duration-300 lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <Logo size="md" className="px-8 mb-12" title={schoolCred?.Name || 'Institution'} subtitle="SIWES Portal" />
        <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden absolute top-8 right-6 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
          <X className="w-5 h-5" />
        </button>

                <nav className="flex-grow flex flex-col px-4 gap-2 overflow-y-auto custom-scrollbar">
                    <Link to="/school/dashboard" className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm transition-all text-left text-slate-500 font-medium hover:bg-primary/5 hover:text-primary">
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                    </Link>
                    <Link to="/school/dashboard/student" className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm transition-all text-left text-slate-500 font-medium hover:bg-primary/5 hover:text-primary">
                        <GraduationCap className="w-5 h-5" />
                        Students
                    </Link>
                    <Link to="/school/dashboard/supervisor" className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm transition-all text-left bg-primary/5 text-primary font-bold shadow-sm">
                        <Users className="w-5 h-5" />
                        Supervisors
                    </Link>
                    <Link to="/school/dashboard/department" className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm transition-all text-left text-slate-500 font-medium hover:bg-primary/5 hover:text-primary">
                        <Building className="w-5 h-5" />
                        Departments
                    </Link>
                </nav>

                <div className="mt-auto px-4 space-y-4">
                    <div className="pt-4 border-t border-slate-100">
                        <button onClick={() => navigate("/")} className="w-full flex items-center justify-center gap-2 px-4 py-3 text-rose-500 bg-rose-50 hover:bg-rose-100 transition-colors rounded-xl font-bold text-xs uppercase tracking-widest">
                            <LogOut className="w-4 h-4" /> Logout
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
                            <Link to="/school/dashboard" className="hover:text-primary transition-colors">Portal</Link>
                            <ChevronRight className="w-3 h-3" />
                            <span className="text-primary">Supervisor Management</span>
                        </nav>
                        <h1 className="text-3xl md:text-4xl font-serif text-slate-900">Academic Supervisors</h1>
                        <p className="text-slate-500 font-light mt-2">{schoolCred?.Name}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 shadow-sm">
                            <img src={schoolCred?.Profile_Img || user} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>

                <div className="space-y-12">
                    {/* Form Section */}
                    <section className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,32,69,0.03)] overflow-hidden">
                        <div className="p-8 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-serif text-slate-900 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                        <UserPlus className="w-5 h-5 text-primary" />
                                    </div>
                                    {isEditing ? "Edit Supervisor Registration" : "Quick Supervisor Registration"}
                                </h2>
                                <p className="text-slate-500 font-light mt-2 text-sm ml-14">
                                    {isEditing ? "Modify an existing supervisor's details." : "Add a new academic supervisor to the platform."}
                                </p>
                            </div>
                        </div>
                        <div className="p-8 lg:p-10">
                            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-6 items-end">
                                <div className="lg:col-span-3">
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name *</label>
                                    <div className="relative">
                                        <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                        <input value={fullName} onChange={(e)=>{setFullName(e.target.value)}} className="w-full pl-12 pr-4 h-12 bg-slate-50 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm font-medium outline-none text-slate-800" placeholder="e.g. Dr. Jane Smith" type="text" />
                                    </div>
                                </div>
                                <div className="lg:col-span-3">
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address *</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                        <input value={emailAddress} onChange={(e)=>{setEmailAddress(e.target.value)}} className="w-full pl-12 pr-4 h-12 bg-slate-50 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm font-medium outline-none text-slate-800" placeholder="jane.smith@university.edu" type="email" />
                                    </div>
                                </div>
                                <div className="lg:col-span-3">
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Department *</label>
                                    <div className="relative">
                                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                        <select value={Department} onChange={(e)=>{setDepartment(e.target.value)}} className="w-full pl-12 pr-4 h-12 bg-slate-50 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm font-medium outline-none appearance-none text-slate-800 cursor-pointer">
                                            {schoolDepartments?.map((output)=>{
                                                return(
                                                    <option key={output?.id} value={output?.department_name}>{output?.department_name}</option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                </div>
                                <div className="lg:col-span-3 flex flex-col gap-2">
                                    <button onClick={handleSubmitSupervisor} className="w-full bg-primary text-white h-12 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#001530] hover:shadow-[0_10px_20px_rgba(0,32,69,0.15)] hover:-translate-y-0.5 transition-all" >
                                        {isEditing ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                        {isEditing ? "Save Changes" : "Add Supervisor"}
                                    </button>
                                    {!isEditing && (
                                        <button onClick={() => fileInputRef.current?.click()} className="w-full h-12 bg-emerald-50 text-emerald-600 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2">
                                            <Upload className="w-4 h-4" /> Batch Import
                                        </button>
                                    )}
                                    <input type="file" accept=".xlsx, .xls, .csv" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                                    {isEditing && (
                                        <button onClick={resetForm} className="w-full bg-slate-100 text-slate-600 h-10 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center hover:bg-slate-200 transition-colors" >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                            {!isEditing && (
                                <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3 text-sm text-blue-800">
                                    <div className="shrink-0 mt-0.5"><Upload className="w-4 h-4 text-blue-600" /></div>
                                    <div>
                                        <p className="font-bold mb-1">Batch Import Guidelines</p>
                                        <p className="font-light">Upload an Excel (.xlsx, .xls) or CSV file. Ensure your file contains headers exactly matching: <strong>Full Name, Email Address, Department</strong>. Empty rows are ignored.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                    
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,32,69,0.03)] overflow-hidden">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                            <div className="flex items-center gap-6">
                                <div>
                                    <h3 className="text-2xl font-serif text-primary">Supervisor Directory</h3>
                                    <p className="text-slate-500 font-light mt-1">Listing of all registered academic supervisors.</p>
                                </div>
                                <div className="hidden lg:flex gap-4 border-l border-slate-200 pl-6">
                                    <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
                                        <UsersRound className="w-5 h-5 text-blue-500" />
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Total Active</p>
                                            <p className="text-lg font-serif text-blue-900 leading-none">{schoolSupervisors?.length}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 items-center">
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        placeholder="Search supervisors..." 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="h-10 bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 text-xs font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-800 w-48 lg:w-64"
                                    />
                                    <Filter className="w-4 h-4 text-slate-400 absolute left-4 top-3" />
                                </div>
                                <button onClick={handleExport} className="flex items-center gap-2 px-5 h-10 bg-slate-50 text-slate-600 border border-slate-200 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-colors">
                                    <Download className="w-4 h-4" /> Export
                                </button>
                            </div>
                        </div>
                        <div className="overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredSupervisors.length === 0 ? (
                                    <div className="col-span-full p-10 text-center text-slate-400 font-light text-lg border border-dashed border-slate-200 rounded-2xl bg-slate-50">
                                        No academic supervisors found.
                                    </div>
                                ) : (
                                    filteredSupervisors.slice().reverse().map((sup) => {
                                        const studentCount = studentList?.filter(s => s.School_Supervisor_Id === sup.id).length || 0;
                                        const initials = sup.Full_Name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'SP';
                                        return (
                                            <div key={sup.id} className="bg-slate-50 border border-slate-100 rounded-[2rem] p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group relative overflow-hidden">
                                                <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleEditClick(sup)} className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-primary hover:border-primary hover:shadow-sm flex items-center justify-center transition-all" title="Edit">
                                                        <Edit3 className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button onClick={() => handleDeleteClick(sup.id)} className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 hover:shadow-sm flex items-center justify-center transition-all" title="Delete">
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                                <div className="flex flex-col items-center text-center gap-4 mb-6 pt-4">
                                                    <div className="w-20 h-20 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-2xl overflow-hidden border-4 border-white shadow-sm shrink-0">
                                                        {sup.Profile_Img ? (
                                                            <img src={sup.Profile_Img} alt={sup.Full_Name} className="w-full h-full object-cover" />
                                                        ) : initials}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-serif font-bold text-slate-900 text-xl leading-tight group-hover:text-primary transition-colors">{sup.Full_Name}</h4>
                                                        <p className="text-xs text-slate-500 font-light mt-1">{sup.department}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-4 pt-6 border-t border-slate-200">
                                                    <div className="flex items-center gap-4 text-slate-600">
                                                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                                                            <Mail className="w-4 h-4" />
                                                        </div>
                                                        <p className="text-sm truncate font-medium">{sup.Email_Address}</p>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-slate-600">
                                                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                                                            <UsersRound className="w-4 h-4" />
                                                        </div>
                                                        <p className="text-sm font-light"><strong className="text-slate-800 font-bold">{studentCount}</strong> Assigned Students</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-transform z-50">
                    <Headset className="w-6 h-6" />
                </button>
            </main>

        </div>
    )
}

export default SchoolDashbaordSupervisor