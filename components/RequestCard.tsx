import React from 'react';
import { RideRequest } from '../types';
import { Button } from './Button';
import { MapPin, Calendar, Clock, User, Phone, MessageSquare, CheckCircle } from 'lucide-react';

interface RequestCardProps {
  request: RideRequest;
}

export const RequestCard: React.FC<RequestCardProps> = ({ request }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow p-5 flex flex-col h-full relative">
        {request.status === 'accepted' && (
           <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded-bl-lg font-bold flex items-center gap-1 z-10">
               <CheckCircle size={12} />
               Đã có tài xế
           </div>
        )}

        {/* Header: Name & Time */}
        <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
                <div className="bg-blue-100 p-2 rounded-full text-blue-600 shrink-0">
                    <User size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 line-clamp-1">{request.passengerName}</h3>
                    <p className="text-xs text-slate-500 flex items-center mt-0.5">
                         <Clock size={12} className="mr-1" />
                         {new Date(request.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                </div>
            </div>
            <div className="text-right shrink-0">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 whitespace-nowrap">
                    Cần {request.seats} ghế
                </span>
            </div>
        </div>

        {/* Route */}
        <div className="space-y-3 mb-5 flex-1">
            <div className="flex flex-col relative pl-6 border-l-2 border-slate-200 ml-2 space-y-4 py-1">
                <div className="relative">
                   <div className="absolute -left-[29px] top-1 h-3.5 w-3.5 rounded-full border-2 border-green-500 bg-white"></div>
                   <p className="font-semibold text-slate-900 text-sm line-clamp-2">{request.origin}</p>
                </div>
                <div className="relative">
                   <div className="absolute -left-[29px] top-1 h-3.5 w-3.5 rounded-full bg-green-500"></div>
                   <p className="font-semibold text-slate-900 text-sm line-clamp-2">{request.destination}</p>
                </div>
            </div>
            
            <div className="flex items-center text-sm text-slate-600 bg-slate-50 p-2 rounded-lg">
                <Calendar size={16} className="mr-2 text-slate-400" />
                <span className="font-medium">{new Date(request.date).toLocaleDateString('vi-VN')}</span>
                <span className="mx-2 text-slate-300">|</span>
                <Clock size={16} className="mr-2 text-slate-400" />
                <span className="font-medium">{request.time}</span>
            </div>

            {request.note && (
                <div className="text-sm text-slate-500 italic flex items-start">
                    <MessageSquare size={14} className="mr-1.5 mt-0.5 shrink-0" />
                    <span className="line-clamp-2">"{request.note}"</span>
                </div>
            )}
            
            {request.status === 'accepted' && request.assignedDriverName && (
                <div className="mt-2 bg-green-50 border border-green-100 rounded-lg p-2 text-xs">
                    <p className="font-semibold text-green-800">Tài xế nhận: {request.assignedDriverName}</p>
                    <p className="text-green-700">{request.assignedDriverPhone}</p>
                    {request.assignedVehicleInfo && <p className="text-green-600 italic">{request.assignedVehicleInfo}</p>}
                </div>
            )}
        </div>

        {/* Action */}
         <Button 
            className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2 mt-auto" 
            onClick={() => window.location.href = `tel:${request.passengerPhone}`}
        >
            <Phone size={18} />
            <span className="truncate">Liên hệ: {request.passengerPhone}</span>
        </Button>
    </div>
  );
};