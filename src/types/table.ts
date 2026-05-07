export interface Table {
  id: number;
  displayId?: number;
  isReserved: boolean;
}

export interface TableState {
  tables: Table[];
  setTables: (tables: Table[]) => void;
}