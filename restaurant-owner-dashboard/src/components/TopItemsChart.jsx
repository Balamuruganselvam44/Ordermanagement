import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './TopItemsChart.css';

const TopItemsChart = ({ orders = [] }) => {
  const topItems = useMemo(() => {
    if (!orders || orders.length === 0) return [];

    const itemCounts = {};
    
    orders.forEach(order => {
      if (order.Items && Array.isArray(order.Items)) {
        order.Items.forEach(item => {
          const itemName = item.Item_Name || 'Unknown Item';
          const quantity = item.Quantity || 0;
          itemCounts[itemName] = (itemCounts[itemName] || 0) + quantity;
        });
      }
    });

    return Object.entries(itemCounts)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10); // Top 10 items
  }, [orders]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          <p className="tooltip-value">
            Quantity: <span style={{ color: '#8884d8' }}>{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (topItems.length === 0) {
    return (
      <div className="top-items-chart">
        <h3>Top Selling Items</h3>
        <div className="no-data">No data available</div>
      </div>
    );
  }

  return (
    <div className="top-items-chart">
      <h3>Top Selling Items</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topItems} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={100}
              interval={0}
              fontSize={12}
            />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="quantity" fill="#8884d8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TopItemsChart;
