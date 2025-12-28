import React, { useState } from 'react';
import { RideType, Ride, Driver, Vehicle } from '../types';
import { Button } from './Button';
import { X } from 'lucide-react';
import { POPULAR_LOCATIONS } from '../services/mockData';

interface PostRideModalProps {
  onClose: () => void;
  onSubmit: (newRide: Omit<Ride, 'id' | 'driverRating'>) => void;
  availableDrivers: Driver[];
  availableVehicles: Vehicle[];
}

export const PostRideModal: React.FC<PostRideModalProps> = ({ 
  onClose, 
  onSubmit, 
  availableDrivers, 
  availableVehicles 
}) => {
  const [formData, setFormData] = useState({
    driverName: '',
    driverPhone: '',
    origin: '',
    destination: '',
    date: new Date().toISOString().split('T')[0],
    time: '08:00',
    price: 0,
    seatsAvailable: 3,
    totalSeats: 4,
    carModel: '',
    licensePlate: '',
    type: RideType.SHARED,
    description: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectDriver = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const driverId = e.target.value;
    const driver = availableDrivers.find(d => d.id === driverId);
    if (driver) {
      setFormData(prev => ({ ...prev, driverName: driver.name, driverPhone: driver.phone }));
    }
  };

  const handleSelectVehicle = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const vehicleId = e.target.value;
    const vehicle = availableVehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      // Estimate total seats based on type string (e.g. "7 chỗ" -> 7)
      const seats = parseInt(vehicle.type) || 4;
      setFormData(prev => ({ 
        ...prev, 
        carModel: vehicle.model, 
        licensePlate: vehicle.licensePlate,
        totalSeats: seats,
        seatsAvailable: Math.max(1, seats - 1)
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: Number(formData.price),
      seatsAvailable: Number(formData.seatsAvailable),
      totalSeats: Number(formData.totalSeats)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-primary-50">
          <h3 className="font-bold text-lg text-primary-900">Đăng tin tìm khách</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Driver Info */}
            <div className="md:col-span-2 flex justify-between items-center">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Thông tin tài xế</h4>
              {availableDrivers.length > 0 && (
                <select onChange={handleSelectDriver} className="text-xs border-slate-200 rounded-lg p-1 bg-slate-50 text-slate-600 outline-none">
                  <option value="">-- Chọn tài xế có sẵn --</option>
                  {availableDrivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tên tài xế</label>
              <input name="driverName" required value={formData.driverName} onChange={handleChange} className="input-field w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder="Nguyễn Văn A" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Số điện thoại</label>
              <input name="driverPhone" required value={formData.driverPhone} onChange={handleChange} className="input-field w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder="0912..." />
            </div>

             {/* Ride Info */}
            <div className="md:col-span-2 mt-2">
              <h4 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">Lộ trình & Thời gian</h4>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Điểm đi</label>
              <input list="locations" name="origin" required value={formData.origin} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder="Nhập điểm đón" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Điểm đến</label>
              <input list="locations" name="destination" required value={formData.destination} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder="Nhập điểm trả" />
            </div>
            <datalist id="locations">
              {POPULAR_LOCATIONS.map(loc => <option key={loc} value={loc} />)}
            </datalist>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ngày đi</label>
              <input type="date" name="date" required value={formData.date} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Giờ đón (24h)</label>
              <input type="time" name="time" required value={formData.time} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
            </div>

            {/* Vehicle & Pricing */}
            <div className="md:col-span-2 mt-2 flex justify-between items-center">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Chi tiết xe</h4>
              {availableVehicles.length > 0 && (
                <select onChange={handleSelectVehicle} className="text-xs border-slate-200 rounded-lg p-1 bg-slate-50 text-slate-600 outline-none">
                  <option value="">-- Chọn xe có sẵn --</option>
                  {availableVehicles.map(v => <option key={v.id} value={v.id}>{v.model} - {v.licensePlate}</option>)}
                </select>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Loại chuyến</label>
              <select name="type" value={formData.type} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                {Object.values(RideType).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Loại xe (Vios, Mazda...)</label>
              <input name="carModel" required value={formData.carModel} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder="Kia Cerato 2021" />
            </div>

            <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Giá vé (VNĐ/người)</label>
               <input type="number" name="price" required min="0" value={formData.price} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
            </div>
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Biển số xe</label>
              <input name="licensePlate" value={formData.licensePlate} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder="51H-12345" />
            </div>
            
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Tổng ghế</label>
                <input type="number" name="totalSeats" required min="1" max="50" value={formData.totalSeats} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Ghế trống</label>
                <input type="number" name="seatsAvailable" required min="1" max={formData.totalSeats} value={formData.seatsAvailable} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Ghi chú thêm</label>
              <textarea name="description" rows={2} value={formData.description} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder="Ví dụ: Không hút thuốc, cốp rộng..."></textarea>
            </div>
          </form>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end space-x-3">
          <Button variant="secondary" onClick={onClose}>Hủy bỏ</Button>
          <Button onClick={handleSubmit}>Đăng chuyến</Button>
        </div>
      </div>
    </div>
  );
};