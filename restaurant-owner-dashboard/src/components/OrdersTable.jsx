import React, { useMemo, useState } from 'react';
import './OrdersTable.css';

const OrdersTable = ({ orders = [] }) => {
  const [sortField, setSortField] = useState('Order_ID');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const itemsPerPage = 10;

  const filteredAndSortedOrders = useMemo(() => {
    if (!orders || orders.length === 0) return [];

    let filtered = [...orders];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.Customer_Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.Order_ID?.toString().includes(searchTerm) ||
        order.Customer_Phone?.includes(searchTerm)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.Order_Status === statusFilter);
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(order => order.Order_Type === typeFilter);
    }

    // Sort orders
    return filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle nested values
      if (sortField === 'Items') {
        aValue = a.Items?.length || 0;
        bValue = b.Items?.length || 0;
      } else if (sortField === 'Total') {
        aValue = a.Items?.reduce((sum, item) => sum + (item.Total_Price || 0), 0) || 0;
        bValue = b.Items?.reduce((sum, item) => sum + (item.Total_Price || 0), 0) || 0;
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [orders, sortField, sortDirection, searchTerm, statusFilter, typeFilter]);

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedOrders, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedOrders.length / itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    setCurrentPage(1);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Delivered': return 'status-delivered';
      case 'In Transit': return 'status-transit';
      case 'Pending': return 'status-pending';
      default: return 'status-unknown';
    }
  };

  const calculateOrderTotal = (items) => {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((sum, item) => sum + (item.Total_Price || 0), 0);
  };

  if (orders.length === 0) {
    return (
      <div className="orders-table">
        <h3>Recent Orders</h3>
        <div className="no-data">No orders available</div>
      </div>
    );
  }

  return (
    <div className="orders-table">
      <div className="table-header">
        <h3>Orders Management</h3>
        <div className="table-filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Transit">In Transit</option>
            <option value="Delivered">Delivered</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Types</option>
            <option value="Online">Online</option>
            <option value="Dine In">Dine In</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('Order_ID')} className="sortable">
                Order ID {sortField === 'Order_ID' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('Customer_Name')} className="sortable">
                Customer {sortField === 'Customer_Name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('Order_Date')} className="sortable">
                Date {sortField === 'Order_Date' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('Order_Type')} className="sortable">
                Type {sortField === 'Order_Type' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('Items')} className="sortable">
                Items {sortField === 'Items' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('Total')} className="sortable">
                Total {sortField === 'Total' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('Order_Status')} className="sortable">
                Status {sortField === 'Order_Status' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((order) => (
              <React.Fragment key={order.Order_ID}>
                <tr>
                  <td>{order.Order_ID}</td>
                  <td>
                    <div className="customer-info">
                      <div className="customer-name">{order.Customer_Name || 'N/A'}</div>
                      <div className="customer-phone">{order.Customer_Phone || 'N/A'}</div>
                    </div>
                  </td>
                  <td>
                    {order.Order_Date ? new Date(order.Order_Date).toLocaleDateString() : 'N/A'}
                  </td>
                  <td>
                    <span className={`type-badge ${order.Order_Type === 'Online' ? 'online' : 'dine-in'}`}>
                      {order.Order_Type || 'N/A'}
                    </span>
                  </td>
                  <td>{order.Items?.length || 0}</td>
                  <td>${calculateOrderTotal(order.Items).toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(order.Order_Status)}`}>
                      {order.Order_Status || 'Unknown'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="expand-btn"
                      onClick={() => setExpandedOrder(expandedOrder === order.Order_ID ? null : order.Order_ID)}
                    >
                      {expandedOrder === order.Order_ID ? '▼' : '▶'}
                    </button>
                  </td>
                </tr>
                {expandedOrder === order.Order_ID && (
                  <tr className="expanded-row">
                    <td colSpan="8">
                      <div className="order-details">
                        <div className="details-section">
                          <h4>Order Information</h4>
                          <div className="order-info">
                            <div><strong>Order Date:</strong> {order.Order_Date ? new Date(order.Order_Date).toLocaleString() : 'N/A'}</div>
                            <div><strong>Order Type:</strong> {order.Order_Type || 'N/A'}</div>
                            <div><strong>Order Status:</strong> {order.Order_Status || 'N/A'}</div>
                          </div>
                        </div>
                        <div className="details-section">
                          <h4>Order Items</h4>
                          <div className="items-list">
                            {order.Items?.map((item, index) => (
                              <div key={index} className="item-row">
                                <span className="item-name">{item.Item_Name}</span>
                                <span className="item-type">{item.Item_Type || 'N/A'}</span>
                                <span className="item-quantity">Qty: {item.Quantity}</span>
                                <span className="item-price">${item.Total_Price?.toFixed(2)}</span>
                                {item.Rating && <span className="item-rating">⭐ {item.Rating}</span>}
                              </div>
                            )) || <div>No items found</div>}
                          </div>
                        </div>
                        <div className="details-section">
                          <h4>Delivery Information</h4>
                          <div className="delivery-info">
                            <div><strong>Delivery Person:</strong> {order.Delivery_Person || 'N/A'}</div>
                            <div><strong>Address:</strong> {order.Customer_Address || 'N/A'}</div>
                            <div><strong>Delivery Status:</strong> {order.Delivery_Status || 'N/A'}</div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="table-footer">
        <div className="results-info">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedOrders.length)} of {filteredAndSortedOrders.length} orders
        </div>
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="page-info">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersTable;
