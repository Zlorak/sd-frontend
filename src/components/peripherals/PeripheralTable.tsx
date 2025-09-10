import React, { useState } from 'react';
import { Peripheral } from '@/types/inventory';

interface PeripheralTableProps {
  peripherals: Peripheral[];
  onEdit: (peripheral: Peripheral) => void;
  onDelete: (peripheral: Peripheral) => void;
}

export const PeripheralTable: React.FC<PeripheralTableProps> = ({
  peripherals,
  onEdit,
  onDelete,
}) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (peripheralId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(peripheralId)) {
      newExpandedRows.delete(peripheralId);
    } else {
      newExpandedRows.add(peripheralId);
    }
    setExpandedRows(newExpandedRows);
  };

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

  if (peripherals.length === 0) {
    return (
      <div className="table-empty-state">
        <p className="empty-text">No peripherals found.</p>
      </div>
    );
  }

  return (
    <div className="professional-table">
      <div className="overflow-wrapper">
        <table className="table-base">
          <thead>
            <tr className="table-header-professional">
              <th className="table-header">Item Name</th>
              <th className="table-header">Make/Model</th>
              <th className="table-header">Serial Numbers</th>
              <th className="table-header">Quantity</th>
              <th className="table-header">Office</th>
              <th className="table-header">Status</th>
              <th className="table-header">Actions</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {peripherals.map((peripheral) => (
              <tr key={peripheral.id} className="table-row">
                <td className="table-cell font-medium">{peripheral.item_name}</td>
                <td className="table-cell">
                  <div className="make-model-display">
                    <div className="make-name">
                      {peripheral.make || '-'}
                    </div>
                    <div className="model-name">
                      {peripheral.model || '-'}
                    </div>
                  </div>
                </td>
                <td className="table-cell-fluid">
                  {peripheral.serial_numbers && peripheral.serial_numbers.length > 0 ? (
                    <div>
                      <button
                        onClick={() => toggleRow(peripheral.id)}
                        className="serial-toggle-button"
                      >
                        <svg
                          className={`serial-toggle-icon ${
                            expandedRows.has(peripheral.id) ? 'rotate-90' : 'rotate-0'
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="serial-toggle-text">
                          {peripheral.serial_numbers.length} serial number{peripheral.serial_numbers.length !== 1 ? 's' : ''}
                        </span>
                      </button>
                      {expandedRows.has(peripheral.id) && (
                        <div className="serial-list">
                          {peripheral.serial_numbers.map((sn, index) => (
                            <div key={sn.id || index} className="serial-item">
                              {sn.serial_number || `(Empty ${index + 1})`}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="no-serials-text">No serial numbers</span>
                  )}
                </td>
                <td className="table-cell">{peripheral.quantity}</td>
                <td className="table-cell">{peripheral.office}</td>
                <td className="table-cell">
                  <span className={getStatusBadge(peripheral.status)}>
                    <div className={`status-indicator ${
                      peripheral.status === 'active'
                        ? 'status-active-indicator'
                        : peripheral.status === 'maintenance'
                        ? 'status-maintenance-indicator'
                        : 'status-inactive-indicator'
                    }`}></div>
                    {peripheral.status}
                  </span>
                </td>
                <td className="table-cell">
                  <div className="action-buttons">
                    <button
                      onClick={() => onEdit(peripheral)}
                      className="action-button-edit"
                    >
                      <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(peripheral)}
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