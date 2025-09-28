import React, { useMemo } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import './DetailedAnalytics.css';

const DetailedAnalytics = ({ orders = [] }) => {
  const analyticsData = useMemo(() => {
    if (!orders || orders.length === 0) return {};

    // Item categories analysis using Item_Type
    const categoryData = {};
    const timeBasedData = {};
    
    orders.forEach(order => {
      if (order.Items && Array.isArray(order.Items)) {
        order.Items.forEach(item => {
          const category = item.Item_Type || 'Other';
          const quantity = item.Quantity || 0;
          const price = item.Total_Price || 0;
          
          if (!categoryData[category]) {
            categoryData[category] = { quantity: 0, revenue: 0, orders: 0, avgRating: 0, totalRating: 0, ratingCount: 0 };
          }
          categoryData[category].quantity += quantity;
          categoryData[category].revenue += price;
          
          // Calculate average rating for each category
          if (item.Rating) {
            categoryData[category].totalRating += parseFloat(item.Rating);
            categoryData[category].ratingCount += 1;
          }
        });
      }
      
      // Time-based analysis
      if (order.Order_Date) {
        const date = new Date(order.Order_Date).toDateString();
        
        if (!timeBasedData[date]) {
          timeBasedData[date] = { orders: 0, revenue: 0 };
        }
        timeBasedData[date].orders += 1;
        timeBasedData[date].revenue += order.Items?.reduce((sum, item) => sum + (item.Total_Price || 0), 0) || 0;
      }
    });

    // Calculate average ratings
    Object.keys(categoryData).forEach(category => {
      if (categoryData[category].ratingCount > 0) {
        categoryData[category].avgRating = (categoryData[category].totalRating / categoryData[category].ratingCount).toFixed(1);
      }
    });

    const categoryChartData = Object.entries(categoryData).map(([category, data]) => ({
      category,
      quantity: data.quantity,
      revenue: data.revenue,
      avgRating: parseFloat(data.avgRating) || 0
    }));

    const timeChartData = Object.entries(timeBasedData).map(([date, data]) => ({
      date: new Date(date).toLocaleDateString(),
      orders: data.orders,
      revenue: data.revenue
    }));

    // Customer analysis
    const customerData = {};
    orders.forEach(order => {
      const customer = order?.Customer_Name || 'Unknown';
      if (!customerData[customer]) {
        customerData[customer] = { orders: 0, totalSpent: 0 };
      }
      customerData[customer].orders += 1;
      const orderTotal = order.Items?.reduce((sum, item) => sum + (item.Total_Price || 0), 0) || 0;
      customerData[customer].totalSpent += orderTotal;
    });

    const topCustomers = Object.entries(customerData)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10);

    return {
      categoryChartData,
      timeChartData,
      topCustomers
    };
  }, [orders]);


  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="tooltip-value" style={{ color: entry.color }}>
              {entry.name}: {entry.name.includes('revenue') ? `$${entry.value.toFixed(2)}` : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="detailed-analytics">
      <h3>Customer Analytics</h3>
      
      <div className="analytics-grid">
        {/* Top Customers */}
        <div className="chart-section">
          <h4>Top Customers by Spending</h4>
          <div className="customers-list">
            {analyticsData.topCustomers?.slice(0, 10).map((customer, index) => (
              <div key={customer.name} className="customer-item">
                <div className="customer-rank">#{index + 1}</div>
                <div className="customer-info">
                  <div className="customer-name">{customer.name}</div>
                  <div className="customer-stats">
                    {customer.orders} orders • ${customer.totalSpent.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Performance */}
        <div className="chart-section">
          <h4>Category Performance (Food vs Beverage)</h4>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.categoryChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="quantity" fill="#8884d8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="revenue" fill="#82ca9d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
            
        </div>

        {/* Time-based Analytics */}
        <div className="chart-section">
          <h4>Daily Order Trends</h4>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.timeChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="orders" fill="#ffc658" radius={[4, 4, 0, 0]} />
                <Bar dataKey="revenue" fill="#ff7300" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedAnalytics;
