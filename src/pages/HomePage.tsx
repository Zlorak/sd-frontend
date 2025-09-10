import React from 'react';
import { useApi } from '@/hooks/useApi';
import { useOfficeFilter } from '@/hooks/useOfficeFilter';
import { Loading } from '@/components/common/Loading';
import { apiClient } from '@/services/api';

export const HomePage: React.FC = () => {
  const { selectedOffice } = useOfficeFilter();
  
  const { data: computerCounts, loading: loadingComputers } = useApi(
    () => apiClient.getComputerCounts(),
    [selectedOffice]
  );
  
  const { data: peripheralCounts, loading: loadingPeripherals } = useApi(
    () => apiClient.getPeripheralCounts(),
    [selectedOffice]
  );
  
  const { data: printerItemCounts, loading: loadingPrinterItems } = useApi(
    () => apiClient.getPrinterItemCounts(),
    [selectedOffice]
  );

  const { data: recentAuditLogs, loading: loadingAuditLogs } = useApi(
    () => apiClient.getRecentAuditLogs({ office: selectedOffice || undefined, limit: 5 }),
    [selectedOffice]
  );

  const { data: pendingRequests, loading: loadingRequests } = useApi(
    () => apiClient.getRestockRequests({ status: 'pending', office: selectedOffice || undefined, limit: 5 }),
    [selectedOffice]
  );

  const isLoading = loadingComputers || loadingPeripherals || loadingPrinterItems;

  const getOfficeData = (counts: any[], office: string) => {
    return counts?.find(c => c.office === office) || { total: 0, total_quantity: 0 };
  };

  const getTotalForOffice = (office: string) => {
    const computers = getOfficeData(computerCounts || [], office);
    const peripherals = getOfficeData(peripheralCounts || [], office);
    const printerItems = getOfficeData(printerItemCounts || [], office);
    
    return {
      items: computers.total + peripherals.total + printerItems.total,
      quantity: computers.total_quantity + peripherals.total_quantity + printerItems.total_quantity,
    };
  };

  const offices = ['Office 1', 'Office 2', 'Office 3'];
  const filteredOffices = selectedOffice ? [selectedOffice] : offices;

  if (isLoading) {
    return <Loading text="Loading dashboard..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Dashboard
        </h1>
        {selectedOffice && (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Showing data for {selectedOffice}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOffices.map((office) => {
          const totals = getTotalForOffice(office);
          const computers = getOfficeData(computerCounts || [], office);
          const peripherals = getOfficeData(peripheralCounts || [], office);
          const printerItems = getOfficeData(printerItemCounts || [], office);

          return (
            <div key={office} className="metrics-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {office}
                </h2>
                <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-800 dark:to-primary-900 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="metrics-number">{totals.items}</div>
                  <div className="metrics-label">Total Items</div>
                </div>
                <div className="text-center">
                  <div className="metrics-number">{totals.quantity}</div>
                  <div className="metrics-label">Total Units</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Computers:</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {computers.total} ({computers.total_quantity})
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Peripherals:</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {peripherals.total} ({peripherals.total_quantity})
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Printer Items:</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {printerItems.total} ({printerItems.total_quantity})
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="metrics-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Recent Activity
            </h2>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          {loadingAuditLogs ? (
            <div className="text-sm text-gray-500 dark:text-gray-400">Loading recent activity...</div>
          ) : recentAuditLogs && recentAuditLogs.length > 0 ? (
            <div className="space-y-3">
              {recentAuditLogs.map((log: any, index: number) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {log.action} in {log.table_name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {log.office} • {new Date(log.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                  <div className={`px-2 py-1 text-xs rounded-full ${
                    log.action === 'CREATE' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    log.action === 'UPDATE' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {log.action}
                  </div>
                </div>
              ))}
              <div className="pt-2">
                <a href="/audit-log" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                  View all activity →
                </a>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500 dark:text-gray-400">No recent activity</div>
          )}
        </div>

        <div className="metrics-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Pending Requests
            </h2>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          {loadingRequests ? (
            <div className="text-sm text-gray-500 dark:text-gray-400">Loading pending requests...</div>
          ) : pendingRequests && pendingRequests.length > 0 ? (
            <div className="space-y-3">
              {pendingRequests.map((request: any) => (
                <div key={request.id} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {request.item_name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {request.office} • {request.requested_quantity} units
                    </div>
                  </div>
                  <div className={`px-2 py-1 text-xs rounded-full ${
                    request.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                    request.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}>
                    {request.priority}
                  </div>
                </div>
              ))}
              <div className="pt-2">
                <a href="/restock-requests" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                  View all requests →
                </a>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500 dark:text-gray-400">No pending requests</div>
          )}
        </div>
      </div>
    </div>
  );
};