import React, { useEffect, useState, useCallback } from 'react';
import Sidebar from '../Components/Sidebar';
import { Link } from 'react-router-dom';
import '../Pages/DashBoard.css';
import {
  PieChart, Pie, Cell, Tooltip,
  Line, XAxis, YAxis, ResponsiveContainer, Bar, ComposedChart
} from 'recharts';
import axios from 'axios';
const COLORS = ['black', 'grey', 'lightgrey'];

const DashBoard = () => {
  const [summaryType, setSummaryType] = useState('daily');
  const [tables, setTables] = useState([


  ]);

  const defaultAnalytics = {
    totalChefs: 4,
    totalRevenue: 12000,
    totalOrders: 20,
    totalClients: 65,
    orderSummary: {
      "Dine In": 5,
      "Take Away": 6,
      "Served": 9,

    },
    revenueByDay: [
      { day: "Mon", revenue: 2000 },
      { day: "Tue", revenue: 1000 },
      { day: "Wed", revenue: 3000 },
      { day: "Thu", revenue: 1500 },
      { day: "Fri", revenue: 4000 },
      { day: "Sat", revenue: 3500 },
      { day: "Sun", revenue: 3200 }
    ],
    chefs: [
      { name: 'Manesh', orders: 3 },
      { name: 'Pritam', orders: 7 },
      { name: 'Yash', orders: 5 },
      { name: 'Tenzen', orders: 8 }
    ]
  };

  const [analytics, setAnalytics] = useState(defaultAnalytics);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get('http://localhost:5001/admin/analytics/getAnalytics');
        const data = response.data.data || defaultAnalytics;
        console.log("Analytics data:", data);
        setAnalytics(data);
        setTables(data.tables);
      } catch (err) {
        console.error("Failed to load analytics", err);
      }
    };
    fetchAnalytics();
  }, []);

  const pieData = Object.entries(analytics?.orderSummary || {}).map(([name, value]) => ({
    name,
    value
  }));

  const averageRevenue =
    analytics.revenueByDay.reduce((sum, d) => sum + d.revenue, 0) /
    analytics.revenueByDay.length;

  const revenueWithAvg = analytics.revenueByDay.map((d) => ({
    ...d,
    avg: averageRevenue
  }));

  const calculateOrdersBreakdown = useCallback(() => {
    const dineIn = analytics.orderSummary["Dine-In"] || 0;
    const takeAway = analytics.orderSummary["Take Away"] || 0;
    const served = analytics.orderSummary["Served"] || 0;

    const total = dineIn + takeAway + served;

    return {
      dineIn,
      takeAway,
      served,
      total,
      dineInPercent: total ? ((dineIn / total) * 100).toFixed(1) : 0,
      takeAwayPercent: total ? ((takeAway / total) * 100).toFixed(1) : 0,
      servedPercent: total ? ((served / total) * 100).toFixed(1) : 0,
    };
  }, [analytics]);



  const [breakdown, setBreakdown] = useState({
    dineIn: 0,
    takeAway: 0,
    served: 0,
    total: 0,
    dineInPercent: 0,
    takeAwayPercent: 0,
    servedPercent: 0,
  });

  useEffect(() => {
    setBreakdown(calculateOrdersBreakdown());
  }, [analytics, calculateOrdersBreakdown]);

  return (
    <div className='dashboard'>
      <Sidebar />
      <div className='dashboard-content'>
        <h1>Analytics</h1>

        <div className='analytics'>
          {[
            { label: "TOTAL CHEF", value: analytics.totalChefs, icon: 'Chefs.png' },
            { label: "TOTAL REVENUE", value: `₹${analytics.totalRevenue}`, icon: 'Revenue.png' },
            { label: "TOTAL ORDERS", value: analytics.totalOrders, icon: 'Orders.png' },
            { label: "TOTAL CLIENTS", value: analytics.totalCustomers, icon: 'Clients.png' }
          ].map((item, idx) => (
            <div className='card1' key={idx}>
              <img src={item.icon} alt={item.label} />
              <p>{item.value}</p>
              <h2>{item.label}</h2>
            </div>
          ))}
        </div>

        <div className="dashboard-section-row">
          <div className="dashboard-box">
            <div className="order-summary-header">
              <h2>Order Summary</h2>

              <select
                value={summaryType}
                onChange={(e) => setSummaryType(e.target.value)}
                className="summary-dropdown"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div className='order-summary-card-container'>
              {pieData.map((item, index) => (
                <div key={index} className='order-summary-card'>
                  <div className='order-summary-card-icon' style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <p>{item.name}</p>
                  <p>{item.value}</p>
                </div>
              ))}

            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={50}
                  label
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />

              </PieChart>
            </ResponsiveContainer>
            <div style={{ marginTop: '20px', gap: '10px' }}>
              {[
                { label: 'Dine In', value: breakdown.dineIn, percent: breakdown.dineInPercent, color: 'black' },
                { label: 'Take Away', value: breakdown.takeAway, percent: breakdown.takeAwayPercent, color: 'grey' },
                { label: 'Served', value: breakdown.served, percent: breakdown.servedPercent, color: 'darkgrey' }
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ width: '100px', fontWeight: 'bold' }}>
                    {item.label}

                  </div>
                  ({item.percent}%)
                  <div style={{
                    flex: 1,
                    height: '21px',
                    width: '220px',
                    backgroundColor: '#e0e0e0',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    marginLeft: '50px'
                  }}>
                    <div style={{
                      width: `${item.percent}%`,
                      height: '100%',
                      backgroundColor: item.color,
                      transition: 'width 0.5s ease-in-out',
                      textAlign: 'right',
                      paddingRight: '5px',
                      color: 'white',
                      fontWeight: 'bold',
                      lineHeight: '20px'
                    }}>
                      <span style={{ fontSize: '14px' }}>  {item.percent > 5 && `${item.percent}%`}</span>
                    </div>
                  </div>


                </div>
              ))}
            </div>



          </div>

          <div className="dashboard-box">
            <h2> Revenue</h2>
            <div className='revenue-container'>


              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={revenueWithAvg}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === 'revenue') return [`₹${value}`, 'Revenue'];
                      if (name === 'avg') return [`₹${value}`, 'Average'];
                      return value;
                    }}
                  />
                  <Bar dataKey="revenue" fill="lightgray" radius={[10, 10, 0, 0]} />
                  <Line type="monotone" dataKey="avg" stroke="#2A2A2A" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="dashboard-box">
            <div className="table-grid-header">
              <h2>Tables</h2>
              <div className="table-legend">
                <span className="legend-box reserved"></span> Reserved
                <span className="legend-box available"></span> Available
              </div>
            </div>

            <div className="table-grid">

              {tables.map((table) => (
                <div
                  key={table.tableName}
                  className={`table-box ${table.tableStatus === 'Reserved' ? 'Reserved' : 'Available'}`}
                >
                  Table  <span>{String(table.tableNumber).padStart(2, '0')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="chef-orders">
          <h2>Chef Orders</h2>
          <table className="chef-table">
            <thead>
              <tr>
                <th>Chef Name</th>
                <th>Order Taken</th>
              </tr>
            </thead>
            <tbody>
              {analytics.chefs.map((chef, index) => (
                <tr key={index}>
                  <td>{chef.name}</td>
                  <td>{chef.orders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Floating Chatbot Button */}
      <Link to="/Support" className="chatbot-floating-btn" title="Chat with our assistant">
        <span className="chatbot-icon">🤖</span>
      </Link>
    </div>
  );
};

export default DashBoard;
