import React from 'react';

export default function EmptyState({
  message = 'No records match your query.',
  actionLabel = 'Clear Filter',
  onAction
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon" aria-hidden="true">Search</div>
      <p className="empty-state-message">{message}</p>
      {onAction && (
        <button className="btn btn-primary btn-compact" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
