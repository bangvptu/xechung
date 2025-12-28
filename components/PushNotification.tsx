import React, { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';

interface PushNotificationProps {
  title: string;
  message: string;
  timestamp?: string;
  onClose: () => void;
  visible: boolean;
}

export const PushNotification: React.FC<PushNotificationProps> = ({ 
  title, 
  message, 
  timestamp = 'Bây giờ', 
  onClose,
  visible 
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
      // Auto hide after 6 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 300); // Wait for animation
  };

  if (!visible && !show) return null;

  return (
    <div 
      className={`fixed top-4 right-4 z-[100] w-full max-w-sm transition-all duration-500 ease-in-out transform ${
        show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="bg-white/90 backdrop-blur-md border border-slate-200 shadow-2xl rounded-2xl overflow-hidden cursor-pointer hover:bg-white transition-colors" onClick={handleClose}>
        <div className="p-4 flex gap-3">
          {/* App Icon / Avatar */}
          <div className="shrink-0">
             <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-200">
                <Bell size={20} fill="currentColor" />
             </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-0.5">
               <h4 className="font-bold text-slate-900 text-sm truncate pr-2">{title}</h4>
               <span className="text-[10px] text-slate-400 shrink-0">{timestamp}</span>
            </div>
            <p className="text-slate-600 text-sm leading-snug line-clamp-2">
              {message}
            </p>
          </div>
          
          {/* Close button */}
          <button 
            onClick={(e) => { e.stopPropagation(); handleClose(); }}
            className="text-slate-400 hover:text-slate-600 shrink-0 self-start -mr-1 -mt-1 p-1"
          >
            <X size={14} />
          </button>
        </div>
        
        {/* Progress bar simulation */}
        <div className="h-1 w-full bg-slate-100">
           <div className={`h-full bg-primary-500 rounded-r-full transition-all duration-[6000ms] ease-linear ${show ? 'w-full' : 'w-0'}`} />
        </div>
      </div>
      
      {/* Simulation Label */}
      <div className="text-right mt-1 pr-2">
         <span className="text-[10px] bg-black/50 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
           Mô phỏng: App Tài xế
         </span>
      </div>
    </div>
  );
};