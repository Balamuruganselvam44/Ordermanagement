import React, { useState, useEffect } from 'react';
import './App.css';
import ordersData from './data/orders.json';
import TopItemsChart from './components/TopItemsChart';
import OrderTypeChart from './components/OrderTypeChart';
import DeliveryPerformance from './components/DeliveryPerformance';
import OrdersTable from './components/OrdersTable';
import DetailedAnalytics from './components/DetailedAnalytics';
import PerformanceMetrics from './components/PerformanceMetrics';
import DateFilter from './components/DateFilter';

function App() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      // Filter out any orders with invalid dates during initial load
      const validOrders = ordersData.filter(order => {
        try {
          if (!order.Order_Date) return false;
          const date = new Date(order.Order_Date);
          return !isNaN(date.getTime());
        } catch (error) {
          console.warn('Invalid order date during load:', order.Order_Date);
          return false;
        }
      });
      
      setOrders(validOrders);
      
      // Set default filter to last 30 days
      const today = new Date();
      const last30Days = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      const todayString = today.toISOString().split('T')[0];
      const last30DaysString = last30Days.toISOString().split('T')[0];
      
      setStartDate(last30DaysString);
      setEndDate(todayString);
      
      // Apply the default filter
      const filtered = validOrders.filter(order => {
        try {
          if (!order.Order_Date) return false;
          const orderDate = new Date(order.Order_Date);
          if (isNaN(orderDate.getTime())) return false;
          const orderDateString = orderDate.toISOString().split('T')[0];
          return orderDateString >= last30DaysString && orderDateString <= todayString;
        } catch (error) {
          return false;
        }
      });
      
      setFilteredOrders(filtered);
      setLoading(false);
    }, 500);
  }, []);

  // Filter orders based on date range
  const filterOrdersByDate = (start, end) => {
    if (!start && !end) {
      setFilteredOrders(orders);
      return;
    }

    const filtered = orders.filter(order => {
      try {
        // Check if Order_Date exists and is valid
        if (!order.Order_Date) {
          return false;
        }

        const orderDate = new Date(order.Order_Date);
        
        // Check if the date is valid
        if (isNaN(orderDate.getTime())) {
          console.warn('Invalid date found:', order.Order_Date);
          return false;
        }

        const orderDateString = orderDate.toISOString().split('T')[0];
        
        if (start && end) {
          return orderDateString >= start && orderDateString <= end;
        } else if (start) {
          return orderDateString >= start;
        } else if (end) {
          return orderDateString <= end;
        }
        return true;
      } catch (error) {
        console.warn('Error parsing date:', order.Order_Date, error);
        return false;
      }
    });

    setFilteredOrders(filtered);
  };

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    filterOrdersByDate(start, end);
  };

  if (loading) {
    return (
      <div className="App">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="dashboard-header">
        <h1>Restaurant Owner Dashboard</h1>
        <p>Real-time insights into your restaurant operations</p>
      </header>
      
      <main className="dashboard-main">
        {/* Date Filter - Compact */}
        {/* <div className="dashboard-row"> */}
          {/* <div className="dashboard-card full-width"> */}
            <div className="filter-header">
              <DateFilter 
                startDate={startDate}
                endDate={endDate}
                onDateChange={handleDateChange}
                filteredCount={filteredOrders.length}
                totalCount={orders.length}
              />
            </div>
          {/* </div> */}
        {/* </div> */}

        {/* Performance Metrics */}
        <div className="dashboard-row">
          <div className="dashboard-card full-width">
            <PerformanceMetrics orders={filteredOrders} />
          </div>
        </div>


        {/* Detailed Analytics */}
        <div className="dashboard-row">
          <div className="dashboard-card full-width">
            <DetailedAnalytics orders={filteredOrders} />
          </div>
        </div>

        {/* Charts Row */}
        <div className="dashboard-row">
          <div className="dashboard-card chart-card">
            <TopItemsChart orders={filteredOrders} />
          </div>
          <div className="dashboard-card chart-card">
            <OrderTypeChart orders={filteredOrders} />
          </div>
        </div>

        {/* Delivery Performance */}
        <div className="dashboard-row">
          <div className="dashboard-card full-width">
            <DeliveryPerformance orders={filteredOrders} />
          </div>
        </div>

        {/* Orders Table */}
        <div className="dashboard-row">
          <div className="dashboard-card full-width">
            <OrdersTable orders={filteredOrders} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
