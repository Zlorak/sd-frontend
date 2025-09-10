import React, { useState } from 'react';
import { Computer } from '@/types/inventory';

interface ComputerTableProps {
  computers: Computer[];
  onEdit: (computer: Computer) => void;
  onDelete: (computer: Computer) => void;
}

export const ComputerTable: React.FC<ComputerTableProps> = ({
  computers,
  onEdit,
  onDelete,
}) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (computerId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(computerId)) {
      newExpandedRows.delete(computerId);
    } else {
      newExpandedRows.add(computerId);
    }
    setExpandedRows(newExpandedRows);
  };
  if (computers.length === 0) {
    return (
      <div className="table-empty-state">
        <p className="empty-text">No computers found.</p>
      </div>
    );
  }

  return (
    <div className="professional-table">
      <div className="overflow-wrapper">
        <table className="table-base">
          <thead>
            <tr className="table-header-professional">
              <th className="table-header">Make/Model</th>
              <th className="table-header">Serial Numbers</th>
              <th className="table-header">Quantity</th>
              <th className="table-header">Office</th>
              <th className="table-header">Status</th>
              <th className="table-header">Actions</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {computers.map((computer) => (
              <tr key={computer.id} className="table-row">
                <td className="table-cell font-medium">
                  <div className="make-model-display">
                    <div className="make-name">
                      {computer.make}
                    </div>
                    <div className="model-name">
                      {computer.model}
                    </div>
                  </div>
                </td>
                <td className="table-cell-fluid">
                  {computer.serial_numbers && computer.serial_numbers.length > 0 ? (
                    <div>
                      <button
                        onClick={() => toggleRow(computer.id)}
                        className="serial-toggle-button"
                      >
                        <svg
                          className={`serial-toggle-icon ${
                            expandedRows.has(computer.id) ? 'rotate-90' : 'rotate-0'
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="serial-toggle-text">
                          {computer.serial_numbers.length} serial number{computer.serial_numbers.length !== 1 ? 's' : ''}
                        </span>
                      </button>
                      {expandedRows.has(computer.id) && (
                        <div className="serial-list">
                          {computer.serial_numbers.map((sn, index) => (
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
                <td className="table-cell">{computer.quantity}</td>
                <td className="table-cell">{computer.office}</td>
                <td className="table-cell">
                  <span className={`status-badge ${
                    computer.status === 'active'
                      ? 'status-active'
                      : computer.status === 'maintenance'
                      ? 'status-maintenance'
                      : 'status-inactive'
                  }`}>
                    <div className={`status-indicator ${
                      computer.status === 'active'
                        ? 'status-active-indicator'
                        : computer.status === 'maintenance'
                        ? 'status-maintenance-indicator'
                        : 'status-inactive-indicator'
                    }`}></div>
                    {computer.status}
                  </span>
                </td>
                <td className="table-cell">
                  <div className="action-buttons">
                    <button
                      onClick={() => onEdit(computer)}
                      className="action-button-edit"
                    >
                      <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(computer)}
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