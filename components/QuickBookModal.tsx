import React from 'react';
import { X } from 'lucide-react';
import { RideRequest } from '../types';
import { QuickBookForm } from './QuickBookForm';

interface QuickBookModalProps {
  onClose: () => void;
  onSubmit: (request: Omit<RideRequest, 'id' | 'status' | 'createdAt'>) => void;
}

export const QuickBookModal: React.FC<QuickBookModalProps> = ({ onClose, onSubmit }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-gradient-to-r from-blue-600 to-blue-500">
          <h3 className="font-bold text-lg text-white">Đặt xe nhanh (Theo yêu cầu)</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 transition-colors text-white">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          <p className="text-sm text-slate-500 mb-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
            Gửi yêu cầu và tài xế phù hợp sẽ liên hệ lại với bạn ngay lập tức.
          </p>
          <QuickBookForm onSubmit={onSubmit} />
        </div>
      </div>
    </div>
  );
};