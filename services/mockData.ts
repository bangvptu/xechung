import { Ride, RideType, Driver, Vehicle, Booking, RideRequest } from '../types';

const TODAY = new Date().toISOString().split('T')[0];
const TOMORROW = new Date(Date.now() + 86400000).toISOString().split('T')[0];

export const INITIAL_DRIVERS: Driver[] = [
  { id: 'd1', name: 'Nguyễn Văn Hùng', phone: '0912345678' },
  { id: 'd2', name: 'Trần Tuấn Anh', phone: '0987654321' },
  { id: 'd3', name: 'Lê Thị Mai', phone: '0909090909' }
];

export const INITIAL_VEHICLES: Vehicle[] = [
  { id: 'v1', model: 'Toyota Innova 2022', type: '7 chỗ', licensePlate: '93A-123.45' },
  { id: 'v2', model: 'Mazda CX-5', type: '5 chỗ', licensePlate: '93A-567.89' },
  { id: 'v3', model: 'Kia Sedona', type: '7 chỗ', licensePlate: '51H-999.99' },
  { id: 'v4', model: 'Hyundai Accent', type: '4 chỗ', licensePlate: '60A-111.22' }
];

export const INITIAL_RIDES: Ride[] = [
  {
    id: '1',
    driverName: 'Nguyễn Văn Hùng',
    driverPhone: '0912345678',
    driverRating: 4.8,
    origin: 'Bình Phước',
    destination: 'Trấn Biên',
    date: TODAY,
    time: '07:00',
    price: 150000,
    seatsAvailable: 3,
    totalSeats: 7,
    carModel: 'Toyota Innova 2022',
    licensePlate: '93A-123.45',
    type: RideType.SHARED,
    description: 'Xe đi từ Đồng Xoài về Trấn Biên, Biên Hòa. Nhận gửi đồ.'
  },
  {
    id: '2',
    driverName: 'Trần Tuấn Anh',
    driverPhone: '0987654321',
    driverRating: 5.0,
    origin: 'Bình Phước',
    destination: 'Sài Gòn',
    date: TODAY,
    time: '09:30',
    price: 200000,
    seatsAvailable: 2,
    totalSeats: 4,
    carModel: 'Mazda CX-5',
    licensePlate: '93A-567.89',
    type: RideType.CONVENIENT,
    description: 'Tiện chuyến về Sài Gòn, xe đẹp, lái lụa.'
  },
  {
    id: '3',
    driverName: 'Lê Thị Mai',
    driverPhone: '0909090909',
    driverRating: 4.9,
    origin: 'Sài Gòn',
    destination: 'Bình Phước',
    date: TOMORROW, // Tomorrow
    time: '14:00',
    price: 180000,
    seatsAvailable: 4,
    totalSeats: 7,
    carModel: 'Kia Sedona',
    licensePlate: '51H-999.99',
    type: RideType.SHARED,
    description: 'Xe rộng rãi, đón trả tận nơi tại các quận trung tâm.'
  },
  {
    id: '4',
    driverName: 'Phạm Văn Dũng',
    driverPhone: '0911223344',
    driverRating: 4.7,
    origin: 'Trấn Biên',
    destination: 'Bình Phước',
    date: TODAY,
    time: '16:00',
    price: 140000,
    seatsAvailable: 1,
    totalSeats: 4,
    carModel: 'Hyundai Accent',
    licensePlate: '60A-111.22',
    type: RideType.CONVENIENT,
    description: 'Về Đồng Xoài, Bình Phước. Còn 1 ghế.'
  },
  {
    id: '5',
    driverName: 'Hoàng Long',
    driverPhone: '0888999111',
    driverRating: 5.0,
    origin: 'Sài Gòn',
    destination: 'Bình Phước',
    date: TOMORROW,
    time: '08:00',
    price: 900000,
    seatsAvailable: 4,
    totalSeats: 4,
    carModel: 'VinFast Lux A',
    licensePlate: '51G-888.88',
    type: RideType.PRIVATE,
    description: 'Nhận bao xe đi Bình Phước.'
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    rideId: '1',
    passengerName: 'Nguyễn Thị Cúc',
    passengerPhone: '0933333333',
    seats: 2,
    status: 'pending',
    createdAt: new Date().toISOString(),
    rideSnapshot: {
      origin: 'Bình Phước',
      destination: 'Trấn Biên',
      date: TODAY,
      time: '07:00',
      price: 150000,
      driverName: 'Nguyễn Văn Hùng'
    }
  },
  {
    id: 'b2',
    rideId: '2',
    passengerName: 'Lê Văn Tám',
    passengerPhone: '0944444444',
    seats: 1,
    status: 'confirmed',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    rideSnapshot: {
      origin: 'Bình Phước',
      destination: 'Sài Gòn',
      date: TODAY,
      time: '09:30',
      price: 200000,
      driverName: 'Trần Tuấn Anh'
    }
  }
];

export const INITIAL_REQUESTS: RideRequest[] = [
  {
    id: 'r1',
    passengerName: 'Hoàng Thị Lan',
    passengerPhone: '0911112222',
    origin: 'Bù Đăng, Bình Phước',
    destination: 'Sân bay Tân Sơn Nhất',
    date: TODAY,
    time: '05:00',
    seats: 4,
    note: 'Cần xe cốp rộng, nhà có em bé',
    status: 'pending',
    createdAt: new Date(Date.now() - 7200000).toISOString()
  }
];

export const POPULAR_LOCATIONS = [
  'Bình Phước', 'Trấn Biên', 'Sài Gòn', 'Biên Hòa', 'Đồng Xoài', 'Bình Dương'
];