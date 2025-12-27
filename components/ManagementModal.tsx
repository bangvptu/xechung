import React, { useState } from 'react';
import { Driver, Vehicle, Booking, RideRequest } from '../types';
import { Button } from './Button';
import { X, User, Car, Trash2, Plus, CalendarCheck, Phone, CheckCircle, XCircle, MessageSquare } from 'lucide-react';

interface ManagementModalProps {
  onClose: () => void;
  drivers: Driver[];
  setDrivers: React.Dispatch<React.SetStateAction<Driver[]>>;
  vehicles: Vehicle[];
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  rideRequests: RideRequest[];
  setRideRequests: React.Dispatch<React.SetStateAction<RideRequest[]>>;
}

export const ManagementModal: React.FC<ManagementModalProps> = ({
  onClose,
  drivers,
  setDrivers,
  vehicles,
  setVehicles,
  bookings,
  setBookings,
  rideRequests,
  setRideRequests
}) => {
  const [activeTab, setActiveTab] = useState<'drivers' | 'vehicles' | 'bookings' | 'requests'>('drivers');

  // Form states
  const [newDriver, setNewDriver] = useState({ name: '', phone: '' });
  const [newVehicle, setNewVehicle] = useState({ model: '', type: '4 chỗ', licensePlate: '' });

  // Driver Handlers
  const handleAddDriver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDriver.name || !newDriver.phone) return;
    const driver: Driver = {
      id: Math.random().toString(36).substr(2, 9),
      ...newDriver
    };
    setDrivers([...drivers, driver]);
    setNewDriver({ name: '', phone: '' });
  };

  const handleDeleteDriver = (id: string) => {
    setDrivers(drivers.filter(d => d.id !== id));
  };

  // Vehicle Handlers
  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehicle.model || !newVehicle.licensePlate) return;
    const vehicle: Vehicle = {
      id: Math.random().toString(36).substr(2, 9),
      ...newVehicle
    };
    setVehicles([...vehicles, vehicle]);
    setNewVehicle({ model: '', type: '4 chỗ', licensePlate: '' });
  };

  const handleDeleteVehicle = (id: string) => {
    setVehicles(vehicles.filter(v => v.id !== id));
  };

  // Booking Handlers
  const handleUpdateBookingStatus = (id: string, status: 'confirmed' | 'cancelled') => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
  };

  const handleDeleteBooking = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa yêu cầu đặt chỗ này?')) {
      setBookings(bookings.filter(b => b.id !== id));
    }
  };

  // Request Handlers
  const handleUpdateRequestStatus = (id: string, status: 'accepted' | 'cancelled') => {
    setRideRequests(rideRequests.map(r => r.id === id ? { ...r, status } : r));
  };

  const handleDeleteRequest = (id: string) => {
    if (confirm('Xóa yêu cầu này?')) {
      setRideRequests(rideRequests.filter(r => r.id !== id));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-5xl h-[85vh] shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center md:block">
            <h3 className="font-bold text-lg text-slate-800">Quản lý hệ thống</h3>
             <button onClick={onClose} className="md:hidden p-1 rounded-full hover:bg-slate-200">
              <X size={20} />
            </button>
          </div>
          <div className="p-2 space-y-1 flex-1 overflow-y-auto">
            <button
              onClick={() => setActiveTab('drivers')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'drivers' ? 'bg-primary-100 text-primary-700' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <User size={18} />
              <span>Tài xế</span>
            </button>
            <button
              onClick={() => setActiveTab('vehicles')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'vehicles' ? 'bg-primary-100 text-primary-700' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <Car size={18} />
              <span>Xe & Biển số</span>
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'bookings' ? 'bg-primary-100 text-primary-700' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <CalendarCheck size={18} />
              <span>Yêu cầu đặt ghế</span>
              {bookings.filter(b => b.status === 'pending').length > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {bookings.filter(b => b.status === 'pending').length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'requests' ? 'bg-primary-100 text-primary-700' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <MessageSquare size={18} />
              <span>Yêu cầu từ khách</span>
              {rideRequests.filter(r => r.status === 'pending').length > 0 && (
                <span className="ml-auto bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {rideRequests.filter(r => r.status === 'pending').length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800">
              {activeTab === 'drivers' && 'Danh sách Tài xế'}
              {activeTab === 'vehicles' && 'Danh sách Phương tiện'}
              {activeTab === 'bookings' && 'Quản lý đặt chỗ (Theo chuyến)'}
              {activeTab === 'requests' && 'Yêu cầu tìm xe (Khách đăng)'}
            </h2>
            <button onClick={onClose} className="hidden md:block p-1 rounded-full hover:bg-slate-100">
              <X size={24} className="text-slate-400" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
            {activeTab === 'drivers' && (
              <div className="space-y-6">
                {/* Add Form */}
                <form onSubmit={handleAddDriver} className="bg-white p-4 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4 items-end shadow-sm">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Họ tên tài xế</label>
                    <input 
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Nhập tên..."
                      value={newDriver.name}
                      onChange={e => setNewDriver({...newDriver, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Số điện thoại</label>
                    <input 
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Nhập SĐT..."
                      value={newDriver.phone}
                      onChange={e => setNewDriver({...newDriver, phone: e.target.value})}
                      required
                    />
                  </div>
                  <Button type="submit" className="flex items-center justify-center gap-2">
                    <Plus size={18} /> Thêm
                  </Button>
                </form>

                {/* List */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-600 font-medium">
                      <tr>
                        <th className="px-4 py-3">Tên tài xế</th>
                        <th className="px-4 py-3">Số điện thoại</th>
                        <th className="px-4 py-3 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {drivers.map(driver => (
                        <tr key={driver.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-medium text-slate-900">{driver.name}</td>
                          <td className="px-4 py-3 text-slate-500">{driver.phone}</td>
                          <td className="px-4 py-3 text-right">
                            <button onClick={() => handleDeleteDriver(driver.id)} className="text-red-500 hover:text-red-700 p-1">
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {drivers.length === 0 && (
                        <tr>
                          <td colSpan={3} className="px-4 py-8 text-center text-slate-500">Chưa có tài xế nào</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'vehicles' && (
              <div className="space-y-6">
                 {/* Add Vehicle Form */}
                 <form onSubmit={handleAddVehicle} className="bg-white p-4 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-4 items-end shadow-sm">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tên xe / Hãng</label>
                    <input 
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Vios, Mazda 3..."
                      value={newVehicle.model}
                      onChange={e => setNewVehicle({...newVehicle, model: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Loại xe</label>
                    <select 
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                      value={newVehicle.type}
                      onChange={e => setNewVehicle({...newVehicle, type: e.target.value})}
                    >
                      <option value="4 chỗ">4 chỗ</option>
                      <option value="5 chỗ">5 chỗ</option>
                      <option value="7 chỗ">7 chỗ</option>
                      <option value="16 chỗ">16 chỗ</option>
                    </select>
                  </div>
                   <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Biển số</label>
                    <input 
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="51G-xxxxx"
                      value={newVehicle.licensePlate}
                      onChange={e => setNewVehicle({...newVehicle, licensePlate: e.target.value})}
                      required
                    />
                  </div>
                  <Button type="submit" className="flex items-center justify-center gap-2">
                    <Plus size={18} /> Thêm
                  </Button>
                </form>

                 {/* List */}
                 <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-600 font-medium">
                      <tr>
                        <th className="px-4 py-3">Xe</th>
                        <th className="px-4 py-3">Loại</th>
                        <th className="px-4 py-3">Biển số</th>
                        <th className="px-4 py-3 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {vehicles.map(vehicle => (
                        <tr key={vehicle.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-medium text-slate-900">{vehicle.model}</td>
                          <td className="px-4 py-3 text-slate-500">{vehicle.type}</td>
                          <td className="px-4 py-3 font-mono text-slate-700">{vehicle.licensePlate}</td>
                          <td className="px-4 py-3 text-right">
                            <button onClick={() => handleDeleteVehicle(vehicle.id)} className="text-red-500 hover:text-red-700 p-1">
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {vehicles.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-slate-500">Chưa có xe nào</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
               <div className="space-y-4">
                  {bookings.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-xl border border-slate-200">
                      <p className="text-slate-500">Chưa có yêu cầu đặt chỗ nào</p>
                    </div>
                  ) : (
                    bookings.map(booking => (
                      <div key={booking.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Passenger Info */}
                        <div className="flex-1 min-w-[200px]">
                          <div className="flex items-center gap-2">
                             <span className={`w-2 h-2 rounded-full ${booking.status === 'pending' ? 'bg-yellow-400' : booking.status === 'confirmed' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                             <h4 className="font-bold text-slate-900">{booking.passengerName}</h4>
                          </div>
                          <div className="flex items-center text-slate-500 text-sm mt-1">
                            <Phone size={14} className="mr-1" />
                            <a href={`tel:${booking.passengerPhone}`} className="hover:text-primary-600 hover:underline">{booking.passengerPhone}</a>
                          </div>
                          <div className="text-xs text-slate-400 mt-1">Đặt lúc: {new Date(booking.createdAt).toLocaleString('vi-VN')}</div>
                        </div>

                        {/* Ride Info Snapshot */}
                        <div className="flex-1 lg:border-l lg:border-r border-slate-100 lg:px-4">
                           <div className="text-sm font-medium text-slate-800">
                             {booking.rideSnapshot.origin} <span className="text-slate-400">→</span> {booking.rideSnapshot.destination}
                           </div>
                           <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                             <span>{new Date(booking.rideSnapshot.date).toLocaleDateString('vi-VN')}</span>
                             <span>•</span>
                             <span>{booking.rideSnapshot.time}</span>
                           </div>
                           <div className="text-xs text-slate-500 mt-0.5">
                             Tài xế: {booking.rideSnapshot.driverName}
                           </div>
                        </div>

                        {/* Status & Actions */}
                        <div className="flex items-center justify-between lg:justify-end gap-4 min-w-[200px]">
                           <div className="text-right">
                             <div className="font-bold text-primary-600">{booking.seats} ghế</div>
                             <div className="text-xs text-slate-500">{(booking.rideSnapshot.price * booking.seats).toLocaleString('vi-VN')}đ</div>
                           </div>
                           
                           <div className="flex items-center gap-1">
                              {booking.status === 'pending' && (
                                <>
                                  <button onClick={() => handleUpdateBookingStatus(booking.id, 'confirmed')} className="p-2 text-green-600 hover:bg-green-50 rounded-full" title="Xác nhận">
                                    <CheckCircle size={20} />
                                  </button>
                                  <button onClick={() => handleUpdateBookingStatus(booking.id, 'cancelled')} className="p-2 text-red-600 hover:bg-red-50 rounded-full" title="Hủy bỏ">
                                    <XCircle size={20} />
                                  </button>
                                </>
                              )}
                              {booking.status !== 'pending' && (
                                <span className={`text-xs px-2 py-1 rounded-full border ${
                                  booking.status === 'confirmed' 
                                    ? 'bg-green-50 text-green-700 border-green-200' 
                                    : 'bg-red-50 text-red-700 border-red-200'
                                }`}>
                                  {booking.status === 'confirmed' ? 'Đã xác nhận' : 'Đã hủy'}
                                </span>
                              )}
                              <button onClick={() => handleDeleteBooking(booking.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-full ml-2">
                                <Trash2 size={18} />
                              </button>
                           </div>
                        </div>
                      </div>
                    ))
                  )}
               </div>
            )}

            {activeTab === 'requests' && (
              <div className="space-y-4">
                {rideRequests.length === 0 ? (
                  <div className="text-center py-10 bg-white rounded-xl border border-slate-200">
                    <p className="text-slate-500">Chưa có yêu cầu đặt xe nào từ khách</p>
                  </div>
                ) : (
                  rideRequests.map(request => (
                    <div key={request.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4 relative">
                      <div className="flex justify-between items-start">
                         <div>
                            <div className="flex items-center gap-2">
                               <span className={`w-2 h-2 rounded-full ${request.status === 'pending' ? 'bg-blue-400' : request.status === 'accepted' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                               <h4 className="font-bold text-slate-900">{request.passengerName}</h4>
                            </div>
                             <div className="flex items-center text-slate-500 text-sm mt-1">
                                <Phone size={14} className="mr-1" />
                                <a href={`tel:${request.passengerPhone}`} className="hover:text-primary-600 hover:underline">{request.passengerPhone}</a>
                             </div>
                         </div>
                         <span className="text-xs text-slate-400">{new Date(request.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                      
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <div className="font-semibold text-slate-800 text-sm">{request.origin} ➔ {request.destination}</div>
                          <div className="text-sm text-slate-600 mt-1 flex gap-3">
                             <span>{new Date(request.date).toLocaleDateString('vi-VN')}</span>
                             <span>{request.time}</span>
                             <span className="font-medium text-blue-600">{request.seats} chỗ</span>
                          </div>
                          {request.note && (
                            <div className="text-xs text-slate-500 mt-2 italic">"{request.note}"</div>
                          )}
                      </div>

                      <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                        {request.status === 'pending' ? (
                           <>
                              <Button size="sm" onClick={() => handleUpdateRequestStatus(request.id, 'accepted')} className="bg-green-600 hover:bg-green-700 text-white text-xs">
                                Nhận khách
                              </Button>
                              <Button size="sm" variant="danger" onClick={() => handleUpdateRequestStatus(request.id, 'cancelled')} className="text-xs">
                                Hủy
                              </Button>
                           </>
                        ) : (
                           <span className={`text-xs px-2 py-1 rounded-full border ${
                              request.status === 'accepted' 
                                ? 'bg-green-50 text-green-700 border-green-200' 
                                : 'bg-red-50 text-red-700 border-red-200'
                            }`}>
                              {request.status === 'accepted' ? 'Đã có tài xế nhận' : 'Đã hủy'}
                            </span>
                        )}
                        <button onClick={() => handleDeleteRequest(request.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded ml-2">
                           <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};