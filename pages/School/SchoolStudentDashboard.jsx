import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { context } from '../../src/App'
import Logo from '../../src/components/Logo'
import user from '../../public/profile.png'
import axios from 'axios'
import { Building2, LayoutDashboard, GraduationCap, Users, Building, LogOut, ChevronRight, UserPlus, Edit3, Trash2, Filter, Download, Menu, X } from 'lucide-react'
import { useDialog } from '../../src/context/DialogContext'

const SchoolStudentDashboard = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { showAlert, showConfirm } = useDialog()
    const { schoolCred, setSchoolCred, studentList, setStudentList, schoolDepartments } = useContext(context)
    const navigate = useNavigate()
    const [fullName, setFullName] = useState("")
    const [supervisorId, setSupervisorId] = useState("")
    const [emailAdress, setEmailAddress] = useState("")
    const [matricNo, setMatricNo] = useState("")
    const [department, setDepartment] = useState("")
    const [startDate, setStartDat] = useState("")
    const [endDate, setEndDate] = useState("")
    const [supervisorsList, setSupervisorsList] = useState([])
    const [isEditing, setIsEditing] = useState(false)
    const [editingId, setEditingId] = useState(null)

    const handleOpenStudentDetails = (student) => {
        navigate(`/student-performance/${student.id}`)
    }

    useEffect(() => {
        if (!schoolCred) return navigate("/register/accountType")

        axios.post("https://siwes-logbook-backend.onrender.com/school/fetch/supervisor", { id: schoolCred?.id })
            .then((res) => {
                const list = res?.data?.message || []
                setSupervisorsList(list)
                if (list.length > 0) {
                    setSupervisorId(list[0].id)
                }
            })
            .catch((err) => {
                console.log(err)
            })

        axios.post("https://siwes-logbook-backend.onrender.com/student/fetch-detailed", { instituition_id: schoolCred?.id })
            .then((students) => {
                setStudentList(students?.data?.message || [])
            })
            .catch((err) => console.log(err))
    }, [schoolCred])

    useEffect(() => {
        if (schoolDepartments?.length > 0 && !department) {
            setDepartment(schoolDepartments[0].department_name)
        }
    }, [schoolDepartments])

    const handleSubmitStudent = () => {
        if (!fullName || !emailAdress || !supervisorId || !matricNo || !department || !startDate || !endDate) {
            return showAlert("Please fill in all parameters")
        }

        if (isEditing) {
            axios.post("https://siwes-logbook-backend.onrender.com/school/student/update", {
                id: editingId,
                Full_Name: fullName,
                email_address: emailAdress,
                Matriculation_No: matricNo,
                department,
                Start_Date: startDate,
                End_Date: endDate
            })
            .then(() => {
                setStudentList(prev => prev.map(s => s.id === editingId ? {
                    ...s,
                    Full_Name: fullName,
                    email_address: emailAdress,
                    Matriculation_No: matricNo,
                    department,
                    Start_Date: startDate,
                    End_Date: endDate
                } : s))
                resetForm()
                showAlert("Student updated successfully")
            })
            .catch((err) => {
                showAlert(err?.response?.data?.message || "Error updating student")
            })
        } else {
            axios.post("https://siwes-logbook-backend.onrender.com/school/register/student", {
                Full_Name: fullName,
                Instituition_Id: schoolCred?.id,
                School_Supervisor_Id: supervisorId,
                email_address: emailAdress,
                Matriculation_No: matricNo,
                department,
                Instituition_Mail: schoolCred?.Mail,
                Start_Date: startDate,
                End_Date: endDate
            })
            .then((res) => {
                const newId = res?.data?.message?.insertId || res?.data?.message
                setStudentList(prev => [...prev, {
                    id: newId,
                    Full_Name: fullName,
                    email_address: emailAdress,
                    Matriculation_No: matricNo,
                    department,
                    Start_Date: startDate,
                    End_Date: endDate,
                    School_Supervisor_Id: supervisorId
                }])
                resetForm()
                showAlert("Student enrolled successfully")
            })
            .catch((err) => {
                showAlert(err?.response?.data?.message || "Error enrolling student")
            })
        }
    }

    const resetForm = () => {
        setFullName("")
        setEmailAddress("")
        setMatricNo("")
        setStartDat("")
        setEndDate("")
        setIsEditing(false)
        setEditingId(null)
    }

    const handleEditClick = (student) => {
        setIsEditing(true)
        setEditingId(student.id)
        setFullName(student.Full_Name)
        setEmailAddress(student.email_address)
        setMatricNo(student.Matriculation_No)
        setDepartment(student.department)
        setSupervisorId(student.School_Supervisor_Id)
        
        if (student.Start_Date) {
            setStartDat(new Date(student.Start_Date).toISOString().split('T')[0])
        }
        if (student.End_Date) {
            setEndDate(new Date(student.End_Date).toISOString().split('T')[0])
        }
        
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleDeleteClick = async (id) => {
        const confirm = await showConfirm("Are you sure you want to delete this student?")
        if (!confirm) return
        axios.post("https://siwes-logbook-backend.onrender.com/school/student/delete", { id })
            .then(() => {
                setStudentList(prev => prev.filter(s => s.id !== id))
                showAlert("Student deleted successfully")
            })
            .catch((err) => {
                showAlert(err?.response?.data?.message || "Error deleting student")
            })
    }

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
                    <Link to="/school/dashboard/student" className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm transition-all text-left bg-primary/5 text-primary font-bold shadow-sm">
                        <GraduationCap className="w-5 h-5" />
                        Students
                    </Link>
                    <Link to="/school/dashboard/supervisor" className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm transition-all text-left text-slate-500 font-medium hover:bg-primary/5 hover:text-primary">
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
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 pb-6">
                    <div>
                        <nav className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">
                            <Link to="/school/dashboard" className="hover:text-primary transition-colors">Portal</Link>
                            <ChevronRight className="w-3 h-3" />
                            <span className="text-primary">Students Directory</span>
                        </nav>
                        <h1 className="text-3xl md:text-4xl font-serif text-slate-900">Manage Students</h1>
                        <p className="text-slate-500 font-light mt-2">{schoolCred?.Name}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 shadow-sm">
                            <img src={schoolCred?.Profile_Img || user} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>

                <div className="space-y-12">
                    
                    {/* Enrollment Form */}
                    <section className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,32,69,0.03)] overflow-hidden">
                        <div className="p-8 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-serif text-slate-900 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                        <UserPlus className="w-5 h-5 text-primary" />
                                    </div>
                                    {isEditing ? "Edit Student Details" : "Enroll New Student"}
                                </h2>
                                <p className="text-slate-500 font-light mt-2 text-sm ml-14">
                                    {isEditing ? "Modify an existing student's enrollment data." : "Register a new student into the SIWES management system."}
                                </p>
                            </div>
                        </div>
                        <div className="p-8 lg:p-10 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Name *</label>
                                    <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-800" placeholder="e.g. John Doe" type="text" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address *</label>
                                    <input value={emailAdress} onChange={(e) => setEmailAddress(e.target.value)} className="h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-800" placeholder="john.doe@university.edu" type="email" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Academic Supervisor *</label>
                                    <select value={supervisorId} onChange={(e) => setSupervisorId(e.target.value)} className="h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none appearance-none text-slate-800 cursor-pointer">
                                        <option value="" disabled>Select a supervisor</option>
                                        {supervisorsList?.map((sup) => (
                                            <option key={sup.id} value={sup.id}>{sup.Full_Name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Matric No *</label>
                                    <input value={matricNo} onChange={(e) => setMatricNo(e.target.value)} className="h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-800" placeholder="SCI/19/20/0045" type="text" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Department *</label>
                                    <select value={department} onChange={(e) => setDepartment(e.target.value)} className="h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none appearance-none text-slate-800 cursor-pointer">
                                        {schoolDepartments?.map((dep) => (
                                            <option key={dep.id} value={dep.department_name}>{dep.department_name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Start Date *</label>
                                    <input value={startDate} onChange={(e) => setStartDat(e.target.value)} className="h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-800" type="date" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">End Date *</label>
                                    <input value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-800" type="date" />
                                </div>
                            </div>
                            
                            <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
                                {isEditing && (
                                    <button onClick={resetForm} className="px-8 h-12 bg-slate-100 text-slate-600 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-colors">
                                        Cancel
                                    </button>
                                )}
                                <button onClick={handleSubmitStudent} className="px-8 h-12 bg-primary text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#001530] hover:shadow-[0_10px_20px_rgba(0,32,69,0.15)] hover:-translate-y-0.5 transition-all">
                                    {isEditing ? "Save Changes" : "Enroll Student"}
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Directory List */}
                    <section className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,32,69,0.03)] overflow-hidden">
                        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h3 className="text-2xl font-serif text-slate-900">Student Directory</h3>
                                <p className="text-slate-500 font-light mt-1">Manage and monitor current SIWES placements.</p>
                            </div>
                            <div className="flex gap-3">
                                <button className="flex items-center gap-2 px-5 h-10 bg-slate-50 text-slate-600 border border-slate-200 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-colors">
                                    <Filter className="w-4 h-4" /> Filter
                                </button>
                                <button className="flex items-center gap-2 px-5 h-10 bg-slate-50 text-slate-600 border border-slate-200 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-colors">
                                    <Download className="w-4 h-4" /> Export
                                </button>
                            </div>
                        </div>
                        
                        <div className="overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 sticky top-0 z-10 border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-widest backdrop-blur-md">
                                        <th className="px-6 py-5 pl-8">Student Profile</th>
                                        <th className="px-6 py-5">Matric No</th>
                                        <th className="px-6 py-5">Department</th>
                                        <th className="px-6 py-5">Status</th>
                                        <th className="px-6 py-5 pr-8 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {studentList?.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="p-10 text-center text-slate-400 font-light text-lg">No students found.</td>
                                        </tr>
                                    ) : (
                                        studentList?.slice()?.reverse()?.map((student) => {
                                            let statusText = "Active"
                                            let statusColor = "bg-emerald-500"
                                            let statusBg = "bg-emerald-50 text-emerald-600 border-emerald-100"
                                            
                                            const targetDate = new Date(student?.Start_Date)
                                            const endDate = new Date(student?.End_Date)
                                            const currentDate = new Date()
                                            
                                            if (currentDate < targetDate) {
                                                statusText = "Pending"
                                                statusColor = "bg-slate-400"
                                                statusBg = "bg-slate-100 text-slate-600 border-slate-200"
                                            } else if (currentDate > endDate) {
                                                statusText = "Completed"
                                                statusColor = "bg-blue-500"
                                                statusBg = "bg-blue-50 text-blue-600 border-blue-100"
                                            }

                                            return (
                                                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                                                    <td className="px-6 py-5 pl-8">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 shadow-sm shrink-0">
                                                                <img src={student?.Profile_Img || user} className="w-full h-full object-cover" />
                                                            </div>
                                                            <div>
                                                                <div 
                                                                    onClick={() => handleOpenStudentDetails(student)}
                                                                    className="font-bold text-slate-800 transition-colors cursor-pointer group-hover:text-primary text-base"
                                                                >
                                                                    {student?.Full_Name}
                                                                </div>
                                                                <div className="text-[10px] font-light text-slate-500 mt-0.5">{student?.email_address}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className="font-medium text-slate-700">{student?.Matriculation_No}</span>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className="font-light text-slate-600">{student?.department}</span>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className={`flex items-center gap-2 w-max px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${statusBg}`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${statusColor}`}></span>
                                                            {statusText}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5 pr-8 text-right">
                                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button onClick={() => handleEditClick(student)} className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-primary hover:border-primary hover:shadow-sm flex items-center justify-center transition-all" title="Edit">
                                                                <Edit3 className="w-4 h-4" />
                                                            </button>
                                                            <button onClick={() => handleDeleteClick(student.id)} className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 hover:shadow-sm flex items-center justify-center transition-all" title="Delete">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    )
}

export default SchoolStudentDashboard