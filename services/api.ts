import { Vehicle } from '../types';
import { storage } from './storage';

/**
 * Simulates an API endpoint to fetch all vehicles.
 * Now it fetches from LocalStorage (via storage service).
 */
export const fetchVehicles = async (): Promise<Vehicle[]> => {
  // Simulate network latency (500ms)
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return the data from storage
  return storage.getVehicles();
};
