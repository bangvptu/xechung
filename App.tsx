import React, { useState, useMemo, useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import { Ride, RideType, Driver, Vehicle, Booking, RideRequest } from './types';
import { fetchVehicles } from './services/api';
import { storage } from './services/storage';
import { BookingModal } from './components/BookingModal';
import { PostRideModal } from './components/PostRideModal';
import { ManagementModal } from './components/ManagementModal';
import { QuickBookModal } from './components/QuickBookModal';
import { QuickBookForm } from './components/QuickBookForm';
import { LoginModal } from './components/LoginModal';
import { BookingSuccessModal } from './components/BookingSuccessModal';
import { PushNotification } from './components/PushNotification';
import { RideCard } from './components/RideCard';
import { RequestCard } from './components/RequestCard';
import { Button } from './components/Button';
import { Search, Plus, Settings, Zap, CarFront, Filter, Users } from 'lucide-react';

const App = () => {
  // Initialize state from Storage (acting as Database)
  const [rides, setRides] = useState<Ride[]>(() => storage.getRides());
  const [drivers, setDrivers] = useState<Driver[]>(() => storage.getDrivers());
  const [vehicles, setVehicles] = useState<Vehicle[]>([]); // Initialize empty, fetch via API
  const [bookings, setBookings] = useState<Booking[]>(() => storage.getBookings());
  const [rideRequests, setRideRequests] = useState<RideRequest[]>(() => storage.getRequests());

  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isManagementModalOpen, setIsManagementModalOpen] = useState(false);
  const [isQuickBookModalOpen, setIsQuickBookModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Success Modal State
  const [successModalData, setSuccessModalData] = useState<{open: boolean, title: string, message: string} | null>(null);
  
  // Push Notification Simulation State
  const [pushNotification, setPushNotification] = useState<{visible: boolean, title: string, message: string}>({
    visible: false, title: '', message: ''
  });
  
  // View mode: Rides or Requests
  const [viewMode, setViewMode] = useState<'RIDES' | 'REQUESTS'>('RIDES');

  // New state for filters
  const [filterType, setFilterType] = useState<'ALL' | RideType>('ALL');

  // Load vehicles from API on mount
  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const data = await fetchVehicles();
        setVehicles(data);
      } catch (error) {
        console.error("Failed to load vehicles:", error);
      }
    };
    loadVehicles();
  }, []);

  // --- Persistence Effects (Auto-save to Database/LocalStorage) ---
  useEffect(() => { storage.saveRides(rides); }, [rides]);
  useEffect(() => { storage.saveDrivers(drivers); }, [drivers]);
  useEffect(() => { storage.saveVehicles(vehicles); }, [vehicles]);
  useEffect(() => { storage.saveBookings(bookings); }, [bookings]);
  useEffect(() => { storage.saveRequests(rideRequests); }, [rideRequests]);
  // ----------------------------------------------------------------

  // Filter logic for upcoming rides
  const availableRides = useMemo(() => {
    return rides
      .filter(r => r.seatsAvailable > 0) // Only show rides with seats
      .filter(r => filterType === 'ALL' || r.type === filterType)
      .sort((a, b) => {
        // Sort by Date then Time
        const dateA = new Date(`${a.date}T${a.time}`).getTime();
        const dateB = new Date(`${b.date}T${b.time}`).getTime();
        return dateA - dateB;
      });
  }, [rides, filterType]);

  // Filter logic for pending requests
  const availableRequests = useMemo(() => {
    return rideRequests
      .filter(r => r.status === 'pending')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [rideRequests]);

  // Helper to trigger simulated push notification
  const triggerDriverNotification = (title: string, message: string) => {
    // Reset first to allow re-triggering same notification
    setPushNotification({ visible: false, title: '', message: '' });
    setTimeout(() => {
      setPushNotification({ visible: true, title, message });
    }, 500);
  };

  const handlePostRide = (newRideData: Omit<Ride, 'id' | 'driverRating'>) => {
    const newRide: Ride = {
      ...newRideData,
      id: Math.random().toString(36).substr(2, 9),
      driverRating: 5.0 // New drivers start with 5 stars
    };
    setRides(prev => [newRide, ...prev]);
    setIsPostModalOpen(false);
    setSuccessModalData({
      open: true,
      title: 'Đăng chuyến thành công',
      message: 'Chuyến xe của bạn đã được đăng lên hệ thống.'
    });
  };

  const handleQuickBook = (requestData: Omit<RideRequest, 'id' | 'status' | 'createdAt'>) => {
    const newRequest: RideRequest = {
      ...requestData,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setRideRequests(prev => [newRequest, ...prev]);
    setIsQuickBookModalOpen(false);
    
    // Show success modal for Passenger
    setSuccessModalData({
      open: true,
      title: 'Gửi yêu cầu thành công!',
      message: 'Các tài xế sẽ sớm liên hệ với bạn qua số điện thoại.'
    });

    // --- SIMULATE PUSH NOTIFICATION TO DRIVERS ---
    // Logic: Find drivers who have trips on the same route or generally all drivers
    const matchingDrivers = rides.filter(r => 
      r.origin.toLowerCase().includes(requestData.origin.toLowerCase()) || 
      r.destination.toLowerCase().includes(requestData.destination.toLowerCase())
    );
    
    const driverCount = matchingDrivers.length > 0 ? matchingDrivers.length : drivers.length;
    
    triggerDriverNotification(
      `🔔 Yêu cầu đặt xe mới (${requestData.origin} ➔ ${requestData.destination})`,
      `Đã gửi thông báo tới ${driverCount} tài xế có lộ trình phù hợp. Khách: ${requestData.passengerName} - ${requestData.passengerPhone}`
    );
  };

  const handleConfirmBooking = (name: string, phone: string, seats: number) => {
    if (!selectedRide) return;
    
    // Update ride seats
    setRides(prev => prev.map(r => 
      r.id === selectedRide.id 
        ? { ...r, seatsAvailable: r.seatsAvailable - seats }
        : r
    ));
    
    // Create new booking record
    const newBooking: Booking = {
      id: Math.random().toString(36).substr(2, 9),
      rideId: selectedRide.id,
      passengerName: name,
      passengerPhone: phone,
      seats: seats,
      status: 'pending',
      createdAt: new Date().toISOString(),
      rideSnapshot: {
        origin: selectedRide.origin,
        destination: selectedRide.destination,
        date: selectedRide.date,
        time: selectedRide.time,
        price: selectedRide.price,
        driverName: selectedRide.driverName
      }
    };
    setBookings([newBooking, ...bookings]);

    // Save driver name before clearing selectedRide
    const driverName = selectedRide.driverName;
    setSelectedRide(null);
    
    // Show success modal for Passenger
    setSuccessModalData({
      open: true,
      title: 'Đặt vé thành công!',
      message: `Tài xế ${driverName} sẽ liên hệ đón bạn.`
    });

    // --- SIMULATE PUSH NOTIFICATION TO SPECIFIC DRIVER ---
    triggerDriverNotification(
      `🔔 Khách đã đặt chỗ chuyến ${newBooking.rideSnapshot.time}`,
      `Tài xế ${driverName} ơi, có khách ${name} đặt ${seats} ghế. Hãy kiểm tra ngay!`
    );
  };

  const handleManagementClick = () => {
    if (isLoggedIn) {
      setIsManagementModalOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
    setIsManagementModalOpen(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsManagementModalOpen(false);
  };

  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-x-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-primary-600 text-white p-1.5 rounded-lg">
                <Search size={20} strokeWidth={3} />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-primary-500">
                Xế Ghép Việt
              </span>
            </div>
            <div className="flex items-center space-x-2 md:space-x-3">
              <Button variant="outline" size="sm" onClick={handleManagementClick} className="flex items-center gap-1">
                <Settings size={16} />
                <span className="hidden lg:inline">Quản lý</span>
              </Button>
              <Button onClick={() => setIsPostModalOpen(true)} className="flex items-center gap-2">
                <Plus size={18} />
                <span className="hidden sm:inline">Đăng chuyến</span>
                <span className="sm:hidden">Đăng</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Global Push Notification Simulation */}
        <PushNotification 
          title={pushNotification.title}
          message={pushNotification.message}
          visible={pushNotification.visible}
          onClose={() => setPushNotification(prev => ({ ...prev, visible: false }))}
        />

        {/* Hero & Quick Book Form */}
        <div className="bg-gradient-to-b from-primary-700 to-primary-900 text-white pb-10">
          <div className="container mx-auto max-w-4xl px-4 pt-10">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                Đặt Xe Nhanh - Kết Nối Tức Thì
              </h1>
              <p className="text-primary-100 text-lg max-w-2xl mx-auto">
                Bạn chưa tìm được xe? Hãy gửi yêu cầu ngay để tài xế liên hệ đón bạn.
              </p>
            </div>

            {/* Quick Book Form Container */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 text-slate-800 max-w-2xl mx-auto border-4 border-white/20 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
                <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                   <Zap size={24} fill="currentColor" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Yêu cầu đặt xe nhanh</h2>
                  <p className="text-sm text-slate-500">Điền thông tin để tìm tài xế gần nhất</p>
                </div>
              </div>
              
              <QuickBookForm onSubmit={handleQuickBook} />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4 py-12">
          
          {/* Main Navigation Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-slate-100 p-1 rounded-xl flex space-x-1 shadow-inner">
              <button 
                onClick={() => setViewMode('RIDES')}
                className={`flex items-center px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  viewMode === 'RIDES' 
                    ? 'bg-white text-primary-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <CarFront size={18} className="mr-2" />
                Tìm Chuyến Xe
              </button>
              <button 
                onClick={() => setViewMode('REQUESTS')}
                className={`flex items-center px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  viewMode === 'REQUESTS' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Users size={18} className="mr-2" />
                Khách Tìm Xe
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-primary-700 mb-1">
                 {viewMode === 'RIDES' ? <CarFront size={24} /> : <Users size={24} />}
                 <h2 className="text-2xl font-bold text-slate-800">
                    {viewMode === 'RIDES' ? 'Chuyến xe đang có sẵn' : 'Hành khách đang tìm xe'}
                 </h2>
              </div>
              <p className="text-slate-500">
                {viewMode === 'RIDES' 
                  ? 'Danh sách các chuyến xe tiện chuyến, xe ghép sắp khởi hành.' 
                  : 'Danh sách hành khách đang chờ tài xế nhận chuyến.'}
              </p>
            </div>

            {/* Filter Chips - Only show for RIDES view for now */}
            {viewMode === 'RIDES' && (
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                 <span className="text-slate-400 mr-1"><Filter size={16}/></span>
                 <button 
                  onClick={() => setFilterType('ALL')}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filterType === 'ALL' ? 'bg-primary-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                 >
                   Tất cả
                 </button>
                 <button 
                  onClick={() => setFilterType(RideType.SHARED)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filterType === RideType.SHARED ? 'bg-green-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                 >
                   Xe ghép
                 </button>
                 <button 
                  onClick={() => setFilterType(RideType.CONVENIENT)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filterType === RideType.CONVENIENT ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                 >
                   Tiện chuyến
                 </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {viewMode === 'RIDES' ? (
              availableRides.length > 0 ? (
                availableRides.map(ride => (
                  <RideCard 
                    key={ride.id} 
                    ride={ride} 
                    onBook={() => setSelectedRide(ride)} 
                  />
                ))
              ) : (
                <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-slate-200 border-dashed">
                  <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                     <CarFront size={32} className="text-slate-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-600">Hiện không có xe nào phù hợp</h3>
                  <p className="text-slate-400 mt-1">Hãy thử sử dụng tính năng "Đặt xe nhanh" ở trên để tìm tài xế.</p>
                </div>
              )
            ) : (
              // REQUESTS VIEW
              availableRequests.length > 0 ? (
                availableRequests.map(request => (
                  <RequestCard key={request.id} request={request} />
                ))
              ) : (
                <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-slate-200 border-dashed">
                  <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                     <Users size={32} className="text-slate-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-600">Chưa có khách nào tìm xe</h3>
                  <p className="text-slate-400 mt-1">Danh sách yêu cầu đang trống.</p>
                </div>
              )
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-8 text-center text-slate-500 text-sm mt-auto">
          <div className="container mx-auto px-4">
            <p className="font-semibold text-slate-800 mb-2">Xế Ghép Việt © 2024</p>
            <p>Kết nối an toàn - Tiết kiệm chi phí - Hành trình vui vẻ</p>
          </div>
        </footer>

        {/* Modals */}
        {selectedRide && (
          <BookingModal 
            ride={selectedRide} 
            onClose={() => setSelectedRide(null)} 
            onConfirm={handleConfirmBooking}
          />
        )}

        {isPostModalOpen && (
          <PostRideModal 
            onClose={() => setIsPostModalOpen(false)}
            onSubmit={handlePostRide}
            availableDrivers={drivers}
            availableVehicles={vehicles}
          />
        )}

        {isQuickBookModalOpen && (
          <QuickBookModal
            onClose={() => setIsQuickBookModalOpen(false)}
            onSubmit={handleQuickBook}
          />
        )}
        
        {isLoginModalOpen && (
          <LoginModal 
            onClose={() => setIsLoginModalOpen(false)}
            onLogin={handleLogin}
          />
        )}

        {isManagementModalOpen && (
          <ManagementModal
            onClose={() => setIsManagementModalOpen(false)}
            onLogout={handleLogout}
            drivers={drivers}
            setDrivers={setDrivers}
            vehicles={vehicles}
            setVehicles={setVehicles}
            bookings={bookings}
            setBookings={setBookings}
            rideRequests={rideRequests}
            setRideRequests={setRideRequests}
          />
        )}

        {/* Success Modal */}
        {successModalData && successModalData.open && (
           <BookingSuccessModal 
              title={successModalData.title}
              message={successModalData.message}
              onClose={() => setSuccessModalData(null)}
           />
        )}
      </div>
    </HashRouter>
  );
};

export default App;