import React, { useMemo } from 'react';
import './PerformanceMetrics.css';

const PerformanceMetrics = ({ orders = [] }) => {
  const metrics = useMemo(() => {
    if (!orders || orders.length === 0) {
      return {
        totalOrders: 0,
        deliveredOrders: 0,
        pendingOrders: 0,
        inTransitOrders: 0,
        averageOrderValue: 0,
        totalRevenue: 0,
        onlineOrders: 0,
        dineInOrders: 0,
        averageItemsPerOrder: 0,
        topDeliveryPerson: null,
        successRate: 0,
        customerSatisfaction: 0,
        peakHourOrders: 0,
        weekendOrders: 0,
        averagePreparationTime: 0,
        foodVsBeverageRatio: 0,
        dailyOrderTrend: [],
        hourlyDistribution: []
      };
    }

    const totalOrders = orders.length;
    const deliveredOrders = orders.filter(order => order.Order_Status === 'Delivered').length;
    const pendingOrders = orders.filter(order => order.Order_Status === 'Pending').length;
    const inTransitOrders = orders.filter(order => order.Order_Status === 'In Transit').length;
    
    const totalRevenue = orders
      .filter(order => order.Order_Status === 'Delivered')
      .reduce((total, order) => {
        const orderTotal = order.Items?.reduce((sum, item) => sum + (item.Total_Price || 0), 0) || 0;
        return total + orderTotal;
      }, 0);

    const averageOrderValue = deliveredOrders > 0 ? totalRevenue / deliveredOrders : 0;
    
    const onlineOrders = orders.filter(order => order.Order_Type === 'Online').length;
    const dineInOrders = orders.filter(order => order.Order_Type === 'Dine In').length;
    
    const totalItems = orders.reduce((total, order) => {
      return total + (order.Items?.length || 0);
    }, 0);
    
    const averageItemsPerOrder = totalOrders > 0 ? totalItems / totalOrders : 0;

    // Delivery person performance
    const deliveryStats = {};
    orders.forEach(order => {
      const person = order.Delivery_Person || 'Unknown';
      if (!deliveryStats[person]) {
        deliveryStats[person] = { total: 0, delivered: 0 };
      }
      deliveryStats[person].total += 1;
      if (order.Delivery_Status === 'Delivered') {
        deliveryStats[person].delivered += 1;
      }
    });

    const topDeliveryPerson = Object.entries(deliveryStats)
      .map(([name, stats]) => ({
        name,
        successRate: stats.total > 0 ? (stats.delivered / stats.total) * 100 : 0,
        totalOrders: stats.total
      }))
      .sort((a, b) => b.successRate - a.successRate)[0];

    const successRate = totalOrders > 0 ? (deliveredOrders / totalOrders) * 100 : 0;

    // Customer satisfaction based on order completion rate
    const customerSatisfaction = successRate;

    // Time-based analytics
    const ordersWithDates = orders.filter(order => order.Order_Date);
    const peakHourOrders = ordersWithDates.filter(order => {
      const hour = new Date(order.Order_Date).getHours();
      return hour >= 18 && hour <= 21; // Peak dinner hours
    }).length;

    const weekendOrders = ordersWithDates.filter(order => {
      const day = new Date(order.Order_Date).getDay();
      return day === 0 || day === 6; // Sunday or Saturday
    }).length;

    // Daily order trend
    const dailyOrderTrend = ordersWithDates.reduce((acc, order) => {
      const date = new Date(order.Order_Date).toDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    // Hourly distribution
    const hourlyDistribution = ordersWithDates.reduce((acc, order) => {
      const hour = new Date(order.Order_Date).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {});

    // Food vs Beverage ratio
    const allItems = orders.flatMap(order => order.Items || []);
    const foodItems = allItems.filter(item => item.Item_Type === 'Food').length;
    const beverageItems = allItems.filter(item => item.Item_Type === 'Beverage').length;
    const foodVsBeverageRatio = beverageItems > 0 ? (foodItems / beverageItems).toFixed(1) : foodItems;

    return {
      totalOrders,
      deliveredOrders,
      pendingOrders,
      inTransitOrders,
      averageOrderValue,
      totalRevenue,
      onlineOrders,
      dineInOrders,
      averageItemsPerOrder,
      topDeliveryPerson,
      successRate,
      customerSatisfaction,
      peakHourOrders,
      weekendOrders,
      foodVsBeverageRatio,
      dailyOrderTrend: Object.entries(dailyOrderTrend).map(([date, count]) => ({ date, count })),
      hourlyDistribution: Object.entries(hourlyDistribution).map(([hour, count]) => ({ hour: parseInt(hour), count }))
    };
  }, [orders]);

  const formatCurrency = (amount) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);


  const getStatusLabel = (value, type) => {
    if (type === 'percentage') {
      if (value >= 90) return 'excellent';
      if (value >= 75) return 'good';
      if (value >= 60) return 'average';
      return 'poor';
    }
    if (type === 'satisfaction') {
      if (value >= 85) return 'excellent';
      if (value >= 70) return 'good';
      if (value >= 55) return 'average';
      return 'poor';
    }
    return 'average';
  };

  return (
    <div className="performance-metrics">
      <h3>Performance Metrics</h3>
      
      <div className="metrics-grid">
        {/* Order Statistics */}
        <div className="metric-card">
          <div className="metric-header">
            <h4>Order Statistics</h4>
            <div className="metric-icon">📊</div>
          </div>
          <div className="metric-content">
            <div className="metric-item">
              <span className="metric-label">Total Orders</span>
              <span className="metric-value">{metrics.totalOrders}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Delivered</span>
              <span className="metric-value success">{metrics.deliveredOrders}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Pending</span>
              <span className="metric-value warning">{metrics.pendingOrders}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">In Transit</span>
              <span className="metric-value info">{metrics.inTransitOrders}</span>
            </div>
          </div>
        </div>

        {/* Revenue Analytics */}
        <div className="metric-card">
          <div className="metric-header">
            <h4>Revenue Analytics</h4>
            <div className="metric-icon">💰</div>
          </div>
          <div className="metric-content">
            <div className="metric-item">
              <span className="metric-label">Total Revenue</span>
              <span className="metric-value">{formatCurrency(metrics.totalRevenue)}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Average Order Value</span>
              <span className="metric-value">{formatCurrency(metrics.averageOrderValue)}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Online Orders</span>
              <span className="metric-value">{metrics.onlineOrders}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Dine In Orders</span>
              <span className="metric-value">{metrics.dineInOrders}</span>
            </div>
          </div>
        </div>

        {/* Operational Metrics */}
        <div className="metric-card">
          <div className="metric-header">
            <h4>Operational Efficiency</h4>
            <div className="metric-icon">⚡</div>
          </div>
          <div className="metric-content">
            <div className="metric-item">
              <span className="metric-label">Success Rate</span>
              <span className={`metric-value ${getStatusLabel(metrics.successRate, 'percentage')}`}>
                {metrics.successRate.toFixed(1)}%
              </span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Avg Items/Order</span>
              <span className="metric-value">{metrics.averageItemsPerOrder.toFixed(1)}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Customer Satisfaction</span>
              <span className={`metric-value ${getStatusLabel(metrics.customerSatisfaction, 'satisfaction')}`}>
                {metrics.customerSatisfaction.toFixed(1)}%
              </span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Top Performer</span>
              <span className="metric-value">
                {metrics.topDeliveryPerson?.name || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Time-based Analytics */}
        <div className="metric-card">
          <div className="metric-header">
            <h4>Time Analytics</h4>
            <div className="metric-icon">⏰</div>
          </div>
          <div className="metric-content">
            <div className="metric-item">
              <span className="metric-label">Peak Hour Orders</span>
              <span className="metric-value">{metrics.peakHourOrders}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Weekend Orders</span>
              <span className="metric-value">{metrics.weekendOrders}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Food vs Beverage</span>
              <span className="metric-value">{metrics.foodVsBeverageRatio}:1</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Peak Hour %</span>
              <span className="metric-value">
                {metrics.totalOrders > 0 ? ((metrics.peakHourOrders / metrics.totalOrders) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </div>
        </div>

     
      </div>
    </div>
  );
};

export default PerformanceMetrics;
