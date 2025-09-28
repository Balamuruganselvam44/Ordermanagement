import React, { useMemo } from 'react';
import './StatusSummary.css';

const StatusSummary = ({ orders = [] }) => {
  const statusCounts = useMemo(() => {
    if (!orders || orders.length === 0) {
      return { Pending: 0, 'In Transit': 0, Delivered: 0 };
    }

    return orders.reduce((counts, order) => {
      const status = order.Order_Status || 'Pending';
      counts[status] = (counts[status] || 0) + 1;
      return counts;
    }, {});
  }, [orders]);

  const statusConfig = {
    Pending: { color: '#f39c12', icon: '⏳' },
    'In Transit': { color: '#3498db', icon: '🚚' },
    Delivered: { color: '#27ae60', icon: '✅' }
  };

  return (
    <div className="status-summary">
      <h3>Order Status Summary</h3>
      <div className="status-grid">
        {Object.entries(statusCounts).map(([status, count]) => {
          const config = statusConfig[status] || { color: '#95a5a6', icon: '❓' };
          return (
            <div key={status} className="status-item">
              <div className="status-icon" style={{ backgroundColor: config.color }}>
                {config.icon}
              </div>
              <div className="status-info">
                <div className="status-count">{count}</div>
                <div className="status-label">{status}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusSummary;
