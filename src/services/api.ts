import {
  Computer,
  ComputerFormData,
  Peripheral,
  PeripheralFormData,
  PrinterItem,
  PrinterItemFormData,
  RestockRequest,
  RestockRequestFormData,
  AuditLog,
  InventoryCount,
  StatusCount,
  PriorityCount,
  ActionCount,
  TableActivity,
  ApiResponse,
  QueryParams,
  RestockQueryParams,
  AuditLogQueryParams,
  Make,
  MakeFormData,
  Model,
  ModelFormData,
  MakeModelCategory
} from '@/types/inventory';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP error! status: ${response.status}`,
          message: data.message,
          details: data.details
        };
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: 'Network error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  private buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    
    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
  }

  // Computers API
  async getComputers(params: QueryParams = {}): Promise<ApiResponse<Computer[]>> {
    const queryString = this.buildQueryString(params);
    return this.request<Computer[]>(`/computers${queryString}`);
  }

  async getComputer(id: string): Promise<ApiResponse<Computer>> {
    return this.request<Computer>(`/computers/${id}`);
  }

  async createComputer(data: ComputerFormData): Promise<ApiResponse<Computer>> {
    return this.request<Computer>('/computers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateComputer(id: string, data: Partial<ComputerFormData>): Promise<ApiResponse<Computer>> {
    return this.request<Computer>(`/computers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteComputer(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/computers/${id}`, {
      method: 'DELETE',
    });
  }

  async getComputerCounts(): Promise<ApiResponse<InventoryCount[]>> {
    return this.request<InventoryCount[]>('/computers/counts');
  }

  // Peripherals API
  async getPeripherals(params: QueryParams = {}): Promise<ApiResponse<Peripheral[]>> {
    const queryString = this.buildQueryString(params);
    return this.request<Peripheral[]>(`/peripherals${queryString}`);
  }

  async getPeripheral(id: string): Promise<ApiResponse<Peripheral>> {
    return this.request<Peripheral>(`/peripherals/${id}`);
  }

  async createPeripheral(data: PeripheralFormData): Promise<ApiResponse<Peripheral>> {
    return this.request<Peripheral>('/peripherals', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePeripheral(id: string, data: Partial<PeripheralFormData>): Promise<ApiResponse<Peripheral>> {
    return this.request<Peripheral>(`/peripherals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePeripheral(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/peripherals/${id}`, {
      method: 'DELETE',
    });
  }

  async getPeripheralCounts(): Promise<ApiResponse<InventoryCount[]>> {
    return this.request<InventoryCount[]>('/peripherals/counts');
  }

  // Printer Items API
  async getPrinterItems(params: QueryParams = {}): Promise<ApiResponse<PrinterItem[]>> {
    const queryString = this.buildQueryString(params);
    return this.request<PrinterItem[]>(`/printer-items${queryString}`);
  }

  async getPrinterItem(id: string): Promise<ApiResponse<PrinterItem>> {
    return this.request<PrinterItem>(`/printer-items/${id}`);
  }

  async createPrinterItem(data: PrinterItemFormData): Promise<ApiResponse<PrinterItem>> {
    return this.request<PrinterItem>('/printer-items', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePrinterItem(id: string, data: Partial<PrinterItemFormData>): Promise<ApiResponse<PrinterItem>> {
    return this.request<PrinterItem>(`/printer-items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePrinterItem(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/printer-items/${id}`, {
      method: 'DELETE',
    });
  }

  async getPrinterItemCounts(): Promise<ApiResponse<InventoryCount[]>> {
    return this.request<InventoryCount[]>('/printer-items/counts');
  }

  async getPrinterItemsByType(type: string, office?: string): Promise<ApiResponse<PrinterItem[]>> {
    const params = office ? { office } : {};
    const queryString = this.buildQueryString(params);
    return this.request<PrinterItem[]>(`/printer-items/by-type/${type}${queryString}`);
  }

  // Restock Requests API
  async getRestockRequests(params: RestockQueryParams = {}): Promise<ApiResponse<RestockRequest[]>> {
    const queryString = this.buildQueryString(params);
    return this.request<RestockRequest[]>(`/restock-requests${queryString}`);
  }

  async getRestockRequest(id: string): Promise<ApiResponse<RestockRequest>> {
    return this.request<RestockRequest>(`/restock-requests/${id}`);
  }

  async createRestockRequest(data: RestockRequestFormData): Promise<ApiResponse<RestockRequest>> {
    return this.request<RestockRequest>('/restock-requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateRestockRequest(id: string, data: Partial<RestockRequestFormData>): Promise<ApiResponse<RestockRequest>> {
    return this.request<RestockRequest>(`/restock-requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteRestockRequest(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/restock-requests/${id}`, {
      method: 'DELETE',
    });
  }

  async getRestockRequestStatusCounts(office?: string): Promise<ApiResponse<StatusCount[]>> {
    const params = office ? { office } : {};
    const queryString = this.buildQueryString(params);
    return this.request<StatusCount[]>(`/restock-requests/status-counts${queryString}`);
  }

  async getPendingRestockRequestsByPriority(office?: string): Promise<ApiResponse<PriorityCount[]>> {
    const params = office ? { office } : {};
    const queryString = this.buildQueryString(params);
    return this.request<PriorityCount[]>(`/restock-requests/pending-priority${queryString}`);
  }

  // Audit Log API
  async getAuditLogs(params: AuditLogQueryParams = {}): Promise<ApiResponse<AuditLog[]>> {
    const queryString = this.buildQueryString(params);
    return this.request<AuditLog[]>(`/audit-log${queryString}`);
  }

  async getRecentAuditLogs(params: AuditLogQueryParams = {}): Promise<ApiResponse<AuditLog[]>> {
    const queryString = this.buildQueryString(params);
    return this.request<AuditLog[]>(`/audit-log/recent${queryString}`);
  }

  async getAuditLogActionCounts(params: { office?: string; days?: number } = {}): Promise<ApiResponse<ActionCount[]>> {
    const queryString = this.buildQueryString(params);
    return this.request<ActionCount[]>(`/audit-log/action-counts${queryString}`);
  }

  async getAuditLogTableActivity(params: { office?: string; days?: number } = {}): Promise<ApiResponse<TableActivity[]>> {
    const queryString = this.buildQueryString(params);
    return this.request<TableActivity[]>(`/audit-log/table-activity${queryString}`);
  }

  async getAuditLogForRecord(tableName: string, recordId: string): Promise<ApiResponse<AuditLog[]>> {
    return this.request<AuditLog[]>(`/audit-log/${tableName}/${recordId}`);
  }

  // Reports API
  async getInventorySummaryReport(office?: string): Promise<ApiResponse<any>> {
    const params = office ? { office } : {};
    const queryString = this.buildQueryString(params);
    return this.request(`/reports/inventory-summary${queryString}`);
  }

  async getRestockRequestsReport(office?: string): Promise<ApiResponse<any>> {
    const params = office ? { office } : {};
    const queryString = this.buildQueryString(params);
    return this.request(`/reports/restock-requests${queryString}`);
  }

  async getActivityReport(office?: string): Promise<ApiResponse<any>> {
    const params = office ? { office } : {};
    const queryString = this.buildQueryString(params);
    return this.request(`/reports/activity${queryString}`);
  }

  async getOfficeComparisonReport(): Promise<ApiResponse<any>> {
    return this.request('/reports/office-comparison');
  }

  // Makes API
  async getMakes(category?: MakeModelCategory): Promise<ApiResponse<Make[]>> {
    const params = category ? { category } : {};
    const queryString = this.buildQueryString(params);
    return this.request<Make[]>(`/makes${queryString}`);
  }

  async getMake(id: string): Promise<ApiResponse<Make>> {
    return this.request<Make>(`/makes/${id}`);
  }

  async createMake(data: MakeFormData): Promise<ApiResponse<Make>> {
    return this.request<Make>('/makes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateMake(id: string, data: MakeFormData): Promise<ApiResponse<Make>> {
    return this.request<Make>(`/makes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteMake(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/makes/${id}`, {
      method: 'DELETE',
    });
  }

  // Models API
  async getModels(category?: MakeModelCategory, makeId?: string): Promise<ApiResponse<Model[]>> {
    const params: Record<string, string> = {};
    if (category) params.category = category;
    if (makeId) params.make_id = makeId;
    const queryString = this.buildQueryString(params);
    return this.request<Model[]>(`/models${queryString}`);
  }

  async getModel(id: string): Promise<ApiResponse<Model>> {
    return this.request<Model>(`/models/${id}`);
  }

  async createModel(data: ModelFormData): Promise<ApiResponse<Model>> {
    return this.request<Model>('/models', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateModel(id: string, data: ModelFormData): Promise<ApiResponse<Model>> {
    return this.request<Model>(`/models/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteModel(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/models/${id}`, {
      method: 'DELETE',
    });
  }

  // Health check
  async getHealth(): Promise<ApiResponse<{ message: string; database: string; timestamp: string }>> {
    return this.request('/health');
  }
}

export const apiClient = new ApiClient();
export default apiClient;