import React from 'react';

const Logo = ({ size = 'md', className = '', title = 'SIWES Portal', subtitle = '' }) => {
    // Size mapping for the image wrapper
    const sizeClasses = {
        sm: 'w-10 h-10',
        md: 'w-14 h-14',
        lg: 'w-16 h-16'
    };

    const isEmail = typeof subtitle === 'string' && subtitle.includes('@');

    return (
        <div className={`flex items-center gap-3 min-w-0 ${className}`}>
            <div className={`${sizeClasses[size] || sizeClasses.md} flex items-center justify-center shrink-0`}>
                <img src="/logo.png" alt="SIWES Logo" className="w-full h-full object-contain" />
            </div>
            {(title || subtitle) && (
                <div className="min-w-0 flex-1 overflow-hidden">
                    {title && <h1 className="text-lg font-serif font-bold text-primary tracking-tight truncate max-w-[150px]">{title}</h1>}
                    {subtitle && (
                        <p 
                            className={`text-[10px] text-slate-400 font-bold truncate block ${isEmail ? 'lowercase tracking-normal font-medium max-w-[150px]' : 'uppercase tracking-widest'}`}
                            title={subtitle}
                        >
                            {subtitle}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Logo;
