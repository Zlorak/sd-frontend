export type Office = 'Office 1' | 'Office 2' | 'Office 3';
export type ItemStatus = 'active' | 'inactive' | 'maintenance' | 'retired';
export type ItemCategory = 'computers' | 'peripherals' | 'printer_items';
export type MakeModelCategory = 'computer' | 'peripheral' | 'printer';
export type Priority = 'low' | 'normal' | 'high' | 'urgent';
export type RestockStatus = 'pending' | 'approved' | 'ordered' | 'received' | 'cancelled';
export type AuditAction = 'INSERT' | 'UPDATE' | 'DELETE';

export interface SerialNumber {
  id: string;
  item_type: string;
  item_id: string;
  serial_number: string;
  status: ItemStatus;
  created_at: string;
  updated_at: string;
}

export interface Computer {
  id: string;
  make: string;
  model: string;
  quantity: number;
  office: Office;
  status: ItemStatus;
  created_at: string;
  updated_at: string;
  serial_numbers: SerialNumber[];
}

export interface ComputerFormData {
  make: string;
  model: string;
  serial_numbers: string[];
  quantity: number;
  office: Office;
  status: ItemStatus;
}

export interface Peripheral {
  id: string;
  item_name: string;
  make?: string;
  model?: string;
  quantity: number;
  office: Office;
  status: ItemStatus;
  created_at: string;
  updated_at: string;
  serial_numbers: SerialNumber[];
}

export interface PeripheralFormData {
  item_name: string;
  make?: string;
  model?: string;
  serial_numbers: string[];
  quantity: number;
  office: Office;
  status: ItemStatus;
}

export interface PrinterItem {
  id: string;
  item_type: string;
  make?: string;
  model?: string;
  quantity: number;
  office: Office;
  status: ItemStatus;
  created_at: string;
  updated_at: string;
}

export interface PrinterItemFormData {
  item_type: string;
  make?: string;
  model?: string;
  quantity: number;
  office: Office;
  status: ItemStatus;
}

export interface RestockRequest {
  id: string;
  item_category: ItemCategory;
  item_description: string;
  make_id?: string;
  model_id?: string;
  make_name?: string;
  model_name?: string;
  quantity_requested: number;
  office: Office;
  priority: Priority;
  status: RestockStatus;
  requested_by?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface RestockRequestFormData {
  item_category: ItemCategory;
  item_description: string;
  make_id?: string;
  model_id?: string;
  quantity_requested: number;
  office: Office;
  priority: Priority;
  status: RestockStatus;
  requested_by?: string;
  notes?: string;
}

export interface AuditLog {
  id: string;
  table_name: string;
  record_id: string;
  action: AuditAction;
  old_values?: any;
  new_values?: any;
  office?: Office;
  timestamp: string;
}

export interface InventoryCount {
  office: Office;
  total: number;
  total_quantity: number;
}

export interface StatusCount {
  status: RestockStatus;
  count: number;
}

export interface PriorityCount {
  priority: Priority;
  count: number;
}

export interface ActionCount {
  action: AuditAction;
  count: number;
}

export interface TableActivity {
  table_name: string;
  activity_count: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  error?: string;
  message?: string;
  details?: Array<{
    field: string;
    message: string;
    type: string;
  }>;
}

export interface QueryParams {
  office?: Office;
  status?: ItemStatus | RestockStatus;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface RestockQueryParams {
  office?: Office;
  status?: RestockStatus;
  priority?: Priority;
  item_category?: ItemCategory;
  limit?: number;
  offset?: number;
}

export interface AuditLogQueryParams {
  office?: Office;
  table_name?: string;
  record_id?: string;
  days?: number;
  limit?: number;
}

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

export interface OfficeContextType {
  selectedOffice: Office | null;
  setSelectedOffice: (office: Office | null) => void;
  offices: Office[];
}

export interface FormErrors {
  [key: string]: string | undefined;
}

export interface Make {
  id: string;
  name: string;
  category: MakeModelCategory;
  created_at: string;
  updated_at: string;
}

export interface MakeFormData {
  name: string;
  category: MakeModelCategory;
}

export interface Model {
  id: string;
  name: string;
  make_id: string;
  make_name: string;
  category: MakeModelCategory;
  created_at: string;
  updated_at: string;
}

export interface ModelFormData {
  name: string;
  make_id: string;
  category: MakeModelCategory;
}