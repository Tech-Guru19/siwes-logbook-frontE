import React, { useState } from "react";
import axios from "axios";
import { Landmark, X, Save } from "lucide-react";
import { useDialog } from "../../src/context/DialogContext";

const BankDetailsModal = ({ profile, onClose, onSuccess }) => {
  const { showAlert } = useDialog();
  const [bankName, setBankName] = useState(profile?.Bank_Name || "");
  const [accountNumber, setAccountNumber] = useState(profile?.account_number || "");
  const [accountName, setAccountName] = useState(profile?.account_name || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5687/user/student/update-details", {
        student_id: profile.student_id,
        bank_name: bankName,
        account_number: accountNumber,
        account_name: accountName
      });
      showAlert("Bank details updated successfully!");
      onSuccess();
    } catch (err) {
      showAlert(err?.response?.data?.message || "Failed to update details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] max-w-md w-full p-8 shadow-[0_20px_60px_rgba(0,32,69,0.15)] border border-slate-100">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <h3 className="font-serif text-2xl text-primary flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Landmark className="w-5 h-5 text-primary" />
            </div>
            Bank Details
          </h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Bank Name</label>
            <input
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="e.g. First Bank"
              required
              className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Account Number</label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="10 digit account number"
              required
              className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Account Name</label>
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="e.g. John Doe"
              required
              className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-primary text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#001530] hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(0,32,69,0.1)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {loading ? "Saving..." : "Save Details"}
              {!loading && <Save className="w-4 h-4" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BankDetailsModal;
