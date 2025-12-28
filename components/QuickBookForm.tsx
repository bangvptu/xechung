import React, { useState, useMemo } from 'react';
import { Button } from './Button';
import { MapPin, Calendar, Clock, User, Phone } from 'lucide-react';
import { POPULAR_LOCATIONS } from '../services/mockData';
import { RideRequest } from '../types';

interface QuickBookFormProps {
  onSubmit: (request: Omit<RideRequest, 'id' | 'status' | 'createdAt'>) => void;
  className?: string;
}

export const QuickBookForm: React.FC<QuickBookFormProps> = ({ onSubmit, className = '' }) => {
  const [formData, setFormData] = useState({
    passengerName: '',
    passengerPhone: '',
    origin: '',
    destination: '',
    date: new Date().toISOString().split('T')[0],
    time: '08:00',
    seats: 1,
    note: ''
  });

  const timeOptions = useMemo(() => {
    const options = [];
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 60; j += 15) {
        options.push(`${i.toString().padStart(2, '0')}:${j.toString().padStart(2, '0')}`);
      }
    }
    return options;
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      seats: Number(formData.seats)
    });
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Tên của bạn</label>
          <div className="relative">
            <User size={16} className="absolute left-3 top-3 text-slate-400" />
            <input name="passengerName" required value={formData.passengerName} onChange={handleChange} className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Nhập tên" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Số điện thoại</label>
          <div className="relative">
            <Phone size={16} className="absolute left-3 top-3 text-slate-400" />
            <input name="passengerPhone" required value={formData.passengerPhone} onChange={handleChange} className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="09xxxx" />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Điểm đón</label>
        <div className="relative">
          <MapPin size={16} className="absolute left-3 top-3 text-slate-400" />
          <input list="locations" name="origin" required value={formData.origin} onChange={handleChange} className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ví dụ: Bưu điện Bình Phước" />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Điểm đến</label>
        <div className="relative">
          <MapPin size={16} className="absolute left-3 top-3 text-slate-400" />
          <input list="locations" name="destination" required value={formData.destination} onChange={handleChange} className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ví dụ: Quận 1, TP.HCM" />
        </div>
      </div>
      <datalist id="locations">
        {POPULAR_LOCATIONS.map(loc => <option key={loc} value={loc} />)}
      </datalist>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Ngày đi</label>
          <div className="relative">
            <Calendar size={16} className="absolute left-3 top-3 text-slate-400" />
            <input type="date" name="date" required value={formData.date} onChange={handleChange} className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Giờ đi (24h)</label>
          <div className="relative">
            <Clock size={16} className="absolute left-3 top-3 text-slate-400" />
            <select
              name="time"
              required
              value={formData.time}
              onChange={handleChange}
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white text-slate-900"
            >
              {timeOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-3 pointer-events-none">
              <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Số lượng ghế</label>
        <div className="flex items-center space-x-4">
          <input type="range" name="seats" min="1" max="16" value={formData.seats} onChange={handleChange} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
          <span className="font-bold text-slate-900 w-12 text-center border border-slate-200 rounded px-2 py-1">{formData.seats}</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Ghi chú thêm</label>
        <textarea name="note" rows={2} value={formData.note} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ví dụ: Có nhiều hành lý, cần xe 7 chỗ..."></textarea>
      </div>

      <div className="pt-2">
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200">Gửi yêu cầu đặt xe</Button>
      </div>
    </form>
  );
};