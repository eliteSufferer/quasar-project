<template>
    <div class="vehicle-map">
      <div class="map-header q-pa-md">
        <div class="text-h6">Карта автомобилей</div>
        <q-space />
        <q-btn
          color="secondary"
          icon="refresh"
          label="Сбросить изменения"
          @click="vehicleStore.fetchVehicles"
          :loading="vehicleStore.loading"
          class="q-mr-sm"
        />
        <q-btn
          color="primary"
          icon="cached"
          label="Обновить"
          @click="vehicleStore.fetchVehicles"
          :loading="vehicleStore.loading"
        />
      </div>
      
      <div 
        ref="mapContainer" 
        class="map-container"
        style="height: calc(100vh - 250px); width: 100%;"
      />
      
      <q-card v-if="selectedVehicle" class="map-info-panel">
        <q-card-section>
          <div class="text-subtitle1">{{ selectedVehicle.name }} {{ selectedVehicle.model }}</div>
          <div class="text-body2 text-grey-7">
            Год: {{ selectedVehicle.year }}<br>
            Цвет: {{ selectedVehicle.color }}<br>
            Цена: ${{ selectedVehicle.price.toLocaleString() }}
          </div>
        </q-card-section>
        <q-card-actions>
          <q-btn 
            flat 
            color="primary" 
            icon="close" 
            @click="selectedVehicle = null"
          />
        </q-card-actions>
      </q-card>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, watch, nextTick } from 'vue';
  import type { Vehicle } from '@/types/vehicle';
  import { useVehicleStore } from '@/stores/vehicleStore';
  
  interface LatLng {
    lat: number;
    lng: number;
  }
  
  interface LeafletMap {
    setView(center: LatLng, zoom: number): LeafletMap;
    addLayer(layer: any): LeafletMap;
    removeLayer(layer: any): LeafletMap;
  }
  
  interface LeafletMarker {
    addTo(map: LeafletMap): LeafletMarker;
    bindPopup(content: string): LeafletMarker;
    on(event: string, callback: () => void): LeafletMarker;
  }
  
  declare global {
    interface Window {
      L: {
        map(element: HTMLElement): LeafletMap;
        tileLayer(url: string, options: any): any;
        marker(latlng: LatLng): LeafletMarker;
        icon(options: any): any;
      };
    }
  }
  
  const vehicleStore = useVehicleStore();
  
  const mapContainer = ref<HTMLElement>();
  const selectedVehicle = ref<Vehicle | null>(null);
  
  let map: LeafletMap | null = null;
  let markers: LeafletMarker[] = [];
  
  const initMap = async () => {
    if (!mapContainer.value) return;
  
    await loadLeaflet();
  
    map = window.L.map(mapContainer.value).setView({ lat: 59.92712, lng: 30.318651 }, 12);
  
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
  };
  
  const loadLeaflet = (): Promise<void> => {
    return new Promise((resolve) => {
      if (window.L) {
        resolve();
        return;
      }
  
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
  
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => resolve();
      document.head.appendChild(script);
    });
  };
  
  const addMarkers = () => {
    if (!map) return;
  
    markers.forEach(marker => {
      map!.removeLayer(marker);
    });
    markers = [];
  
    vehicleStore.vehicles.forEach(vehicle => {
      const marker = window.L.marker({ 
        lat: vehicle.latitude, 
        lng: vehicle.longitude 
      });
  
      const popupContent = `
        <div>
          <strong>${vehicle.name} ${vehicle.model}</strong><br>
          Год: ${vehicle.year}<br>
          Цвет: ${vehicle.color}<br>
          Цена: $${vehicle.price.toLocaleString()}
        </div>
      `;
  
      marker
        .addTo(map!)
        .bindPopup(popupContent)
        .on('click', () => {
          selectedVehicle.value = vehicle;
        });
  
      markers.push(marker);
    });
  
    if (vehicleStore.vehicles.length > 1) {
      const firstVehicle = vehicleStore.vehicles[1];
      map.setView({ 
        lat: firstVehicle.latitude, 
        lng: firstVehicle.longitude 
      }, 12);
    } else {
      map.setView({
        lat: 59.92712,
        lng: 30.318651
      }, 12);
    }
  };
  
  watch(() => vehicleStore.vehicles, () => {
    if (map) {
      addMarkers();
    }
  }, { deep: true });
  
  onMounted(async () => {
    await nextTick();
    await initMap();
    
    if (vehicleStore.vehicles.length > 0) {
      addMarkers();
    } else {
      await vehicleStore.fetchVehicles();
    }
  });
  </script>
  
  <style scoped>
  .vehicle-map {
    position: relative;
    height: 100%;
  }
  
  .map-header {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .map-container {
    position: relative;
  }
  
  .map-info-panel {
    position: absolute;
    top: 80px;
    right: 16px;
    z-index: 1000;
    min-width: 250px;
  }
  
  :deep(.leaflet-popup-content) {
    margin: 8px 12px;
    line-height: 1.4;
  }
  </style>