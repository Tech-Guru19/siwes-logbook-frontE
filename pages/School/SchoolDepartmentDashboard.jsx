import React, { useContext, useEffect, useState } from 'react'
import { context } from '../../src/App'
import Logo from '../../src/components/Logo'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import user from '../../public/profile.png'
import { 
    Building2, LayoutDashboard, GraduationCap, Users, 
    Building, LogOut, ChevronRight, FolderPlus, 
    Save, PlusCircle, Filter, Download, Edit3, Trash2 
} from 'lucide-react'
import { useDialog } from '../../src/context/DialogContext'

const SchoolDepartmentDashboard = () => {
    const { schoolCred, studentList, schoolDepartments, setSchoolDepartments } = useContext(context)
    const navigate = useNavigate()
    const { showAlert, showConfirm } = useDialog()
    const [departmentName, setdepartmentName] = useState("")
    const [facultyName, setfacultyName] = useState("Engineering")
    const [HODName, setHODName] = useState("")
    const [isEditing, setIsEditing] = useState(false)
    const [editingId, setEditingId] = useState(null)

    useEffect(() => {
        if (!schoolCred) return navigate("/register/accountType")
    }, [schoolCred])

    const handleSubmitDepartment = () => {
        if (!departmentName || !facultyName || !HODName) return showAlert("Please fill in all inputs")
        
        if (isEditing) {
            axios.post("https://siwes-logbook-backend.onrender.com/school/department/update", {
                id: editingId,
                departmentName,
                facultyName,
                HODName
            })
            .then(() => {
                setSchoolDepartments(prev => prev.map(d => d.id === editingId ? {
                    ...d,
                    department_name: departmentName,
                    faculty_name: facultyName,
                    Hod_name: HODName
                } : d))
                resetForm()
                showAlert("Department updated successfully")
            })
            .catch((err) => {
                showAlert(err?.response?.data?.message || "Error updating department")
            })
        } else {
            axios.post("https://siwes-logbook-backend.onrender.com/school/register/department", {
                departmentName,
                instituitionId: schoolCred?.id,
                facultyName,
                HODName
            })
            .then((output) => {
                setSchoolDepartments(prev => [...prev, {
                    id: output?.data?.message,
                    department_name: departmentName,
                    instituition_id: schoolCred?.id,
                    faculty_name: facultyName,
                    Hod_name: HODName
                }])
                resetForm()
                showAlert("Department created successfully")
            })
            .catch((error) => {
                showAlert(error?.response?.data?.message || "Error adding department")
            })
        }
    }

    const resetForm = () => {
        setdepartmentName("")
        setfacultyName("Engineering")
        setHODName("")
        setIsEditing(false)
        setEditingId(null)
    }

    const handleEditClick = (dept) => {
        setIsEditing(true)
        setEditingId(dept.id)
        setdepartmentName(dept.department_name)
        setfacultyName(dept.faculty_name)
        setHODName(dept.Hod_name)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleDeleteClick = async (id) => {
        const confirm = await showConfirm("Are you sure you want to delete this department?")
        if (!confirm) return
        axios.post("https://siwes-logbook-backend.onrender.com/school/department/delete", { id })
            .then(() => {
                setSchoolDepartments(prev => prev.filter(d => d.id !== id))
                showAlert("Department deleted successfully")
            })
            .catch((err) => {
                showAlert(err?.response?.data?.message || "Error deleting department")
            })
    }
    
    return (
        <div className="flex bg-[#FDFDFB] min-h-screen font-sans selection:bg-primary/20 text-slate-600">
            {/* Premium Sidebar */}
            <aside className="h-screen w-72 border-r border-slate-100 fixed left-0 top-0 bg-white flex flex-col py-8 z-40 shadow-[4px_0_24px_rgba(0,32,69,0.02)] hidden lg:flex">
                <Logo size="md" className="px-8 mb-12" title={schoolCred?.Name || 'Institution'} subtitle="SIWES Portal" />

                <nav className="flex-grow flex flex-col px-4 gap-2 overflow-y-auto custom-scrollbar">
                    <Link to="/school/dashboard" className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm transition-all text-left text-slate-500 font-medium hover:bg-primary/5 hover:text-primary">
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                    </Link>
                    <Link to="/school/dashboard/student" className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm transition-all text-left text-slate-500 font-medium hover:bg-primary/5 hover:text-primary">
                        <GraduationCap className="w-5 h-5" />
                        Students
                    </Link>
                    <Link to="/school/dashboard/supervisor" className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm transition-all text-left text-slate-500 font-medium hover:bg-primary/5 hover:text-primary">
                        <Users className="w-5 h-5" />
                        Supervisors
                    </Link>
                    <Link to="/school/dashboard/department" className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm transition-all text-left bg-primary/5 text-primary font-bold shadow-sm">
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
            <main className="lg:ml-72 flex-1 p-6 lg:p-12 xl:p-16 pt-4 lg:pt-8 xl:pt-8 space-y-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 pb-6">
                    <div>
                        <nav className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">
                            <Link to="/school/dashboard" className="hover:text-primary transition-colors">Portal</Link>
                            <ChevronRight className="w-3 h-3" />
                            <span className="text-primary">Department Management</span>
                        </nav>
                        <h1 className="text-3xl md:text-4xl font-serif text-slate-900">Department Config</h1>
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
                                        <FolderPlus className="w-5 h-5 text-primary" />
                                    </div>
                                    {isEditing ? "Edit Department" : "Create New Department"}
                                </h2>
                                <p className="text-slate-500 font-light mt-2 text-sm ml-14">
                                    {isEditing ? "Modify the department details." : "Configure academic divisions and assign Heads of Department."}
                                </p>
                            </div>
                        </div>
                        <div className="p-8 lg:p-10">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-end">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Department Name *</label>
                                    <input value={departmentName} onChange={(e) => { setdepartmentName(e.target.value) }} className="h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-800" placeholder="e.g. Mechanical Engineering" type="text" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Faculty Name *</label>
                                    <select value={facultyName} onChange={(e) => { setfacultyName(e.target.value) }} className="h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none appearance-none text-slate-800 cursor-pointer">
                                        <option>Engineering</option>
                                        <option>Science</option>
                                        <option>Social Sciences</option>
                                        <option>Management</option>
                                        <option>Arts &amp; Humanities</option>
                                        <option>Law</option>
                                        <option>Medical Sciences</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">HOD Name *</label>
                                    <input value={HODName} onChange={(e) => { setHODName(e.target.value) }} className="h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-800" placeholder="Full name of HOD" type="text" />
                                </div>
                                <div className="flex flex-col justify-end gap-3">
                                    <button onClick={handleSubmitDepartment} className="w-full h-12 bg-primary text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-sm hover:bg-[#001530] hover:shadow-[0_10px_20px_rgba(0,32,69,0.15)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                                        {isEditing ? <Save className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
                                        {isEditing ? "Save Changes" : "Create Dept"}
                                    </button>
                                    {isEditing && (
                                        <button onClick={resetForm} className="w-full h-12 bg-slate-100 text-slate-600 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-colors">
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Directory Section */}
                    <section className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,32,69,0.03)] overflow-hidden">
                        <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div>
                                    <h3 className="text-2xl font-serif text-slate-900">Departments Directory</h3>
                                    <p className="text-slate-500 font-light mt-1">Listing of all registered academic units and administrators.</p>
                                </div>
                                <div className="hidden lg:flex gap-4 border-l border-slate-200 pl-6">
                                    <div className="text-center">
                                        <p className="text-[10px] uppercase font-bold text-slate-400">Total Depts</p>
                                        <p className="text-2xl font-serif text-primary">{schoolDepartments?.length}</p>
                                    </div>
                                </div>
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
                        
                        <div className="overflow-x-auto max-h-[550px] overflow-y-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 sticky top-0 z-10 border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-widest backdrop-blur-md">
                                        <th className="px-6 py-5 pl-8">Department Name</th>
                                        <th className="px-6 py-5">Faculty</th>
                                        <th className="px-6 py-5">HOD Name</th>
                                        <th className="px-6 py-5">Students</th>
                                        <th className="px-6 py-5 pr-8 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {schoolDepartments.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="p-10 text-center text-slate-400 font-light text-lg">No departments registered yet.</td>
                                        </tr>
                                    ) : (
                                        schoolDepartments.slice().reverse().map((output) => {
                                            const count = studentList?.filter((std) => std?.department === output?.department_name).length || 0;
                                            return (
                                                <tr key={output.id} className="hover:bg-slate-50/50 transition-colors group">
                                                    <td className="px-6 py-5 pl-8">
                                                        <div className="font-bold text-slate-800 text-base">{output?.department_name}</div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold border border-slate-200 uppercase tracking-widest">{output?.faculty_name}</span>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className="font-medium text-slate-600">{output?.Hod_name}</span>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className="font-bold text-primary">{count}</span> <span className="text-xs text-slate-400">Enrolled</span>
                                                    </td>
                                                    <td className="px-6 py-5 pr-8 text-right">
                                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button onClick={() => handleEditClick(output)} className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-primary hover:border-primary hover:shadow-sm flex items-center justify-center transition-all" title="Edit">
                                                                <Edit3 className="w-4 h-4" />
                                                            </button>
                                                            <button onClick={() => handleDeleteClick(output.id)} className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 hover:shadow-sm flex items-center justify-center transition-all" title="Delete">
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

export default SchoolDepartmentDashboard