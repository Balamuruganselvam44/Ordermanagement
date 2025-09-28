import React, { useMemo } from 'react';
import './DeliveryPerformance.css';

const DeliveryPerformance = ({ orders = [] }) => {
  const deliveryStats = useMemo(() => {
    if (!orders || orders.length === 0) {
      return {
        personStats: [],
        timeStats: {
          peakHourDeliveries: 0,
          weekendDeliveries: 0,
          averageDeliveryTime: 0,
          totalDeliveries: 0
        }
      };
    }

    const personStats = {};
    const timeStats = {
      peakHourDeliveries: 0,
      weekendDeliveries: 0,
      averageDeliveryTime: 0,
      totalDeliveries: 0
    };
    
    orders.forEach(order => {
      const deliveryPerson = order.Delivery_Person || 'Unassigned';
      const deliveryStatus = order.Delivery_Status || 'Unknown';
      
      if (!personStats[deliveryPerson]) {
        personStats[deliveryPerson] = {
          name: deliveryPerson,
          totalOrders: 0,
          deliveredOrders: 0,
          successRate: 0,
          peakHourOrders: 0,
          weekendOrders: 0,
          averageOrderValue: 0,
          totalRevenue: 0
        };
      }
      
      personStats[deliveryPerson].totalOrders += 1;
      
      // Calculate order value
      const orderValue = order.Items?.reduce((sum, item) => sum + (item.Total_Price || 0), 0) || 0;
      personStats[deliveryPerson].totalRevenue += orderValue;
      
      if (deliveryStatus === 'Delivered') {
        personStats[deliveryPerson].deliveredOrders += 1;
        timeStats.totalDeliveries += 1;
      }
      
      // Time-based analysis
      if (order.Order_Date) {
        const orderDate = new Date(order.Order_Date);
        const hour = orderDate.getHours();
        const day = orderDate.getDay();
        
        // Peak hours (6-9 PM)
        if (hour >= 18 && hour <= 21) {
          personStats[deliveryPerson].peakHourOrders += 1;
          if (deliveryStatus === 'Delivered') {
            timeStats.peakHourDeliveries += 1;
          }
        }
        
        // Weekend orders
        if (day === 0 || day === 6) {
          personStats[deliveryPerson].weekendOrders += 1;
          if (deliveryStatus === 'Delivered') {
            timeStats.weekendDeliveries += 1;
          }
        }
      }
    });

    // Calculate success rate and average order value for each person
    Object.values(personStats).forEach(person => {
      person.successRate = person.totalOrders > 0 
        ? Math.round((person.deliveredOrders / person.totalOrders) * 100)
        : 0;
      person.averageOrderValue = person.totalOrders > 0 
        ? (person.totalRevenue / person.totalOrders).toFixed(2)
        : 0;
    });

    return {
      personStats: Object.values(personStats)
        .sort((a, b) => b.totalOrders - a.totalOrders)
        .slice(0, 10), // Top 10 delivery persons
      timeStats
    };
  }, [orders]);

  // Add safety checks for deliveryStats
  if (!deliveryStats || !deliveryStats.personStats || deliveryStats.personStats.length === 0) {
    return (
      <div className="delivery-performance">
        <h3>Delivery Performance</h3>
        <div className="no-data">No delivery data available</div>
      </div>
    );
  }

  return (
    <div className="delivery-performance">
      <h3>Delivery Performance</h3>
      
      {/* Time-based Insights */}
      <div className="time-insights">
        <div className="insight-card">
          <h4>Peak Hour Performance</h4>
          <div className="insight-value">{deliveryStats.timeStats?.peakHourDeliveries || 0}</div>
          <div className="insight-label">Peak Hour Deliveries</div>
        </div>
        <div className="insight-card">
          <h4>Weekend Performance</h4>
          <div className="insight-value">{deliveryStats.timeStats?.weekendDeliveries || 0}</div>
          <div className="insight-label">Weekend Deliveries</div>
        </div>
        <div className="insight-card">
          <h4>Total Deliveries</h4>
          <div className="insight-value">{deliveryStats.timeStats?.totalDeliveries || 0}</div>
          <div className="insight-label">Completed Deliveries</div>
        </div>
      </div>
      
      <div className="performance-grid">
        {deliveryStats.personStats?.map((person, index) => (
          <div key={person.name} className="performance-card">
            <div className="person-header">
              <div className="person-rank">#{index + 1}</div>
              <div className="person-name">{person.name}</div>
            </div>
            <div className="performance-stats">
              <div className="stat-item">
                <div className="stat-value">{person.totalOrders || 0}</div>
                <div className="stat-label">Total Orders</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{person.deliveredOrders || 0}</div>
                <div className="stat-label">Delivered</div>
              </div>
              <div className="stat-item">
                <div className={`stat-value ${(person.successRate || 0) >= 90 ? 'success' : (person.successRate || 0) >= 70 ? 'warning' : 'danger'}`}>
                  {person.successRate || 0}%
                </div>
                <div className="stat-label">Success Rate</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">${person.averageOrderValue || 0}</div>
                <div className="stat-label">Avg Order Value</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{person.peakHourOrders || 0}</div>
                <div className="stat-label">Peak Hour Orders</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{person.weekendOrders || 0}</div>
                <div className="stat-label">Weekend Orders</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryPerformance;
