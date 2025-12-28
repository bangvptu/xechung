import React, { useState, useMemo } from 'react';
import { Driver, Vehicle, Booking, RideRequest } from '../types';
import { Button } from './Button';
import { X, User, Car, Trash2, Plus, CalendarCheck, Phone, CheckCircle, XCircle, MessageSquare, LogOut, BarChart3, TrendingUp, Printer, FileText, CalendarRange, Coins, Percent } from 'lucide-react';

interface ManagementModalProps {
  onClose: () => void;
  onLogout: () => void;
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
  onLogout,
  drivers,
  setDrivers,
  vehicles,
  setVehicles,
  bookings,
  setBookings,
  rideRequests,
  setRideRequests
}) => {
  const [activeTab, setActiveTab] = useState<'drivers' | 'vehicles' | 'bookings' | 'requests' | 'reports'>('drivers');

  // Date Range State for Reports (Default to current month)
  const [reportDateRange, setReportDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  // Form states
  const [newDriver, setNewDriver] = useState({ name: '', phone: '' });
  const [newVehicle, setNewVehicle] = useState({ model: '', type: '4 chỗ', licensePlate: '' });

  // Assignment State
  const [assigningRequest, setAssigningRequest] = useState<RideRequest | null>(null);
  const [assignmentData, setAssignmentData] = useState({ driverId: '', vehicleId: '', price: '' });

  // Global Counts for Sidebar Badges (Unfiltered)
  const globalCounts = useMemo(() => ({
    pendingBookings: bookings.filter(b => b.status === 'pending').length,
    pendingRequests: rideRequests.filter(r => r.status === 'pending').length
  }), [bookings, rideRequests]);

  // Report Statistics (Filtered by Date)
  const reportStats = useMemo(() => {
    const startDate = new Date(reportDateRange.start);
    const endDate = new Date(reportDateRange.end);
    // Set end date to end of day for inclusive comparison
    endDate.setHours(23, 59, 59, 999);

    // Filter Bookings based on Ride Date (Service delivery date)
    const filteredBookings = bookings.filter(b => {
      const rideDate = new Date(b.rideSnapshot.date);
      return rideDate >= startDate && rideDate <= endDate;
    });

    // Filter Requests based on Date
    const filteredRequests = rideRequests.filter(r => {
      const reqDate = new Date(r.date);
      return reqDate >= startDate && reqDate <= endDate;
    });

    const confirmedBookings = filteredBookings.filter(b => b.status === 'confirmed');
    const revenue = confirmedBookings.reduce((acc, curr) => acc + (curr.rideSnapshot.price * curr.seats), 0);
    const totalConfirmedSeats = confirmedBookings.reduce((acc, curr) => acc + curr.seats, 0);
    
    // Average Price Calculation
    const averagePrice = totalConfirmedSeats > 0 ? revenue / totalConfirmedSeats : 0;

    // Cancellation Rate
    const totalFilteredBookings = filteredBookings.length;
    const cancelledCount = filteredBookings.filter(b => b.status === 'cancelled').length;
    const cancelRate = totalFilteredBookings > 0 ? (cancelledCount / totalFilteredBookings) * 100 : 0;

    return {
      filteredBookings,
      totalDrivers: drivers.length,
      totalVehicles: vehicles.length,
      totalBookings: filteredBookings.length,
      confirmedBookingsCount: confirmedBookings.length,
      cancelledBookingsCount: cancelledCount,
      totalRequests: filteredRequests.length,
      revenue: revenue,
      averagePrice: averagePrice,
      cancelRate: cancelRate
    };
  }, [drivers, vehicles, bookings, rideRequests, reportDateRange]);

  const handlePrint = () => {
    window.print();
  };

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
  const initiateAssignment = (request: RideRequest) => {
    setAssigningRequest(request);
    setAssignmentData({ driverId: '', vehicleId: '', price: '0' });
  };

  const confirmAssignment = () => {
    if (!assigningRequest || !assignmentData.driverId) return;

    const selectedDriver = drivers.find(d => d.id === assignmentData.driverId);
    const selectedVehicle = vehicles.find(v => v.id === assignmentData.vehicleId);
    const pricePerSeat = parseInt(assignmentData.price) || 0;

    if (selectedDriver) {
       // 1. Update the Request Status
       const updatedRequest: RideRequest = {
         ...assigningRequest,
         status: 'accepted',
         assignedDriverId: selectedDriver.id,
         assignedDriverName: selectedDriver.name,
         assignedDriverPhone: selectedDriver.phone,
         assignedVehicleInfo: selectedVehicle ? `${selectedVehicle.model} (${selectedVehicle.licensePlate})` : undefined,
         agreedPrice: pricePerSeat
       };

       setRideRequests(rideRequests.map(r => r.id === assigningRequest.id ? updatedRequest : r));

       // 2. Automatically create a Booking record so it appears in reports and lists
       const newBooking: Booking = {
         id: `b-${Date.now()}`,
         rideId: assigningRequest.id, // Link to the request ID
         passengerName: assigningRequest.passengerName,
         passengerPhone: assigningRequest.passengerPhone,
         seats: assigningRequest.seats,
         status: 'confirmed', // Auto-confirm since admin assigned it
         createdAt: new Date().toISOString(),
         rideSnapshot: {
           origin: assigningRequest.origin,
           destination: assigningRequest.destination,
           date: assigningRequest.date,
           time: assigningRequest.time,
           price: pricePerSeat,
           driverName: selectedDriver.name
         }
       };

       setBookings(prev => [newBooking, ...prev]);
       
       setAssigningRequest(null);
    }
  };

  const handleCancelRequest = (id: string) => {
    if (confirm('Hủy yêu cầu này?')) {
      setRideRequests(rideRequests.map(r => r.id === id ? { ...r, status: 'cancelled' } : r));
    }
  };

  const handleDeleteRequest = (id: string) => {
    if (confirm('Xóa vĩnh viễn yêu cầu này?')) {
      setRideRequests(rideRequests.filter(r => r.id !== id));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 print:p-0 print:bg-white print:absolute print:inset-0">
      <style>{`
        @media print {
          @page { size: auto; margin: 20mm; }
          body > *:not(.fixed) { display: none; }
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
          .print\\:w-full { width: 100% !important; }
          .print\\:bg-white { background-color: white !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:border-none { border: none !important; }
          .print\\:p-0 { padding: 0 !important; }
          .print\\:h-auto { height: auto !important; }
          .print\\:overflow-visible { overflow: visible !important; }
        }
      `}</style>

      {/* Assignment Modal Overlay */}
      {assigningRequest && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
           <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md m-4 border border-slate-200 animate-in zoom-in-95 duration-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                 <CheckCircle className="text-green-600" size={24}/>
                 Nhận khách: {assigningRequest.passengerName}
              </h3>
              
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4 text-sm text-slate-600">
                 <p><strong>Lộ trình:</strong> {assigningRequest.origin} ➔ {assigningRequest.destination}</p>
                 <p><strong>Thời gian:</strong> {assigningRequest.time} - {new Date(assigningRequest.date).toLocaleDateString('vi-VN')}</p>
                 <p><strong>Số ghế:</strong> {assigningRequest.seats}</p>
              </div>

              <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Chọn Tài xế (*)</label>
                    <select 
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                      value={assignmentData.driverId}
                      onChange={e => setAssignmentData({...assignmentData, driverId: e.target.value})}
                    >
                       <option value="">-- Chọn tài xế --</option>
                       {drivers.map(d => <option key={d.id} value={d.id}>{d.name} - {d.phone}</option>)}
                    </select>
                 </div>
                 
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Chọn Xe (Tùy chọn)</label>
                    <select 
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                      value={assignmentData.vehicleId}
                      onChange={e => setAssignmentData({...assignmentData, vehicleId: e.target.value})}
                    >
                       <option value="">-- Chọn xe --</option>
                       {vehicles.map(v => <option key={v.id} value={v.id}>{v.model} ({v.type}) - {v.licensePlate}</option>)}
                    </select>
                 </div>

                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Giá chốt (VNĐ/khách)</label>
                    <input 
                      type="number"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                      value={assignmentData.price}
                      onChange={e => setAssignmentData({...assignmentData, price: e.target.value})}
                      placeholder="Nhập giá thỏa thuận..."
                    />
                    <p className="text-xs text-slate-400 mt-1">*Để trống nếu chưa chốt giá (Mặc định 0đ)</p>
                 </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                 <Button variant="secondary" onClick={() => setAssigningRequest(null)}>Hủy bỏ</Button>
                 <Button onClick={confirmAssignment} disabled={!assignmentData.driverId}>Xác nhận gán</Button>
              </div>
           </div>
        </div>
      )}

      <div className="bg-white rounded-2xl w-full max-w-5xl h-[85vh] shadow-2xl overflow-hidden flex flex-col md:flex-row print:w-full print:max-w-none print:h-auto print:shadow-none print:rounded-none">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0 print:hidden">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center md:block">
            <h3 className="font-bold text-lg text-slate-800">Quản lý hệ thống</h3>
             <button onClick={onClose} className="md:hidden p-1 rounded-full hover:bg-slate-200">
              <X size={20} />
            </button>
          </div>
          <div className="p-2 space-y-1 flex-1 overflow-y-auto">
            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'reports' ? 'bg-primary-100 text-primary-700' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <BarChart3 size={18} />
              <span>Báo cáo thống kê</span>
            </button>
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
              {globalCounts.pendingBookings > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {globalCounts.pendingBookings}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'requests' ? 'bg-primary-100 text-primary-700' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <MessageSquare size={18} />
              <span>Yêu cầu từ khách</span>
              {globalCounts.pendingRequests > 0 && (
                <span className="ml-auto bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {globalCounts.pendingRequests}
                </span>
              )}
            </button>
          </div>
          
          <div className="p-4 border-t border-slate-200">
             <button 
               onClick={onLogout}
               className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
             >
               <LogOut size={18} />
               <span>Đăng xuất</span>
             </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col min-w-0 bg-white print:w-full print:block print:h-auto">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center print:hidden">
            <h2 className="text-xl font-bold text-slate-800">
              {activeTab === 'drivers' && 'Danh sách Tài xế'}
              {activeTab === 'vehicles' && 'Danh sách Phương tiện'}
              {activeTab === 'bookings' && 'Quản lý đặt chỗ (Theo chuyến)'}
              {activeTab === 'requests' && 'Yêu cầu tìm xe (Khách đăng)'}
              {activeTab === 'reports' && 'Báo cáo tổng hợp'}
            </h2>
            <button onClick={onClose} className="hidden md:block p-1 rounded-full hover:bg-slate-100">
              <X size={24} className="text-slate-400" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 print:bg-white print:p-0 print:overflow-visible print:h-auto">
            
            {activeTab === 'reports' && (
              <div className="space-y-6">
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden mb-2">
                    {/* Date Range Selector */}
                    <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                      <CalendarRange size={18} className="text-slate-500 ml-2" />
                      <div className="flex items-center gap-2">
                        <input 
                          type="date" 
                          value={reportDateRange.start}
                          onChange={(e) => setReportDateRange(prev => ({ ...prev, start: e.target.value }))}
                          className="text-sm border-none outline-none text-slate-700 focus:ring-0 bg-transparent cursor-pointer"
                        />
                        <span className="text-slate-400">→</span>
                        <input 
                          type="date" 
                          value={reportDateRange.end}
                          onChange={(e) => setReportDateRange(prev => ({ ...prev, end: e.target.value }))}
                          className="text-sm border-none outline-none text-slate-700 focus:ring-0 bg-transparent cursor-pointer"
                        />
                      </div>
                    </div>

                    <Button onClick={handlePrint} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900">
                      <Printer size={18} /> In báo cáo
                    </Button>
                 </div>

                 <div className="hidden print:block mb-8 text-center border-b-2 border-slate-800 pb-6">
                    <h1 className="text-3xl font-bold uppercase text-slate-900">Báo cáo hoạt động Xế Ghép</h1>
                    <p className="text-slate-600 mt-2">
                      Giai đoạn: {new Date(reportDateRange.start).toLocaleDateString('vi-VN')} - {new Date(reportDateRange.end).toLocaleDateString('vi-VN')}
                    </p>
                    <p className="text-slate-500 text-sm mt-1">
                      Xuất ngày: {new Date().toLocaleDateString('vi-VN')} {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </p>
                 </div>

                 {/* Stats Cards */}
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-2 print:gap-6">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm print:border-slate-300">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg print:bg-slate-100 print:text-black"><TrendingUp size={20}/></div>
                            <span className="text-slate-500 font-medium text-sm">Doanh thu</span>
                        </div>
                        <div className="text-2xl font-bold text-slate-900">{reportStats.revenue.toLocaleString('vi-VN')}đ</div>
                        <div className="text-xs text-slate-400 mt-1">Trong giai đoạn đã chọn</div>
                    </div>
                    
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm print:border-slate-300">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-green-100 text-green-600 rounded-lg print:bg-slate-100 print:text-black"><CalendarCheck size={20}/></div>
                            <span className="text-slate-500 font-medium text-sm">Số lượng đặt chỗ</span>
                        </div>
                        <div className="text-2xl font-bold text-slate-900">{reportStats.totalBookings}</div>
                        <div className="text-xs text-slate-400 mt-1 flex gap-2">
                           <span className="text-green-600">{reportStats.confirmedBookingsCount} thành công</span>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm print:border-slate-300">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg print:bg-slate-100 print:text-black"><Coins size={20}/></div>
                            <span className="text-slate-500 font-medium text-sm">Giá vé trung bình</span>
                        </div>
                        <div className="text-2xl font-bold text-slate-900">{reportStats.averagePrice.toLocaleString('vi-VN')}đ</div>
                        <div className="text-xs text-slate-400 mt-1">Trên mỗi ghế đã bán</div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm print:border-slate-300">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg print:bg-slate-100 print:text-black"><MessageSquare size={20}/></div>
                            <span className="text-slate-500 font-medium text-sm">Nhu cầu khách hàng</span>
                        </div>
                        <div className="text-2xl font-bold text-slate-900">{reportStats.totalRequests}</div>
                        <div className="text-xs text-slate-400 mt-1">Yêu cầu tìm xe mới</div>
                    </div>
                 </div>

                 {/* Detailed Table for Print */}
                 <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm mt-8 print:shadow-none print:border print:border-slate-300">
                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 font-bold text-slate-800 flex items-center gap-2 print:bg-slate-100">
                       <FileText size={18} /> Chi tiết đặt chỗ (Trong kỳ)
                    </div>
                    {reportStats.filteredBookings.length === 0 ? (
                      <div className="p-8 text-center text-slate-500">
                        Không có dữ liệu trong khoảng thời gian này.
                      </div>
                    ) : (
                      <table className="w-full text-sm text-left">
                          <thead className="bg-white text-slate-600 font-medium border-b border-slate-100">
                              <tr>
                                  <th className="px-6 py-3">Ngày đi</th>
                                  <th className="px-6 py-3">Khách hàng</th>
                                  <th className="px-6 py-3">Chuyến đi</th>
                                  <th className="px-6 py-3 text-right">Giá trị</th>
                                  <th className="px-6 py-3 text-center">Trạng thái</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                              {reportStats.filteredBookings.map(b => (
                                  <tr key={b.id} className="print:break-inside-avoid hover:bg-slate-50">
                                      <td className="px-6 py-3 text-slate-600">
                                        {new Date(b.rideSnapshot.date).toLocaleDateString('vi-VN')}
                                      </td>
                                      <td className="px-6 py-3">
                                        <div className="font-medium text-slate-900">{b.passengerName}</div>
                                        <div className="text-xs text-slate-500">{b.passengerPhone}</div>
                                      </td>
                                      <td className="px-6 py-3">
                                        <div className="text-slate-900">{b.rideSnapshot.origin} - {b.rideSnapshot.destination}</div>
                                        <div className="text-xs text-slate-500">Tài xế: {b.rideSnapshot.driverName}</div>
                                      </td>
                                      <td className="px-6 py-3 text-right font-medium text-slate-700">
                                        {(b.rideSnapshot.price * b.seats).toLocaleString('vi-VN')}đ
                                      </td>
                                      <td className="px-6 py-3 text-center">
                                        <span className={`inline-block px-2 py-0.5 rounded text-xs border ${
                                          b.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-200 print:border-black print:text-black' :
                                          b.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200 print:border-black print:text-black' :
                                          'bg-yellow-50 text-yellow-700 border-yellow-200 print:border-black print:text-black'
                                        }`}>
                                          {b.status === 'confirmed' ? 'Thành công' : b.status === 'pending' ? 'Chờ duyệt' : 'Đã hủy'}
                                        </span>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                    )}
                    <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 print:hidden">
                       Hiển thị toàn bộ dữ liệu theo bộ lọc ngày
                    </div>
                 </div>

                 <div className="hidden print:block mt-12 pt-8 border-t border-slate-300">
                    <div className="flex justify-between text-sm text-slate-600">
                        <div className="text-center w-1/3">
                            <p className="mb-16 font-semibold">Người lập biểu</p>
                            <p>(Ký, họ tên)</p>
                        </div>
                        <div className="text-center w-1/3">
                            <p className="mb-16 font-semibold">Giám đốc</p>
                            <p>(Ký, họ tên, đóng dấu)</p>
                        </div>
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'drivers' && (
              <div className="space-y-6 print:hidden">
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
              <div className="space-y-6 print:hidden">
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
               <div className="space-y-4 print:hidden">
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
                          <div className="text-xs text-slate-400 mt-1">Đặt lúc: {new Date(booking.createdAt).toLocaleString('vi-VN', { hour12: false })}</div>
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
              <div className="space-y-4 print:hidden">
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
                         <span className="text-xs text-slate-400">{new Date(request.createdAt).toLocaleString('vi-VN', { hour12: false })}</span>
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

                      {/* Display assigned driver info if accepted */}
                      {request.status === 'accepted' && request.assignedDriverName && (
                          <div className="bg-green-50 p-2 rounded border border-green-100 text-sm flex items-start gap-2">
                              <CheckCircle size={16} className="text-green-600 mt-0.5 shrink-0" />
                              <div>
                                  <span className="font-semibold text-green-800">Đã gán cho: {request.assignedDriverName}</span>
                                  <div className="text-xs text-green-700">{request.assignedDriverPhone}</div>
                                  {request.assignedVehicleInfo && <div className="text-xs text-green-600 mt-0.5">Xe: {request.assignedVehicleInfo}</div>}
                                  {request.agreedPrice && request.agreedPrice > 0 && (
                                     <div className="text-xs font-bold text-green-700 mt-0.5">Giá chốt: {request.agreedPrice.toLocaleString('vi-VN')}đ</div>
                                  )}
                              </div>
                          </div>
                      )}

                      <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                        {request.status === 'pending' ? (
                           <>
                              <Button size="sm" onClick={() => initiateAssignment(request)} className="bg-green-600 hover:bg-green-700 text-white text-xs">
                                Nhận khách
                              </Button>
                              <Button size="sm" variant="danger" onClick={() => handleCancelRequest(request.id)} className="text-xs">
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