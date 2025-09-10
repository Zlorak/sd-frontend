import React from 'react';
import { PrinterItem } from '@/types/inventory';

interface PrinterItemTableProps {
  printerItems: PrinterItem[];
  onEdit: (printerItem: PrinterItem) => void;
  onDelete: (printerItem: PrinterItem) => void;
}

export const PrinterItemTable: React.FC<PrinterItemTableProps> = ({
  printerItems,
  onEdit,
  onDelete,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "status-badge";
    switch (status) {
      case 'active':
        return `${baseClasses} status-active`;
      case 'inactive':
        return `${baseClasses} status-inactive`;
      case 'maintenance':
        return `${baseClasses} status-maintenance`;
      case 'retired':
        return `${baseClasses} status-inactive`;
      default:
        return `${baseClasses} status-inactive`;
    }
  };

  if (printerItems.length === 0) {
    return (
      <div className="table-empty-state">
        <p className="empty-text">
          No printer items found. Add some to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="professional-table">
      <div className="overflow-wrapper">
        <table className="table-base">
          <thead>
            <tr className="table-header-professional">
              <th className="table-header">Item Type</th>
              <th className="table-header">Make</th>
              <th className="table-header">Model</th>
              <th className="table-header">Quantity</th>
              <th className="table-header">Office</th>
              <th className="table-header">Status</th>
              <th className="table-header">Created</th>
              <th className="table-header">Actions</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {printerItems.map((item) => (
              <tr key={item.id} className="table-row">
                <td className="table-cell font-medium">{item.item_type}</td>
                <td className="table-cell">{item.make || '-'}</td>
                <td className="table-cell">{item.model || '-'}</td>
                <td className="table-cell">{item.quantity}</td>
                <td className="table-cell">{item.office}</td>
                <td className="table-cell">
                  <span className={getStatusBadge(item.status)}>
                    <div className={`status-indicator ${
                      item.status === 'active'
                        ? 'status-active-indicator'
                        : item.status === 'maintenance'
                        ? 'status-maintenance-indicator'
                        : 'status-inactive-indicator'
                    }`}></div>
                    {item.status}
                  </span>
                </td>
                <td className="table-cell">{formatDate(item.created_at)}</td>
                <td className="table-cell">
                  <div className="action-buttons">
                    <button
                      onClick={() => onEdit(item)}
                      className="action-button-edit"
                    >
                      <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(item)}
                      className="action-button-delete"
                    >
                      <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};