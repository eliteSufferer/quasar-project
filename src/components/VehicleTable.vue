<template>
    <div class="vehicle-table">
      <q-table
        :rows="vehicleStore.vehicles"
        :columns="columns"
        :loading="vehicleStore.loading"
        row-key="id"
        :pagination="{ rowsPerPage: 10 }"
        separator="cell"
        class="full-width"
      >
        <template v-slot:top>
          <div class="text-h6">Список автомобилей</div>
          <q-space />
          <q-btn
          color="secondary"
          icon="refresh"
          label="Сбросить изменения"
          @click="() => vehicleStore.fetchVehicles(true)"
          :loading="vehicleStore.loading"
          class="q-mr-sm"
        />
        </template>
  
        <template v-slot:body-cell-price="props">
          <q-td :props="props">
            ${{ props.value.toLocaleString() }}
          </q-td>
        </template>
  
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              flat
              round
              color="primary"
              icon="edit"
              size="sm"
              @click="editVehicle(props.row)"
            />
            <q-btn
              flat
              round
              color="negative"
              icon="delete"
              size="sm"
              @click="confirmDelete(props.row)"
            />
          </q-td>
        </template>
      </q-table>
  
      <q-dialog v-model="editDialog" persistent>
        <q-card style="min-width: 400px">
          <q-card-section>
            <div class="text-h6">Редактировать автомобиль</div>
            <div class="row items-center q-gutter-x-xs text-caption text-orange ">
                <q-icon name="warning" />
             <span>Изменения сохраняются только на фронте</span>
            </div>
          </q-card-section>
  
          <q-card-section class="q-pt-none">
            <q-input
              v-model="editForm.name"
              label="Название"
              outlined
              class="q-mb-md"
            />
            <q-input
              v-model.number="editForm.price"
              label="Цена"
              type="number"
              outlined
              prefix="$"
            />
          </q-card-section>
  
          <q-card-actions align="right">
            <q-btn flat label="Отмена" v-close-popup />
            <q-btn 
              color="primary" 
              label="Сохранить" 
              @click="saveVehicle"
              :loading="saving"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
  
      <q-dialog v-model="deleteDialog" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="warning" color="negative" text-color="white" />
            <div class="q-ml-sm">
              <div>Вы уверены, что хотите удалить {{ deleteTarget?.name }} {{ deleteTarget?.model }}?</div>
              <div class="row items-center q-gutter-x-xs text-caption text-orange">
                <q-icon name="warning" />
                <span>Удаление только на фронте</span>
              </div>
            </div>
          </q-card-section>
  
          <q-card-actions align="right">
            <q-btn flat label="Отмена" v-close-popup />
            <q-btn 
              color="negative" 
              label="Удалить" 
              @click="performDelete"
              :loading="deleting"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import type { Vehicle, VehicleUpdate, TableColumn } from '@/types/vehicle';
  import { useVehicleStore } from '@/stores/vehicleStore';
  
  const vehicleStore = useVehicleStore();
  
  const editDialog = ref(false);
  const deleteDialog = ref(false);
  const saving = ref(false);
  const deleting = ref(false);
  
  const editForm = reactive<VehicleUpdate>({
    name: '',
    price: 0
  });
  const editingVehicle = ref<Vehicle | null>(null);
  const deleteTarget = ref<Vehicle | null>(null);
  
  const columns: TableColumn[] = [
    {
      name: 'name',
      label: 'Название',
      field: 'name',
      sortable: true,
      align: 'left'
    },
    {
      name: 'model',
      label: 'Модель',
      field: 'model',
      sortable: true,
      align: 'left'
    },
    {
      name: 'year',
      label: 'Год',
      field: 'year',
      sortable: true,
      align: 'center'
    },
    {
      name: 'price',
      label: 'Цена',
      field: 'price',
      sortable: true,
      align: 'right'
    },
    {
      name: 'actions',
      label: 'Действия',
      field: 'actions',
      sortable: false,
      align: 'center'
    }
  ];
  
  const editVehicle = (vehicle: Vehicle) => {
    editingVehicle.value = vehicle;
    editForm.name = vehicle.name;
    editForm.price = vehicle.price;
    editDialog.value = true;
  };
  
  const saveVehicle = async () => {
    if (!editingVehicle.value) return;
    
    saving.value = true;
    try {
      await vehicleStore.updateVehicle(editingVehicle.value.id, editForm);
      editDialog.value = false;
    } catch (error) {
      console.error('Ошибка сохранения:', error);
    } finally {
      saving.value = false;
    }
  };
  
  const confirmDelete = (vehicle: Vehicle) => {
    deleteTarget.value = vehicle;
    deleteDialog.value = true;
  };
  
  const performDelete = async () => {
    if (!deleteTarget.value) return;
    
    deleting.value = true;
    try {
      await vehicleStore.deleteVehicle(deleteTarget.value.id);
      deleteDialog.value = false;
    } catch (error) {
      console.error('Ошибка удаления:', error);
    } finally {
      deleting.value = false;
    }
  };

  </script>
  
  <style scoped>
  .vehicle-table {
    padding: 16px;
  }
  </style>