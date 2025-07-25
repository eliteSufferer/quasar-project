<template>
    <q-page class="full-height">
      <q-tabs
        v-model="activeTab"
        class="text-primary"
        indicator-color="primary"
        align="center"
        narrow-indicator
      >
        <q-tab name="table" icon="table_view" label="Таблица" />
        <q-tab name="map" icon="map" label="Карта" />
      </q-tabs>
  
      <q-separator />
  
      <q-tab-panels 
        v-model="activeTab" 
        animated 
        class="full-height"
        style="height: calc(100vh - 150px);"
      >
        <q-tab-panel name="table" class="q-pa-none full-height">
          <VehicleTable />
        </q-tab-panel>
  
        <q-tab-panel name="map" class="q-pa-none full-height">
          <VehicleMap />
        </q-tab-panel>
      </q-tab-panels>
    </q-page>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import VehicleTable from '@/components/VehicleTable.vue';
  import VehicleMap from '@/components/VehicleMap.vue';
  import { useVehicleStore } from '@/stores/vehicleStore';
  
  const activeTab = ref('table');
  const vehicleStore = useVehicleStore();
  
  onMounted(() => {
    vehicleStore.fetchVehicles();
  });
  </script>