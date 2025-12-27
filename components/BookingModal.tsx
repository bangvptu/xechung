import React, { useState } from 'react';
import { Ride } from '../types';
import { Button } from './Button';
import { X } from 'lucide-react';

interface BookingModalProps {
  ride: Ride | null;
  onClose: () => void;
  onConfirm: (passengerName: string, passengerPhone: string, seats: number) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ ride, onClose, onConfirm }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [seats, setSeats] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!ride) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API delay
    setTimeout(() => {
      onConfirm(name, phone, seats);
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-lg text-slate-800">Xác nhận đặt chỗ</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-4">
            <p className="text-sm text-blue-800 font-medium">Chuyến đi: {ride.origin} → {ride.destination}</p>
            <p className="text-xs text-blue-600 mt-1">
              {new Date(ride.date).toLocaleDateString('vi-VN')} lúc {ride.time} • {ride.price.toLocaleString('vi-VN')}đ/khách
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Họ và tên</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
              placeholder="Nhập tên của bạn"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Số điện thoại</label>
            <input
              type="tel"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
              placeholder="0912..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Số lượng ghế</label>
             <div className="flex items-center space-x-3">
               <button 
                type="button" 
                className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center hover:bg-slate-100 disabled:opacity-50"
                onClick={() => setSeats(Math.max(1, seats - 1))}
                disabled={seats <= 1}
               >
                 -
               </button>
               <span className="font-semibold text-lg w-6 text-center">{seats}</span>
               <button 
                type="button" 
                className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center hover:bg-slate-100 disabled:opacity-50"
                onClick={() => setSeats(Math.min(ride.seatsAvailable, seats + 1))}
                disabled={seats >= ride.seatsAvailable}
               >
                 +
               </button>
               <span className="text-sm text-slate-500 ml-auto">Tổng: {(ride.price * seats).toLocaleString('vi-VN')}đ</span>
             </div>
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              Xác nhận đặt vé
            </Button>
            <p className="text-xs text-center text-slate-500 mt-2">
              Tài xế sẽ liên hệ với bạn qua số điện thoại để đón.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};