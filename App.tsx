import React, { useState, useMemo } from 'react';
import { HashRouter } from 'react-router-dom';
import { Ride, RideType, Driver, Vehicle, Booking, RideRequest } from './types';
import { INITIAL_RIDES, INITIAL_DRIVERS, INITIAL_VEHICLES, INITIAL_BOOKINGS, INITIAL_REQUESTS } from './services/mockData';
import { BookingModal } from './components/BookingModal';
import { PostRideModal } from './components/PostRideModal';
import { ManagementModal } from './components/ManagementModal';
import { QuickBookModal } from './components/QuickBookModal';
import { QuickBookForm } from './components/QuickBookForm';
import { RideCard } from './components/RideCard';
import { Button } from './components/Button';
import { Search, Plus, Settings, Zap, CarFront, Filter } from 'lucide-react';

const App = () => {
  const [rides, setRides] = useState<Ride[]>(INITIAL_RIDES);
  const [drivers, setDrivers] = useState<Driver[]>(INITIAL_DRIVERS);
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [rideRequests, setRideRequests] = useState<RideRequest[]>(INITIAL_REQUESTS);

  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isManagementModalOpen, setIsManagementModalOpen] = useState(false);
  const [isQuickBookModalOpen, setIsQuickBookModalOpen] = useState(false);
  
  // New state for filters
  const [filterType, setFilterType] = useState<'ALL' | RideType>('ALL');

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

  const handlePostRide = (newRideData: Omit<Ride, 'id' | 'driverRating'>) => {
    const newRide: Ride = {
      ...newRideData,
      id: Math.random().toString(36).substr(2, 9),
      driverRating: 5.0 // New drivers start with 5 stars
    };
    setRides(prev => [newRide, ...prev]);
    setIsPostModalOpen(false);
    alert('Đăng chuyến thành công!');
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
    alert('Yêu cầu đặt xe của bạn đã được gửi! Các tài xế sẽ liên hệ sớm.');
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

    setSelectedRide(null);
    alert(`Đặt vé thành công! Tài xế ${selectedRide.driverName} sẽ liên hệ với ${name} (${phone}) sớm nhất.`);
  };

  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-50 flex flex-col">
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
              <Button variant="outline" size="sm" onClick={() => setIsManagementModalOpen(true)} className="flex items-center gap-1">
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

        {/* Available Rides Section (Seat Sharing) */}
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-primary-700 mb-1">
                 <CarFront size={24} />
                 <h2 className="text-2xl font-bold text-slate-800">Ghép ghế ngay</h2>
              </div>
              <p className="text-slate-500">Các chuyến xe tiện chuyến, xe ghép đang còn chỗ trống và sắp khởi hành.</p>
            </div>

            {/* Filter Chips */}
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableRides.length > 0 ? (
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

        {isManagementModalOpen && (
          <ManagementModal
            onClose={() => setIsManagementModalOpen(false)}
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
      </div>
    </HashRouter>
  );
};

export default App;