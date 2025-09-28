import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import './OrderTypeChart.css';

const OrderTypeChart = ({ orders = [] }) => {
  const orderTypeData = useMemo(() => {
    if (!orders || orders.length === 0) return [];

    const typeCounts = {};
    
    orders.forEach(order => {
      const orderType = order.Order_Type || 'Unknown';
      typeCounts[orderType] = (typeCounts[orderType] || 0) + 1;
    });

    return Object.entries(typeCounts).map(([type, count]) => ({
      name: type,
      value: count
    }));
  }, [orders]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{data.name}</p>
          <p className="tooltip-value">
            Orders: <span style={{ color: data.color }}>{data.value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (orderTypeData.length === 0) {
    return (
      <div className="order-type-chart">
        <h3>Order Type Distribution</h3>
        <div className="no-data">No data available</div>
      </div>
    );
  }

  return (
    <div className="order-type-chart">
      <h3>Order Type Distribution</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={orderTypeData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {orderTypeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OrderTypeChart;
