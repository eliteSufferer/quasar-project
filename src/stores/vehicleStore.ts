import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Vehicle, VehicleUpdate } from '@/types/vehicle';
import { vehicleService } from '@/services/vehicleService';
import { Notify } from 'quasar';

export const useVehicleStore = defineStore('vehicles', () => {
  const vehicles = ref<Vehicle[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const vehicleList = computed(() => vehicles.value);
  const vehicleCount = computed(() => vehicles.value.length);
  const getVehicleById = computed(() => {
    return (id: number) => vehicles.value.find(v => v.id === id);
  });

  const fetchVehicles = async (forceRefresh = false) => {
    if (!forceRefresh && vehicles.value.length > 0) {
      return;
    }

    loading.value = true;
    error.value = null;
    
    try {
      vehicles.value = await vehicleService.getVehicles();
      Notify.create({
        type: 'positive',
        message: 'Данные загружены успешно',
        position: 'top-right'
      });
    } catch (err) {
      error.value = 'Ошибка загрузки данных';
      Notify.create({
        type: 'negative',
        message: 'Ошибка загрузки данных',
        position: 'top-right'
      });
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateVehicle = async (id: number, data: VehicleUpdate) => {
    try {
      const existingVehicle = vehicles.value.find(v => v.id === id);
      if (!existingVehicle) {
        throw new Error('Автомобиль не найден');
      }

      await vehicleService.updateVehicle(id, data);
      
      const index = vehicles.value.findIndex(v => v.id === id);
      if (index !== -1) {
        vehicles.value[index] = {
          ...existingVehicle,
          ...data
        };
      }
      
      Notify.create({
        type: 'positive',
        message: 'Машина обновлена',
        position: 'top-right'
      });
    } catch (err) {
      Notify.create({
        type: 'negative',
        message: 'Ошибка обновления данных',
        position: 'top-right'
      });
      throw err;
    }
  };

  const deleteVehicle = async (id: number) => {
    try {
      await vehicleService.deleteVehicle(id);
      
      vehicles.value = vehicles.value.filter(v => v.id !== id);
      
      Notify.create({
        type: 'positive',
        message: 'Машина удалена',
        position: 'top-right'
      });
    } catch (err) {
      Notify.create({
        type: 'negative',
        message: 'Ошибка удаления',
        position: 'top-right'
      });
      throw err;
    }
  };

  return {
    vehicles: vehicleList,
    loading,
    error,
    vehicleCount,
    getVehicleById,
    fetchVehicles,
    updateVehicle,
    deleteVehicle
  };
});