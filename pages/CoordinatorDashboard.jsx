import React from "react";
import { 
    GraduationCap, LayoutDashboard, FileSignature, Users, 
    Settings, HelpCircle, LogOut, Search, Download, Plus, 
    UsersRound, Clock, CheckCircle2, AlertTriangle, Filter, 
    AlertCircle, Check, CalendarClock 
} from "lucide-react";

const CoordinatorDashboard = () => {
    return (
        <div className="flex bg-[#FDFDFB] min-h-screen font-sans selection:bg-primary/20 text-slate-600">
            {/* Premium Sidebar */}
            <aside className="h-screen w-72 border-r border-slate-100 fixed left-0 top-0 bg-white flex flex-col py-8 z-40 shadow-[4px_0_24px_rgba(0,32,69,0.02)] hidden lg:flex">
                <div className="px-8 mb-12 flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                        <GraduationCap className="text-white w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-lg font-serif font-bold text-primary tracking-tight">SIWES Portal</h1>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Academic Mgmt</p>
                    </div>
                </div>

                <nav className="flex-grow flex flex-col px-4 gap-2">
                    <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm transition-all text-left bg-primary/5 text-primary font-bold shadow-sm">
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard Overview
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm transition-all text-left text-slate-500 font-medium hover:bg-primary/5 hover:text-primary">
                        <FileSignature className="w-5 h-5" />
                        Daily Logs Review
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm transition-all text-left text-slate-500 font-medium hover:bg-primary/5 hover:text-primary">
                        <Users className="w-5 h-5" />
                        Supervision Roster
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm transition-all text-left text-slate-500 font-medium hover:bg-primary/5 hover:text-primary">
                        <Settings className="w-5 h-5" />
                        System Settings
                    </button>
                </nav>

                <div className="mt-auto px-4 space-y-2">
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-3 text-slate-500 hover:text-primary hover:bg-primary/5 transition-colors rounded-xl font-bold text-xs uppercase tracking-widest">
                        <HelpCircle className="w-4 h-4" />
                        Help Center
                    </button>
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-3 text-rose-500 bg-rose-50 hover:bg-rose-100 transition-colors rounded-xl font-bold text-xs uppercase tracking-widest">
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="lg:ml-72 flex-1 p-6 lg:p-12 xl:p-16 space-y-12 max-w-[1400px]">
                
                {/* Header Banner */}
                <div className="bg-white p-8 lg:p-10 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,32,69,0.03)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    
                    <div className="relative z-10 flex items-center gap-6">
                        <img
                            alt="User profile avatar"
                            className="w-16 h-16 rounded-2xl border-2 border-white shadow-md object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC97-1S91-fUVlzeMumw0HaRL2XCVKIXCY2iTJq8O7fzcg88JqgbJLssVIhUy_y4-_1TK2v-AFMXnsXSaomhRwRS2naLYpcqQ_DAQBvcEaczm7bTLicEE9Tj72N9Ou3lb14AlOdxRWxVoq-UutC8gpe9LYkrsHI7eYsLn-Y7MOoyNqUHTLAx3ibpeIkcOTtTzE_KDqwotiU1tBaDOz3xd2BEi3hT2NbFsUDZ215Z_qVA0bnSqQglGjEzNTxQx2eTLWruv1Kfr2CgYoZ"
                        />
                        <div>
                            <h1 className="text-3xl font-serif text-slate-900 mb-1">Welcome, Dr. Sarah Jenkins</h1>
                            <p className="text-slate-500 font-light text-sm">SIWES Departmental Coordinator</p>
                        </div>
                    </div>

                    <div className="relative z-10 w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input 
                            className="w-full pl-12 pr-4 h-14 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-slate-700" 
                            placeholder="Search student records..." 
                            type="text" 
                        />
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-serif text-slate-900">Student Supervision Overview</h2>
                            <p className="text-sm text-slate-500 mt-2 font-light">Overseeing 24 students across 3 departments for the 2024 SIWES Session.</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="bg-white border border-slate-200 px-6 h-12 rounded-xl text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 text-slate-600 hover:bg-slate-50 hover:shadow-sm transition-all">
                                <Download className="w-4 h-4" />
                                Export
                            </button>
                            <button className="bg-primary text-white px-6 h-12 rounded-xl text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 hover:bg-[#001530] hover:shadow-[0_10px_20px_rgba(0,32,69,0.15)] hover:-translate-y-0.5 transition-all">
                                <Plus className="w-4 h-4" />
                                Schedule Review
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:-translate-y-1 transition-transform group">
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <UsersRound className="text-indigo-500 w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-100">
                                    Active
                                </span>
                            </div>
                            <h3 className="text-4xl font-serif text-slate-900 mb-1">24</h3>
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Assigned Students</p>
                        </div>

                        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:-translate-y-1 transition-transform group">
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Clock className="text-amber-500 w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-widest border border-amber-100">
                                    Action Required
                                </span>
                            </div>
                            <h3 className="text-4xl font-serif text-slate-900 mb-1">12</h3>
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Pending Reviews</p>
                        </div>

                        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:-translate-y-1 transition-transform group">
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <CheckCircle2 className="text-emerald-500 w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-100">
                                    Compliant
                                </span>
                            </div>
                            <h3 className="text-4xl font-serif text-slate-900 mb-1">82%</h3>
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Completion Rate</p>
                        </div>

                        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:-translate-y-1 transition-transform group">
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <AlertTriangle className="text-rose-500 w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full uppercase tracking-widest border border-rose-100">
                                    Critical
                                </span>
                            </div>
                            <h3 className="text-4xl font-serif text-slate-900 mb-1">3</h3>
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Not Reporting</p>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white border border-slate-100 rounded-[2rem] shadow-[0_20px_50px_rgba(0,32,69,0.03)] overflow-hidden">
                        <div className="p-8 border-b border-slate-100 flex flex-wrap items-center justify-between gap-6">
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="flex items-center gap-3 px-4 h-12 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600">
                                    <Filter className="text-slate-400 w-4 h-4" />
                                    <span className="font-bold text-[10px] uppercase tracking-widest">Dept:</span>
                                    <select className="bg-transparent border-none p-0 text-sm focus:ring-0 cursor-pointer text-primary font-bold outline-none">
                                        <option>All Departments</option>
                                        <option>Computer Science</option>
                                        <option>Mechanical Engineering</option>
                                        <option>Architecture</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-3 px-4 h-12 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600">
                                    <span className="font-bold text-[10px] uppercase tracking-widest">Status:</span>
                                    <select className="bg-transparent border-none p-0 text-sm focus:ring-0 cursor-pointer text-primary font-bold outline-none">
                                        <option>All Statuses</option>
                                        <option>On Track</option>
                                        <option>Pending Action</option>
                                        <option>At Risk</option>
                                    </select>
                                </div>
                            </div>
                            <div className="text-xs font-bold uppercase tracking-widest text-slate-400 bg-slate-50 px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                                Showing <span className="text-slate-800">10</span> of 24 students
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                        <th className="p-5 pl-8">Student Name</th>
                                        <th className="p-5">Department</th>
                                        <th className="p-5">Organization</th>
                                        <th className="p-5">Progress Summary</th>
                                        <th className="p-5 pr-8 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    <tr className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-5 pl-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm border border-indigo-100 shadow-sm">
                                                    AA
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 text-base">Adebayo, Ayomide</p>
                                                    <p className="text-xs text-slate-500 font-light mt-0.5">CSC/2021/043</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5 font-medium text-slate-600">Computer Science</td>
                                        <td className="p-5 font-medium text-slate-600">Mainframe Solutions Ltd.</td>
                                        <td className="p-5">
                                            <div className="px-3 py-1 w-max rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 border border-amber-100">
                                                <AlertCircle className="w-3.5 h-3.5" />
                                                3 PENDING LOGS
                                            </div>
                                        </td>
                                        <td className="p-5 pr-8 text-right">
                                            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm text-xs font-bold uppercase tracking-widest rounded-xl transition-all">Review</button>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-5 pl-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm border border-emerald-100 shadow-sm">
                                                    BT
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 text-base">Benson, Tamara</p>
                                                    <p className="text-xs text-slate-500 font-light mt-0.5">MEE/2021/112</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5 font-medium text-slate-600">Mechanical Eng.</td>
                                        <td className="p-5 font-medium text-slate-600">Dangote Refinery</td>
                                        <td className="p-5">
                                            <div className="px-3 py-1 w-max rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 border border-emerald-100">
                                                <Check className="w-3.5 h-3.5" />
                                                ON TRACK
                                            </div>
                                        </td>
                                        <td className="p-5 pr-8 text-right">
                                            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm text-xs font-bold uppercase tracking-widest rounded-xl transition-all">Review</button>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-5 pl-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-sm border border-sky-100 shadow-sm">
                                                    CI
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 text-base">Chukwu, Ikechukwu</p>
                                                    <p className="text-xs text-slate-500 font-light mt-0.5">ARC/2021/015</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5 font-medium text-slate-600">Architecture</td>
                                        <td className="p-5 font-medium text-slate-600">Urban Designs Studio</td>
                                        <td className="p-5">
                                            <div className="px-3 py-1 w-max rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 border border-amber-100">
                                                <CalendarClock className="w-3.5 h-3.5" />
                                                1 PENDING LOG
                                            </div>
                                        </td>
                                        <td className="p-5 pr-8 text-right">
                                            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm text-xs font-bold uppercase tracking-widest rounded-xl transition-all">Review</button>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-5 pl-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm border border-purple-100 shadow-sm">
                                                    DL
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 text-base">David, Lawal</p>
                                                    <p className="text-xs text-slate-500 font-light mt-0.5">CSC/2021/098</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5 font-medium text-slate-600">Computer Science</td>
                                        <td className="p-5 font-medium text-slate-600">Interswitch Group</td>
                                        <td className="p-5">
                                            <div className="px-3 py-1 w-max rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 border border-emerald-100">
                                                <Check className="w-3.5 h-3.5" />
                                                ON TRACK
                                            </div>
                                        </td>
                                        <td className="p-5 pr-8 text-right">
                                            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm text-xs font-bold uppercase tracking-widest rounded-xl transition-all">Review</button>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-5 pl-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-sm border border-rose-100 shadow-sm">
                                                    ES
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 text-base">Eze, Somto</p>
                                                    <p className="text-xs text-slate-500 font-light mt-0.5">MEE/2021/022</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5 font-medium text-slate-600">Mechanical Eng.</td>
                                        <td className="p-5 font-medium text-slate-600">Shell Nigeria</td>
                                        <td className="p-5">
                                            <div className="px-3 py-1 w-max rounded-full bg-rose-50 text-rose-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 border border-rose-100">
                                                <AlertTriangle className="w-3.5 h-3.5" />
                                                7 DAYS NO LOG
                                            </div>
                                        </td>
                                        <td className="p-5 pr-8 text-right">
                                            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm text-xs font-bold uppercase tracking-widest rounded-xl transition-all">Review</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Pagination */}
                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                Page 1 of 3
                            </p>
                            <div className="flex gap-2">
                                <button className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-400 bg-slate-100 cursor-not-allowed">
                                    Prev
                                </button>
                                <button className="px-4 py-2 bg-primary text-white border border-primary rounded-xl text-xs font-bold uppercase tracking-widest shadow-[0_5px_15px_rgba(0,32,69,0.15)]">
                                    1
                                </button>
                                <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-colors">
                                    2
                                </button>
                                <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-colors">
                                    3
                                </button>
                                <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default CoordinatorDashboard;
