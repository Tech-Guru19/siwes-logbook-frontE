import React, { useState } from "react";
import axios from "axios";
import { uploadImg } from "../../Cloudinary";
import { UploadCloud, X, FileUp, Loader2 } from "lucide-react";
import { useDialog } from "../../src/context/DialogContext";

const DocumentUploadModal = ({ profile, onClose, onSuccess }) => {
  const { showAlert } = useDialog();
  const [docType, setDocType] = useState("acceptance");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return showAlert("Please select a document");
    
    setLoading(true);
    try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
            const base64 = reader.result;
            const secureUrl = await uploadImg(base64);

            const payload = { student_id: profile.student_id };
            if (docType === "acceptance") payload.acceptance_letter_url = secureUrl;
            if (docType === "form8") payload.itf_form8_url = secureUrl;

            await axios.post("https://siwes-logbook-backend.onrender.com/user/student/update-details", payload);
            
            showAlert("Document uploaded successfully!");
            onSuccess();
        };
    } catch (err) {
      showAlert(err?.response?.data?.message || "Failed to upload document");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] max-w-md w-full p-8 shadow-[0_20px_60px_rgba(0,32,69,0.15)] border border-slate-100">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <h3 className="font-serif text-2xl text-primary flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <UploadCloud className="w-5 h-5 text-primary" />
            </div>
            Upload Doc
          </h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Document Type</label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all appearance-none cursor-pointer"
            >
              <option value="acceptance">Company Acceptance Letter</option>
              <option value="form8">ITF Form 8 (End of Program)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Select File</label>
            <div className="relative overflow-hidden w-full h-12 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:border-primary transition-all flex items-center">
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setFile(e.target.files[0])}
                required
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="px-4 flex items-center gap-2 pointer-events-none">
                <FileUp className="w-4 h-4 text-slate-400" />
                <span className="truncate">{file ? file.name : "Choose an image or PDF..."}</span>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || !file}
              className="w-full h-14 bg-primary text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#001530] hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(0,32,69,0.1)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</> : "Upload Document"}
              {!loading && <UploadCloud className="w-4 h-4" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentUploadModal;
