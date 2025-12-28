import { Driver, Vehicle, Ride, Booking, RideRequest } from '../types';
import { INITIAL_DRIVERS, INITIAL_VEHICLES, INITIAL_RIDES, INITIAL_BOOKINGS, INITIAL_REQUESTS } from './mockData';

const KEYS = {
  DRIVERS: 'xgv_drivers',
  VEHICLES: 'xgv_vehicles',
  RIDES: 'xgv_rides',
  BOOKINGS: 'xgv_bookings',
  REQUESTS: 'xgv_requests'
};

const getJSON = <T>(key: string, fallback: T): T => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    console.error(`Error loading key ${key}`, e);
    return fallback;
  }
};

const setJSON = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving key ${key}`, e);
  }
};

export const storage = {
  // Drivers
  getDrivers: () => getJSON<Driver[]>(KEYS.DRIVERS, INITIAL_DRIVERS),
  saveDrivers: (data: Driver[]) => setJSON(KEYS.DRIVERS, data),

  // Vehicles
  getVehicles: () => getJSON<Vehicle[]>(KEYS.VEHICLES, INITIAL_VEHICLES),
  saveVehicles: (data: Vehicle[]) => setJSON(KEYS.VEHICLES, data),

  // Rides
  getRides: () => getJSON<Ride[]>(KEYS.RIDES, INITIAL_RIDES),
  saveRides: (data: Ride[]) => setJSON(KEYS.RIDES, data),

  // Bookings
  getBookings: () => getJSON<Booking[]>(KEYS.BOOKINGS, INITIAL_BOOKINGS),
  saveBookings: (data: Booking[]) => setJSON(KEYS.BOOKINGS, data),

  // Requests
  getRequests: () => getJSON<RideRequest[]>(KEYS.REQUESTS, INITIAL_REQUESTS),
  saveRequests: (data: RideRequest[]) => setJSON(KEYS.REQUESTS, data),
};
