import React, { useContext, useEffect } from 'react'
import { context } from '../../src/App'
import { useNavigate, Link } from 'react-router-dom'
import user from '../../public/profile.png'
import axios from 'axios'
import { 
    Building2, LayoutDashboard, GraduationCap, Users, 
    Building, UserPlus, LogOut, UsersRound, Briefcase, 
    UserCheck, Plus, ChevronRight 
} from 'lucide-react'

const SchoolDashboard = () => {
    const { schoolCred, studentList, setStudentList, setSchoolDepartments, schoolSupervisors, setSchoolSupervisors } = useContext(context)
    const navigate = useNavigate()

    useEffect(() => {
        if (!schoolCred) return navigate("/school/signin")

        // Fetch Students
        axios.post("https://siwes-logbook-backend.onrender.com/school/fetch/student", { id: schoolCred?.id })
            .then((res) => {
                setStudentList(res?.data?.message || [])
            })
            .catch((err) => console.log(err))

        // Fetch Departments
        axios.post("https://siwes-logbook-backend.onrender.com/school/register/department/fetch", { id: schoolCred?.id })
            .then((res) => {
                setSchoolDepartments(res?.data?.message || [])
            })
            .catch((err) => console.log(err))

        // Fetch Supervisors
        axios.post("https://siwes-logbook-backend.onrender.com/school/fetch/supervisor", { id: schoolCred?.id })
            .then((res) => {
                setSchoolSupervisors(res?.data?.message || [])
            })
            .catch((err) => console.log(err))
    }, [schoolCred])

    return (
        <div className="flex bg-[#FDFDFB] min-h-screen font-sans selection:bg-primary/20 text-slate-600">
            {/* Premium Sidebar */}
            <aside className="h-screen w-72 border-r border-slate-100 fixed left-0 top-0 bg-white flex flex-col py-8 z-40 shadow-[4px_0_24px_rgba(0,32,69,0.02)] hidden lg:flex">
                <div className="px-8 mb-12 flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                        <Building2 className="text-white w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-lg font-serif font-bold text-primary tracking-tight truncate max-w-[150px]">{schoolCred?.Name || 'Institution'}</h1>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">SIWES Portal</p>
                    </div>
                </div>

                <nav className="flex-grow flex flex-col px-4 gap-2 overflow-y-auto custom-scrollbar">
                    <Link to="/school/dashboard" className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm transition-all text-left bg-primary/5 text-primary font-bold shadow-sm">
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
                    <Link to="/school/dashboard/department" className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm transition-all text-left text-slate-500 font-medium hover:bg-primary/5 hover:text-primary">
                        <Building className="w-5 h-5" />
                        Departments
                    </Link>
                </nav>

                <div className="mt-auto px-4 space-y-4">
                    <button onClick={() => navigate("/school/dashboard/student")} className="w-full h-12 bg-primary text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#001530] hover:shadow-[0_10px_20px_rgba(0,32,69,0.15)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                        <UserPlus className="w-4 h-4" /> Add Student
                    </button>
                    <div className="pt-4 border-t border-slate-100">
                        <button onClick={() => navigate("/")} className="w-full flex items-center justify-center gap-2 px-4 py-3 text-rose-500 bg-rose-50 hover:bg-rose-100 transition-colors rounded-xl font-bold text-xs uppercase tracking-widest">
                            <LogOut className="w-4 h-4" /> Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="lg:ml-72 flex-1 p-6 lg:p-12 xl:p-16 space-y-12 max-w-[1400px]">
                {/* Header Banner */}
                <div className="bg-white p-8 lg:p-10 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,32,69,0.03)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    
                    <div className="relative z-10 flex items-center gap-6">
                        <div className="w-20 h-20 rounded-2xl bg-slate-100 border-4 border-white shadow-xl overflow-hidden shrink-0">
                            <img src={schoolCred?.Profile_Img || user} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-serif text-slate-900 mb-2">Welcome back, {schoolCred?.Name || "Institution"}</h1>
                            <p className="text-slate-500 font-light text-lg">{schoolCred?.Mail || "Institutional Account"}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-8 w-full">
                    {/* Summary Counters */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6 group hover:-translate-y-1 transition-all">
                            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                                <UsersRound className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Registered Students</p>
                                <h3 className="text-3xl font-serif text-slate-800">{studentList?.length || 0}</h3>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6 group hover:-translate-y-1 transition-all">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                                <Briefcase className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">In Placement</p>
                                <h3 className="text-3xl font-serif text-slate-800">
                                    {studentList?.filter(s => s.Start_Date).length || 0}
                                </h3>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6 group hover:-translate-y-1 transition-all">
                            <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                                <UserCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Supervisors</p>
                                <h3 className="text-3xl font-serif text-slate-800">{schoolSupervisors?.length || 0}</h3>
                            </div>
                        </div>
                    </section>

                    {/* Directory Sections */}
                    <section className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        {/* Student Progress Directory */}
                        <div className="xl:col-span-2 space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <h2 className="text-2xl font-serif text-slate-900">Student Directory</h2>
                                <button onClick={() => navigate("/school/dashboard/student")} className="px-6 py-3 bg-primary text-white rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-[#001530] hover:shadow-[0_10px_20px_rgba(0,32,69,0.15)] hover:-translate-y-0.5 transition-all flex items-center gap-2">
                                    <Plus className="w-4 h-4" /> Add New
                                </button>
                            </div>
                            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,32,69,0.03)] overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                                <th className="px-6 py-5 pl-8">Student</th>
                                                <th className="px-6 py-5">Department / Matric</th>
                                                <th className="px-6 py-5">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-sm">
                                            {(!studentList || studentList.length === 0) ? (
                                                <tr>
                                                    <td colSpan="3" className="p-10 text-center text-slate-400 font-light text-lg">No students registered yet.</td>
                                                </tr>
                                            ) : (
                                                studentList.slice(0, 5).map((student) => (
                                                    <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                                                        <td className="px-6 py-5 pl-8">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-primary font-bold overflow-hidden border border-slate-200 shadow-sm">
                                                                    <img src={student?.Profile_Img || user} alt="" className="w-full h-full object-cover" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-slate-800 text-base group-hover:text-primary transition-colors">{student?.Full_Name}</p>
                                                                    <p className="text-[10px] text-slate-500 font-light">{student?.email_address}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <p className="font-medium text-slate-600">{student?.department}</p>
                                                            <p className="text-xs text-slate-400 font-light mt-0.5">{student?.Matriculation_No}</p>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] uppercase tracking-widest font-bold rounded-full border border-emerald-100">Enrolled</span>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div onClick={() => navigate("/school/dashboard/student")} className="p-4 bg-slate-50 flex justify-center cursor-pointer border-t border-slate-100 hover:bg-slate-100 transition-colors group">
                                    <button className="text-primary font-bold text-xs uppercase tracking-widest flex items-center gap-2 group-hover:underline">
                                        View All Students <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Academic Supervisors Widget */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-serif text-slate-900">Supervisors</h2>
                                <button onClick={() => navigate("/school/dashboard/supervisor")} className="p-2 rounded-xl bg-white text-slate-400 border border-slate-200 hover:border-primary hover:text-primary transition-all shadow-sm">
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="bg-white rounded-[2rem] border border-slate-100 p-2 shadow-[0_20px_50px_rgba(0,32,69,0.03)] flex flex-col gap-1">
                                {(!schoolSupervisors || schoolSupervisors.length === 0) ? (
                                    <p className="p-8 text-center text-slate-400 font-light">No academic supervisors registered yet.</p>
                                ) : (
                                    schoolSupervisors.slice(0, 4).map((sup) => (
                                        <div key={sup.id} onClick={() => navigate("/school/dashboard/supervisor")} className="p-4 flex items-center gap-4 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer group">
                                            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm overflow-hidden shadow-sm">
                                                {sup.Profile_Img ? (
                                                    <img src={sup.Profile_Img} alt={sup.Full_Name} className="w-full h-full object-cover" />
                                                ) : (
                                                    sup.Full_Name?.charAt(0) || 'S'
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-slate-800 text-sm group-hover:text-primary transition-colors">{sup.Full_Name}</h4>
                                                <p className="text-xs text-slate-500 font-light mt-0.5">{sup.department}</p>
                                            </div>
                                            <ChevronRight className="text-slate-300 w-4 h-4 group-hover:text-primary transition-colors" />
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="bg-primary p-8 rounded-[2rem] text-white shadow-[0_20px_50px_rgba(0,32,69,0.15)] relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-pointer" onClick={() => navigate("/school/dashboard/department")}>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                                <Building className="w-8 h-8 text-white/50 mb-4" />
                                <h3 className="text-xl font-serif mb-2">Manage Departments</h3>
                                <p className="text-sm text-white/70 font-light leading-relaxed mb-6">Configure academic departments, faculties, and assignments for proper routing.</p>
                                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white">
                                    Configure <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    )
}

export default SchoolDashboard