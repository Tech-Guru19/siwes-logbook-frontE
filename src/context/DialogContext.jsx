import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Info } from 'lucide-react';

const DialogContext = createContext();

export const useDialog = () => {
    const context = useContext(DialogContext);
    if (!context) {
        throw new Error('useDialog must be used within a DialogProvider');
    }
    return context;
};

export const DialogProvider = ({ children }) => {
    const [dialog, setDialog] = useState(null);
    const [inputValue, setInputValue] = useState('');

    const showAlert = useCallback((message) => {
        return new Promise((resolve) => {
            setDialog({
                type: 'alert',
                message,
                resolve,
            });
        });
    }, []);

    const showConfirm = useCallback((message) => {
        return new Promise((resolve) => {
            setDialog({
                type: 'confirm',
                message,
                resolve,
            });
        });
    }, []);

    const showPrompt = useCallback((message, defaultValue = '') => {
        return new Promise((resolve) => {
            setInputValue(defaultValue);
            setDialog({
                type: 'prompt',
                message,
                resolve,
            });
        });
    }, []);

    const handleClose = (result) => {
        if (dialog?.resolve) {
            dialog.resolve(result);
        }
        setDialog(null);
        setInputValue('');
    };

    return (
        <DialogContext.Provider value={{ showAlert, showConfirm, showPrompt }}>
            {children}
            <AnimatePresence>
                {dialog && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                            onClick={() => handleClose(dialog.type === 'prompt' ? null : false)}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            transition={{ type: "spring", duration: 0.4, bounce: 0.3 }}
                            className="relative w-full max-w-sm bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,32,69,0.1)] overflow-hidden border border-slate-100"
                        >
                            <div className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        {dialog.type === 'alert' && <AlertCircle className="w-5 h-5 text-primary" />}
                                        {dialog.type === 'confirm' && <Info className="w-5 h-5 text-primary" />}
                                        {dialog.type === 'prompt' && <Info className="w-5 h-5 text-primary" />}
                                    </div>
                                    <div className="flex-1 mt-1">
                                        <h3 className="text-lg font-semibold text-slate-800 leading-none mb-2">
                                            {dialog.type === 'alert' ? 'Notification' : 
                                             dialog.type === 'confirm' ? 'Confirmation' : 'Input Required'}
                                        </h3>
                                        <p className="text-sm text-slate-500 leading-relaxed mb-4">
                                            {dialog.message}
                                        </p>
                                        
                                        {dialog.type === 'prompt' && (
                                            <input
                                                autoFocus
                                                type="text"
                                                className="w-full h-11 px-4 mb-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-slate-800"
                                                value={inputValue}
                                                onChange={(e) => setInputValue(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') handleClose(inputValue);
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                                {dialog.type !== 'alert' && (
                                    <button
                                        onClick={() => handleClose(dialog.type === 'prompt' ? null : false)}
                                        className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button
                                    onClick={() => handleClose(dialog.type === 'prompt' ? inputValue : true)}
                                    className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-[#001530] hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
                                >
                                    {dialog.type === 'alert' ? 'Okay' : 'Confirm'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </DialogContext.Provider>
    );
};
