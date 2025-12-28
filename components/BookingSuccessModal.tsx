import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from './Button';

interface BookingSuccessModalProps {
  onClose: () => void;
  title?: string;
  message?: string;
  subMessage?: string;
}

export const BookingSuccessModal: React.FC<BookingSuccessModalProps> = ({ 
  onClose, 
  title = 'Gửi yêu cầu thành công!',
  message = 'Hệ thống đã ghi nhận thông tin của bạn.',
  subMessage = 'Các tài xế phù hợp sẽ liên hệ với bạn trong ít phút tới.'
}) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center animate-in zoom-in-95 duration-200 border-2 border-green-100">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm ring-4 ring-green-50">
          <CheckCircle size={48} strokeWidth={3} />
        </div>
        
        <h3 className="text-2xl font-bold text-slate-800 mb-2">{title}</h3>
        
        <div className="space-y-2 mb-8">
            <p className="text-slate-600 font-medium">{message}</p>
            <p className="text-sm text-slate-400">{subMessage}</p>
        </div>
        
        <Button onClick={onClose} className="w-full bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200 py-3 text-lg">
          Hoàn tất
        </Button>
      </div>
    </div>
  );
};