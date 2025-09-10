import React from 'react';
import { RestockRequest } from '@/types/inventory';

interface RestockRequestTableProps {
  restockRequests: RestockRequest[];
  onEdit: (restockRequest: RestockRequest) => void;
  onDelete: (restockRequest: RestockRequest) => void;
}

export const RestockRequestTable: React.FC<RestockRequestTableProps> = ({
  restockRequests,
  onEdit,
  onDelete,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "status-badge";
    switch (status) {
      case 'pending':
        return `${baseClasses} status-pending`;
      case 'approved':
        return `${baseClasses} status-approved`;
      case 'ordered':
        return `${baseClasses} status-ordered`;
      case 'received':
        return `${baseClasses} status-received`;
      case 'cancelled':
        return `${baseClasses} status-cancelled`;
      default:
        return `${baseClasses} status-inactive`;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const baseClasses = "status-badge";
    switch (priority) {
      case 'urgent':
        return `${baseClasses} priority-urgent`;
      case 'high':
        return `${baseClasses} priority-high`;
      case 'normal':
        return `${baseClasses} priority-normal`;
      case 'low':
        return `${baseClasses} priority-low`;
      default:
        return `${baseClasses} priority-low`;
    }
  };

  if (restockRequests.length === 0) {
    return (
      <div className="card p-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">No restock requests found.</p>
      </div>
    );
  }

  return (
    <div className="professional-table">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr className="table-header-professional">
              <th className="table-header">Category</th>
              <th className="table-header">Item Description</th>
              <th className="table-header">Make/Model</th>
              <th className="table-header">Quantity</th>
              <th className="table-header">Office</th>
              <th className="table-header">Priority</th>
              <th className="table-header">Status</th>
              <th className="table-header">Requested By</th>
              <th className="table-header">Created</th>
              <th className="table-header">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {restockRequests.map((request) => (
              <tr key={request.id} className="table-row">
                <td className="table-cell capitalize">
                  {request.item_category.replace('_', ' ')}
                </td>
                <td className="table-cell-fluid">
                  <div className="max-w-xs truncate" title={request.item_description}>
                    {request.item_description}
                  </div>
                </td>
                <td className="table-cell">
                  {request.make_name && request.model_name ? (
                    <div className="make-model-display">
                      <div className="make-name">{request.make_name}</div>
                      <div className="model-name">{request.model_name}</div>
                    </div>
                  ) : request.make_name ? (
                    <div className="make-name">{request.make_name}</div>
                  ) : (
                    <span className="empty-value">-</span>
                  )}
                </td>
                <td className="table-cell">
                  {request.quantity_requested}
                </td>
                <td className="table-cell">
                  {request.office}
                </td>
                <td className="table-cell">
                  <span className={getPriorityBadge(request.priority)}>
                    {request.priority}
                  </span>
                </td>
                <td className="table-cell">
                  <span className={getStatusBadge(request.status)}>
                    {request.status}
                  </span>
                </td>
                <td className="table-cell">
                  {request.requested_by || '-'}
                </td>
                <td className="table-cell">
                  {formatDate(request.created_at)}
                </td>
                <td className="table-cell">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(request)}
                      className="action-button-edit"
                    >
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(request)}
                      className="action-button-delete"
                    >
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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