import React, { useState } from "react";
import axios from "axios";
import { CalendarOff, X, Send } from "lucide-react";

const LeaveRequestModal = ({ profile, onClose, onSuccess }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason) return alert("Please fill all fields");
    
    setLoading(true);
    try {
      await axios.post("https://siwes-logbook-backend.onrender.com/leave/request", {
        student_id: profile.student_id,
        start_date: startDate,
        end_date: endDate,
        reason: reason
      });
      alert("Leave request submitted successfully!");
      onSuccess();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to submit leave request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] max-w-md w-full p-8 shadow-[0_20px_60px_rgba(0,32,69,0.15)] border border-slate-100">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <h3 className="font-serif text-2xl text-primary flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center">
              <CalendarOff className="w-5 h-5 text-rose-500" />
            </div>
            Request Leave
          </h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all cursor-pointer"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Reason for Leave</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide a detailed reason for your absence..."
              required
              rows={4}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all resize-none"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-primary text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#001530] hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(0,32,69,0.1)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {loading ? "Submitting..." : "Submit Request"}
              {!loading && <Send className="w-4 h-4" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveRequestModal;
