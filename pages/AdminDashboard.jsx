import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../src/components/Logo';
import axios from 'axios';
import { context } from '../src/App';
import { Shield, LayoutDashboard, GraduationCap, Building2, Users, Headset, LogOut, ShieldCheck, Edit3, Trash2, X, Menu } from "lucide-react";
import { useDialog } from '../src/context/DialogContext';

const AdminDashboard = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { showAlert, showConfirm } = useDialog();
    const { adminCred } = useContext(context);
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState({ students: 0, organizations: 0, schools: 0 });
    const [students, setStudents] = useState([]);
    const [schools, setSchools] = useState([]);
    const [organizations, setOrganizations] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editType, setEditType] = useState(null); // 'students' | 'schools' | 'organizations'
    const [editData, setEditData] = useState({});
    const [editId, setEditId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!adminCred) {
            navigate('/register/accountType');
            return;
        }
        fetchAllData();
    }, [adminCred]);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const statsRes = await axios.get('http://localhost:5687/admin/dashboard-stats');
            setStats(statsRes.data.message);

            const studentsRes = await axios.post('http://localhost:5687/admin/fetch-all', { type: 'students' });
            setStudents(studentsRes.data.message);

            const schoolsRes = await axios.post('http://localhost:5687/admin/fetch-all', { type: 'schools' });
            setSchools(schoolsRes.data.message);

            const orgsRes = await axios.post('http://localhost:5687/admin/fetch-all', { type: 'organizations' });
            setOrganizations(orgsRes.data.message);

            try {
                const ticketsRes = await axios.get('http://localhost:5687/admin/tickets');
                setTickets(ticketsRes.data.message);
            } catch (err) { console.error("Error fetching tickets", err); }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleResolveTicket = async (id) => {
        const confirm = await showConfirm("Mark this ticket as resolved?");
        if (!confirm) return;
        try {
            await axios.post('http://localhost:5687/admin/tickets/resolve', { id });
            showAlert("Ticket resolved successfully.");
            fetchAllData();
        } catch (error) {
            console.error(error);
            showAlert("Error resolving ticket.");
        }
    };

    const handleDelete = async (type, id) => {
        const confirm = await showConfirm("Are you sure you want to delete this record? This action cannot be undone.");
        if (!confirm) return;
        
        try {
            await axios.post('http://localhost:5687/admin/delete', { type, id });
            showAlert("Record deleted successfully.");
            fetchAllData();
        } catch (error) {
            console.error(error);
            showAlert("Error deleting record.");
        }
    };

    const openEditModal = (type, record) => {
        setEditType(type);
        setEditId(record.id);
        setEditData(record);
        setIsEditModalOpen(true);
    };

    const handleEditChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const submitEdit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axios.post('http://localhost:5687/admin/update', { 
                type: editType, 
                id: editId, 
                data: editData 
            });
            showAlert("Record updated successfully.");
            setIsEditModalOpen(false);
            fetchAllData();
        } catch (error) {
            console.error(error);
            showAlert("Error updating record.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FDFDFB] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <ShieldCheck className="w-12 h-12 text-primary animate-pulse" />
                    <div className="font-bold text-slate-400 text-sm uppercase tracking-widest animate-pulse">Loading Super Admin Data...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex bg-[#FDFDFB] min-h-screen font-sans selection:bg-primary/20 text-slate-600">
            {/* Premium Sidebar */}
            {mobileMenuOpen && <div className="fixed inset-0 bg-slate-900/20 z-40 lg:hidden backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>}
        <aside className={`h-screen w-72 border-r border-slate-100 fixed left-0 top-0 bg-white flex flex-col py-8 z-50 shadow-[4px_0_24px_rgba(0,32,69,0.02)] transition-transform duration-300 lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <Logo size="md" className="px-8 mb-12" title="Super Admin" subtitle={adminCred?.email} />
        <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden absolute top-8 right-6 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
          <X className="w-5 h-5" />
        </button>

                <nav className="flex-grow flex flex-col px-4 gap-2 overflow-y-auto custom-scrollbar">
                    <button 
                        onClick={() => setActiveTab('overview')}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm transition-all text-left font-medium ${
                            activeTab === 'overview' ? 'bg-primary/5 text-primary font-bold shadow-sm' : 'text-slate-500 hover:bg-primary/5 hover:text-primary'
                        }`}
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        System Overview
                    </button>
                    <button 
                        onClick={() => setActiveTab('schools')}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm transition-all text-left font-medium ${
                            activeTab === 'schools' ? 'bg-primary/5 text-primary font-bold shadow-sm' : 'text-slate-500 hover:bg-primary/5 hover:text-primary'
                        }`}
                    >
                        <GraduationCap className="w-5 h-5" />
                        Registered Schools
                    </button>
                    <button 
                        onClick={() => setActiveTab('organizations')}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm transition-all text-left font-medium ${
                            activeTab === 'organizations' ? 'bg-primary/5 text-primary font-bold shadow-sm' : 'text-slate-500 hover:bg-primary/5 hover:text-primary'
                        }`}
                    >
                        <Building2 className="w-5 h-5" />
                        Organizations
                    </button>
                    <button 
                        onClick={() => setActiveTab('students')}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm transition-all text-left font-medium ${
                            activeTab === 'students' ? 'bg-primary/5 text-primary font-bold shadow-sm' : 'text-slate-500 hover:bg-primary/5 hover:text-primary'
                        }`}
                    >
                        <Users className="w-5 h-5" />
                        Global Students
                    </button>
                    <button 
                        onClick={() => setActiveTab('support')}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm transition-all text-left font-medium ${
                            activeTab === 'support' ? 'bg-primary/5 text-primary font-bold shadow-sm' : 'text-slate-500 hover:bg-primary/5 hover:text-primary'
                        }`}
                    >
                        <Headset className="w-5 h-5" />
                        Support Tickets
                    </button>
                </nav>

                <div className="mt-auto px-4 space-y-4">
                    <div className="pt-4 border-t border-slate-100">
                        <button 
                            onClick={() => navigate('/Admin')} 
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-rose-500 bg-rose-50 hover:bg-rose-100 transition-colors rounded-xl font-bold text-xs uppercase tracking-widest"
                        >
                            <LogOut className="w-4 h-4" /> Secure Sign Out
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
                        <h1 className="text-3xl md:text-4xl font-serif text-slate-900">Welcome back, Super Admin</h1>
                        <p className="text-slate-500 font-light mt-2">{adminCred?.email}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm shrink-0">
                            <ShieldCheck className="w-7 h-7" />
                        </div>
                    </div>
                </div>

                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,32,69,0.03)] flex items-center gap-6 group hover:-translate-y-1 transition-all">
                            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Users className="w-7 h-7" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Students</p>
                                <h3 className="text-4xl font-serif text-slate-800">{stats.students}</h3>
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,32,69,0.03)] flex items-center gap-6 group hover:-translate-y-1 transition-all">
                            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Building2 className="w-7 h-7" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Organizations</p>
                                <h3 className="text-4xl font-serif text-slate-800">{stats.organizations}</h3>
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,32,69,0.03)] flex items-center gap-6 group hover:-translate-y-1 transition-all">
                            <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <GraduationCap className="w-7 h-7" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Institutions</p>
                                <h3 className="text-4xl font-serif text-slate-800">{stats.schools}</h3>
                            </div>
                        </div>
                    </div>
                )}

                {/* SCHOOLS TAB */}
                {activeTab === 'schools' && (
                    <section className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,32,69,0.03)] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="p-8 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                            <h2 className="text-xl font-serif text-slate-900 flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                    <GraduationCap className="w-5 h-5 text-primary" />
                                </div>
                                Registered Institutions
                            </h2>
                            <span className="text-[10px] uppercase tracking-widest font-bold px-4 py-2 bg-blue-50 text-blue-600 rounded-full shadow-sm">{schools.length} Schools</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 text-[10px] text-slate-400 font-bold uppercase tracking-widest border-b border-slate-100">
                                        <th className="px-6 py-5 pl-8">ID</th>
                                        <th className="px-6 py-5">Institution Name</th>
                                        <th className="px-6 py-5">Admin Email</th>
                                        <th className="px-6 py-5">Location</th>
                                        <th className="px-6 py-5 pr-8 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {schools.map(school => (
                                        <tr key={school.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-5 pl-8 font-mono text-xs text-slate-400">#{school.id}</td>
                                            <td className="px-6 py-5 font-bold text-slate-800">{school.Name}</td>
                                            <td className="px-6 py-5 text-slate-500 font-light">{school.Mail}</td>
                                            <td className="px-6 py-5 text-slate-500 font-light">{school.Location || 'N/A'}</td>
                                            <td className="px-6 py-5 pr-8 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => openEditModal('schools', school)} className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-primary hover:border-primary hover:shadow-sm flex items-center justify-center transition-all" title="Edit">
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete('schools', school.id)} className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 hover:shadow-sm flex items-center justify-center transition-all" title="Delete">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {schools.length === 0 && (
                                        <tr><td colSpan="5" className="p-10 text-center text-slate-400 font-light text-lg">No institutions registered yet.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {/* ORGANIZATIONS TAB */}
                {activeTab === 'organizations' && (
                    <section className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,32,69,0.03)] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="p-8 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                            <h2 className="text-xl font-serif text-slate-900 flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                    <Building2 className="w-5 h-5 text-primary" />
                                </div>
                                Registered Organizations
                            </h2>
                            <span className="text-[10px] uppercase tracking-widest font-bold px-4 py-2 bg-blue-50 text-blue-600 rounded-full shadow-sm">{organizations.length} Organizations</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 text-[10px] text-slate-400 font-bold uppercase tracking-widest border-b border-slate-100">
                                        <th className="px-6 py-5 pl-8">ID</th>
                                        <th className="px-6 py-5">Organization Name</th>
                                        <th className="px-6 py-5">Coordinator Email</th>
                                        <th className="px-6 py-5">Address</th>
                                        <th className="px-6 py-5 pr-8 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {organizations.map(org => (
                                        <tr key={org.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-5 pl-8 font-mono text-xs text-slate-400">#{org.id}</td>
                                            <td className="px-6 py-5 font-bold text-slate-800">{org.Name}</td>
                                            <td className="px-6 py-5 text-slate-500 font-light">{org.Email_Address}</td>
                                            <td className="px-6 py-5 text-slate-500 font-light">{org.Contact_Address || 'N/A'}</td>
                                            <td className="px-6 py-5 pr-8 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => openEditModal('organizations', org)} className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-primary hover:border-primary hover:shadow-sm flex items-center justify-center transition-all" title="Edit">
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete('organizations', org.id)} className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 hover:shadow-sm flex items-center justify-center transition-all" title="Delete">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {organizations.length === 0 && (
                                        <tr><td colSpan="5" className="p-10 text-center text-slate-400 font-light text-lg">No organizations registered yet.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {/* STUDENTS TAB */}
                {activeTab === 'students' && (
                    <section className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,32,69,0.03)] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="p-8 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                            <h2 className="text-xl font-serif text-slate-900 flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                    <Users className="w-5 h-5 text-primary" />
                                </div>
                                Global Student Directory
                            </h2>
                            <span className="text-[10px] uppercase tracking-widest font-bold px-4 py-2 bg-blue-50 text-blue-600 rounded-full shadow-sm">{students.length} Students</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 text-[10px] text-slate-400 font-bold uppercase tracking-widest border-b border-slate-100">
                                        <th className="px-6 py-5 pl-8">ID</th>
                                        <th className="px-6 py-5">Student Name</th>
                                        <th className="px-6 py-5">Matric No</th>
                                        <th className="px-6 py-5">Email</th>
                                        <th className="px-6 py-5">Department</th>
                                        <th className="px-6 py-5 pr-8 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {students.map(student => (
                                        <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-5 pl-8 font-mono text-xs text-slate-400">#{student.id}</td>
                                            <td className="px-6 py-5 font-bold text-slate-800">{student.Full_Name}</td>
                                            <td className="px-6 py-5 font-mono text-slate-500 font-light">{student.Matriculation_No}</td>
                                            <td className="px-6 py-5 text-slate-500 font-light">{student.email_address}</td>
                                            <td className="px-6 py-5 text-slate-500 font-light">
                                                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold border border-slate-200 uppercase tracking-widest">{student.department || 'N/A'}</span>
                                            </td>
                                            <td className="px-6 py-5 pr-8 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => openEditModal('students', student)} className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-primary hover:border-primary hover:shadow-sm flex items-center justify-center transition-all" title="Edit">
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete('students', student.id)} className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 hover:shadow-sm flex items-center justify-center transition-all" title="Delete">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {students.length === 0 && (
                                        <tr><td colSpan="6" className="p-10 text-center text-slate-400 font-light text-lg">No students registered yet.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {/* SUPPORT TICKETS TAB */}
                {activeTab === 'support' && (
                    <section className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,32,69,0.03)] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="p-8 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                            <h2 className="text-xl font-serif text-slate-900 flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                    <Headset className="w-5 h-5 text-primary" />
                                </div>
                                Support Tickets
                            </h2>
                            <span className="text-[10px] uppercase tracking-widest font-bold px-4 py-2 bg-blue-50 text-blue-600 rounded-full shadow-sm">{tickets.length} Tickets</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 text-[10px] text-slate-400 font-bold uppercase tracking-widest border-b border-slate-100">
                                        <th className="px-6 py-5 pl-8">Ticket ID</th>
                                        <th className="px-6 py-5">User / Subject</th>
                                        <th className="px-6 py-5">Message</th>
                                        <th className="px-6 py-5">Status</th>
                                        <th className="px-6 py-5 pr-8 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {tickets.map(ticket => (
                                        <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-5 pl-8 font-mono text-xs text-slate-400">#{ticket.id}</td>
                                            <td className="px-6 py-5">
                                                <div className="font-bold text-slate-800">{ticket.subject}</div>
                                                <div className="text-xs text-slate-500 font-light mt-1">{ticket.user_email || ticket.email}</div>
                                            </td>
                                            <td className="px-6 py-5 text-slate-500 font-light max-w-xs truncate" title={ticket.description || ticket.message}>{ticket.description || ticket.message}</td>
                                            <td className="px-6 py-5">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${ticket.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${ticket.status === 'Resolved' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                                    {ticket.status || 'Pending'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 pr-8 text-right">
                                                {ticket.status !== 'Resolved' && (
                                                    <button onClick={() => handleResolveTicket(ticket.id)} className="bg-primary text-white text-[10px] uppercase tracking-widest font-bold px-4 py-2 rounded-xl shadow-sm hover:bg-[#001530] hover:shadow-md hover:-translate-y-0.5 transition-all opacity-0 group-hover:opacity-100">
                                                        Resolve
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {tickets.length === 0 && (
                                        <tr><td colSpan="5" className="p-10 text-center text-slate-400 font-light text-lg">No support tickets at the moment.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}
            </main>

            {/* EDIT MODAL */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
                        <div className="p-8 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                            <h2 className="text-2xl font-serif text-slate-900">Edit Record</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 flex items-center justify-center transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <form onSubmit={submitEdit} className="p-8 space-y-6">
                            {editType === 'schools' && (
                                <>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Institution Name</label>
                                        <input type="text" name="Name" value={editData.Name || ''} onChange={handleEditChange} className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-slate-800" required />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                                        <input type="email" name="Mail" value={editData.Mail || ''} onChange={handleEditChange} className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-slate-800" required />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Location</label>
                                        <input type="text" name="Location" value={editData.Location || ''} onChange={handleEditChange} className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-slate-800" />
                                    </div>
                                </>
                            )}
                            {editType === 'organizations' && (
                                <>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Organization Name</label>
                                        <input type="text" name="Name" value={editData.Name || ''} onChange={handleEditChange} className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-slate-800" required />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                                        <input type="email" name="Email_Address" value={editData.Email_Address || ''} onChange={handleEditChange} className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-slate-800" required />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Address</label>
                                        <input type="text" name="Contact_Address" value={editData.Contact_Address || ''} onChange={handleEditChange} className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-slate-800" />
                                    </div>
                                </>
                            )}
                            {editType === 'students' && (
                                <>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                                        <input type="text" name="Full_Name" value={editData.Full_Name || ''} onChange={handleEditChange} className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-slate-800" required />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                                        <input type="email" name="email_address" value={editData.email_address || ''} onChange={handleEditChange} className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-slate-800" required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Matric No</label>
                                            <input type="text" name="Matriculation_No" value={editData.Matriculation_No || ''} onChange={handleEditChange} className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-slate-800" required />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Department</label>
                                            <input type="text" name="department" value={editData.department || ''} onChange={handleEditChange} className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-slate-800" />
                                        </div>
                                    </div>
                                </>
                            )}
                            <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-6 h-12 font-bold text-xs uppercase tracking-widest text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={submitting} className="px-6 h-12 font-bold text-xs uppercase tracking-widest text-white bg-primary rounded-xl hover:bg-[#001530] hover:shadow-[0_10px_20px_rgba(0,32,69,0.15)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none">
                                    {submitting ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
