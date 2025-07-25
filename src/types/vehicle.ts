export interface Vehicle {
    id: number;
    name: string;
    model: string;
    year: number;
    color: string;
    price: number;
    latitude: number;
    longitude: number;
  }
  
  export interface VehicleUpdate {
    name: string;
    price: number;
  }
  
  export interface TableColumn {
    name: string;
    label: string;
    field: string | ((row: Vehicle) => unknown);
    sortable?: boolean;
    align?: 'left' | 'right' | 'center';
    format?: (val: unknown) => string;
  }