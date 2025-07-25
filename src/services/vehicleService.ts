// src/services/vehicleService.ts

import type { Vehicle, VehicleUpdate } from '@/types/vehicle';

const API_BASE_URL = 'https://ofc-test-01.tspb.su/test-task';

class VehicleService {
  async getVehicles(): Promise<Vehicle[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/vehicles`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      throw error;
    }
  }

  async updateVehicle(id: number, data: VehicleUpdate): Promise<Vehicle> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id,
      ...data,
    } as Vehicle;
  }

  async deleteVehicle(id: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(`Эмуляция удаления автомобиля с ID: ${id}`);
    return Promise.resolve();
  }
}

export const vehicleService = new VehicleService();