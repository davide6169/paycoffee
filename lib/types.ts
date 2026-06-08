// Person data structure
export interface Person {
  id: string;           // UUID for unique identification
  name: string;         // Person name (unique within list)
  credits: number;      // Credit balance (can be negative)
  date: string;         // Last payment date in YYYY-MM-DD format or empty string
  checked: boolean;     // Selection state for payment operations
}

// Payment state for tracking payment operations
export interface PaymentState {
  isProcessing: boolean;
  payerId: string | null;
  selectedCount: number;
  amount: number;
}

// App context state
export interface AppState {
  persons: Person[];
  isEditMode: boolean;
  paymentDialogOpen: boolean;
  addPersonDialogOpen: boolean;
  infoViewOpen: boolean;
  exportImportMenuOpen: boolean;
  selectedPayer: Person | null;
}

// App context actions
export interface AppActions {
  addPerson: (name: string) => void;
  removePerson: (id: string) => void;
  updatePerson: (id: string, updates: Partial<Person>) => void;
  toggleCheck: (id: string) => void;
  checkAll: () => void;
  uncheckAll: () => void;
  processPayment: (payerId: string) => void;
  setEditMode: (enabled: boolean) => void;
  openPaymentDialog: (payer: Person) => void;
  closePaymentDialog: () => void;
  openAddPersonDialog: () => void;
  closeAddPersonDialog: () => void;
  openInfoView: () => void;
  closeInfoView: () => void;
  openExportImportMenu: () => void;
  closeExportImportMenu: () => void;
  exportToCSV: () => string;
  importFromCSV: (csvData: string) => boolean;
  autoSort: () => void;
  resetToDefault: () => void;
  reorderPersons: (fromIndex: number, toIndex: number) => void;
}

// Payment result from smart algorithm
export interface PaymentResult {
  payerId: string;
  payerName: string;
  selectedCount: number;
  amount: number;
  creditsChange: number;
}

// Export/Import data format (compatible with iOS app)
export interface ExportData {
  name: string;
  credits: number;
  date: string;
}

// CSV parsing result
export interface CSVImportResult {
  success: boolean;
  persons?: Person[];
  error?: string;
}
