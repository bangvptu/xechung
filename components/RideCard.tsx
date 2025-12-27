import React from 'react';
import { Ride, RideType } from '../types';
import { Button } from './Button';
import { MapPin, Calendar, Clock, Car, Phone, Star, User } from 'lucide-react';

interface RideCardProps {
  ride: Ride;
  onBook: (ride: Ride) => void;
}

export const RideCard: React.FC<RideCardProps> = ({ ride, onBook }) => {
  const isFull = ride.seatsAvailable === 0;

  const typeColor = {
    [RideType.SHARED]: 'bg-green-100 text-green-800',
    [RideType.CONVENIENT]: 'bg-blue-100 text-blue-800',
    [RideType.PRIVATE]: 'bg-purple-100 text-purple-800'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${typeColor[ride.type]}`}>
              {ride.type}
            </span>
            <h3 className="mt-2 text-lg font-bold text-slate-900 flex items-center">
              {ride.price.toLocaleString('vi-VN')}đ
              <span className="text-sm font-normal text-slate-500 ml-1">/ khách</span>
            </h3>
          </div>
          <div className="text-right">
             <div className="flex items-center text-yellow-500 justify-end">
               <Star size={16} fill="currentColor" />
               <span className="ml-1 text-sm font-medium text-slate-700">{ride.driverRating}</span>
             </div>
             <p className="text-xs text-slate-500 mt-1">{ride.carModel}</p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Route */}
          <div className="flex flex-col relative pl-6 border-l-2 border-slate-200 ml-2 space-y-4 py-1">
             <div className="relative">
               <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 border-primary-500 bg-white"></div>
               <p className="font-semibold text-slate-900">{ride.origin}</p>
               <div className="flex items-center text-xs text-slate-500 mt-0.5">
                 <Calendar size={12} className="mr-1" />
                 {new Date(ride.date).toLocaleDateString('vi-VN')}
                 <Clock size={12} className="ml-2 mr-1" />
                 {ride.time}
               </div>
             </div>
             <div className="relative">
               <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-primary-500"></div>
               <p className="font-semibold text-slate-900">{ride.destination}</p>
             </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-sm text-slate-600">
             <div className="flex items-center">
               <User size={16} className="mr-1.5" />
               <span>{ride.driverName}</span>
             </div>
             <div className="flex items-center">
               <Car size={16} className="mr-1.5" />
               <span>Còn {ride.seatsAvailable}/{ride.totalSeats} ghế</span>
             </div>
          </div>
          
          {ride.licensePlate && (
             <div className="text-xs text-center bg-slate-100 rounded py-1 font-mono text-slate-600 tracking-wider">
               {ride.licensePlate}
             </div>
          )}

          {ride.description && (
             <p className="text-sm text-slate-500 italic bg-slate-50 p-2 rounded">
               "{ride.description}"
             </p>
          )}
        </div>

        <div className="mt-5">
          <Button 
            className="w-full" 
            onClick={() => onBook(ride)} 
            disabled={isFull}
            variant={isFull ? 'secondary' : 'primary'}
          >
            {isFull ? 'Đã hết chỗ' : 'Đặt chỗ ngay'}
          </Button>
        </div>
      </div>
    </div>
  );
};