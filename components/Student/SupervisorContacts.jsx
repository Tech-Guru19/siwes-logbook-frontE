import React from "react";
import { Contact, Mail, Phone } from "lucide-react";

const SupervisorContacts = ({ profile }) => {
  if (!profile) return null;

  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,32,69,0.03)] space-y-6">
      <h3 className="text-xl font-serif text-primary flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center">
          <Contact className="text-primary w-5 h-5" />
        </div>
        Assigned Mentors
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Industry Supervisor */}
        <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl hover:border-primary/20 transition-colors group">
          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
            Industry Supervisor
          </h4>
          {profile.org_supervisor_name ? (
            <div className="space-y-3 text-sm">
              <p className="font-bold text-slate-800 text-base">{profile.org_supervisor_name}</p>
              <p className="text-slate-500 flex items-center gap-3 font-medium">
                <Mail className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                {profile.org_supervisor_email}
              </p>
              <p className="text-slate-500 flex items-center gap-3 font-medium">
                <Phone className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                {profile.org_supervisor_contact || "N/A"}
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-400 italic font-light">Not yet assigned.</p>
          )}
        </div>

        {/* Academic Supervisor */}
        <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl hover:border-primary/20 transition-colors group">
          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
            Academic Supervisor
          </h4>
          {profile.school_supervisor_name ? (
            <div className="space-y-3 text-sm">
              <p className="font-bold text-slate-800 text-base">{profile.school_supervisor_name}</p>
              <p className="text-slate-500 flex items-center gap-3 font-medium">
                <Mail className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                {profile.school_supervisor_email}
              </p>
              <p className="text-slate-500 flex items-center gap-3 font-medium">
                <Phone className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                {profile.school_supervisor_contact || "N/A"}
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-400 italic font-light">Not yet assigned.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupervisorContacts;
