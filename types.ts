
export enum RideType {
  SHARED = 'Xe ghép',
  PRIVATE = 'Bao xe',
  CONVENIENT = 'Tiện chuyến'
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
}

export interface Vehicle {
  id: string;
  model: string; // e.g., Toyota Vios
  type: string; // e.g., 4 chỗ, 7 chỗ
  licensePlate: string;
}

export interface Ride {
  id: string;
  driverName: string;
  driverPhone: string;
  driverRating: number;
  origin: string;
  destination: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  price: number;
  seatsAvailable: number;
  totalSeats: number;
  carModel: string;
  licensePlate?: string;
  type: RideType;
  description?: string;
}

export interface Booking {
  id: string;
  rideId: string;
  passengerName: string;
  passengerPhone: string;
  seats: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  rideSnapshot: {
    origin: string;
    destination: string;
    date: string;
    time: string;
    price: number;
    driverName: string;
  };
}

export interface RideRequest {
  id: string;
  passengerName: string;
  passengerPhone: string;
  origin: string;
  destination: string;
  date: string;
  time: string;
  seats: number;
  note?: string;
  status: 'pending' | 'accepted' | 'cancelled';
  createdAt: string;
  // Fields for assigned driver
  assignedDriverId?: string;
  assignedDriverName?: string;
  assignedDriverPhone?: string;
  assignedVehicleInfo?: string; // e.g. "Vios - 51G-123.45"
  agreedPrice?: number; // Negotiated price
}

export interface SearchFilters {
  origin?: string;
  destination?: string;
  date?: string;
  time?: string; // HH:mm format
  type?: RideType;
}

export interface BookingRequest {
  rideId: string;
  passengerName: string;
  passengerPhone: string;
  seats: number;
  note?: string;
}