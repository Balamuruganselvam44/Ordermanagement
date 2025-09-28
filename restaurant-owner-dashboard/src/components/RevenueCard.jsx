import React, { useMemo } from 'react';
import './RevenueCard.css';

const RevenueCard = ({ orders = [] }) => {
  const revenueData = useMemo(() => {
    if (!orders || orders.length === 0) {
      return {
        totalRevenue: 0,
        averageOrderValue: 0,
        totalOrders: 0,
        onlineRevenue: 0,
        dineInRevenue: 0,
        onlineOrders: 0,
        dineInOrders: 0
      };
    }

    const deliveredOrders = orders.filter(order => order.Order_Status === 'Delivered');
    
    const totalRevenue = deliveredOrders.reduce((total, order) => {
      const orderTotal = order.Items?.reduce((sum, item) => sum + (item.Total_Price || 0), 0) || 0;
      return total + orderTotal;
    }, 0);

    const onlineOrders = deliveredOrders.filter(order => order.Order_Type === 'Online');
    const dineInOrders = deliveredOrders.filter(order => order.Order_Type === 'Dine In');

    const onlineRevenue = onlineOrders.reduce((total, order) => {
      const orderTotal = order.Items?.reduce((sum, item) => sum + (item.Total_Price || 0), 0) || 0;
      return total + orderTotal;
    }, 0);

    const dineInRevenue = dineInOrders.reduce((total, order) => {
      const orderTotal = order.Items?.reduce((sum, item) => sum + (item.Total_Price || 0), 0) || 0;
      return total + orderTotal;
    }, 0);

    return {
      totalRevenue,
      averageOrderValue: deliveredOrders.length > 0 ? totalRevenue / deliveredOrders.length : 0,
      totalOrders: deliveredOrders.length,
      onlineRevenue,
      dineInRevenue,
      onlineOrders: onlineOrders.length,
      dineInOrders: dineInOrders.length
    };
  }, [orders]);

  const formatCurrency = (amount) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);

  return (
    <div className="revenue-card">
      <div className="card-header">
        <h3>Revenue Analytics</h3>
        <div className="revenue-icon">💰</div>
      </div>
      <div className="card-content">
        <div className="main-metric">
          <div className="revenue-amount">{formatCurrency(revenueData.totalRevenue)}</div>
          <div className="revenue-subtitle">Total Revenue ({revenueData.totalOrders} orders)</div>
        </div>
        
        <div className="revenue-breakdown">
          <div className="breakdown-item">
            <div className="breakdown-label">Average Order Value</div>
            <div className="breakdown-value">{formatCurrency(revenueData.averageOrderValue)}</div>
          </div>
          
          <div className="breakdown-section">
            <div className="breakdown-item">
              <div className="breakdown-label">Online Orders</div>
              <div className="breakdown-value">{formatCurrency(revenueData.onlineRevenue)}</div>
              <div className="breakdown-count">({revenueData.onlineOrders} orders)</div>
            </div>
            
            <div className="breakdown-item">
              <div className="breakdown-label">Dine In Orders</div>
              <div className="breakdown-value">{formatCurrency(revenueData.dineInRevenue)}</div>
              <div className="breakdown-count">({revenueData.dineInOrders} orders)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueCard;
