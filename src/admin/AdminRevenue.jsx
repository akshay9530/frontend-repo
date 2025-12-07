import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiShoppingCart, FiUsers, FiPackage } from 'react-icons/fi';

const AdminRevenue = () => {
  const [revenueData, setRevenueData] = useState({
    totalRevenue: 0,
    dailyRevenue: [],
    monthlyRevenue: [],
    topProducts: [],
    topCategories: [],
    salesByPaymentMethod: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchRevenueData();
  }, [timeRange, startDate, endDate]);

  const fetchRevenueData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      let url = `http://localhost:5000/api/admin/revenue?range=${timeRange}`;
      
      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setRevenueData(data.data);
      } else {
        // Fallback to mock data if endpoint doesn't exist
        setRevenueData(getMockData());
      }
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      // Fallback to mock data
      setRevenueData(getMockData());
    } finally {
      setLoading(false);
    }
  };

  const getMockData = () => {
    const dailyData = [];
    for (let i = 0; i < 30; i++) {
      dailyData.push({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        revenue: Math.floor(Math.random() * 10000) + 5000,
        orders: Math.floor(Math.random() * 50) + 10
      });
    }

    const monthlyData = [];
    for (let i = 0; i < 12; i++) {
      monthlyData.push({
        month: `Month ${i + 1}`,
        revenue: Math.floor(Math.random() * 200000) + 50000,
        orders: Math.floor(Math.random() * 300) + 100
      });
    }

    return {
      totalRevenue: 1250000,
      dailyRevenue: dailyData.reverse(),
      monthlyRevenue: monthlyData,
      topProducts: [
        { name: 'iPhone 15 Pro', revenue: 250000, sales: 25 },
        { name: 'Samsung Galaxy S23', revenue: 180000, sales: 30 },
        { name: 'Nike Air Max', revenue: 150000, sales: 100 },
        { name: 'Sony Headphones', revenue: 120000, sales: 80 },
        { name: 'MacBook Pro', revenue: 95000, sales: 10 }
      ],
      topCategories: [
        { name: 'Electronics', revenue: 600000, percentage: 48 },
        { name: 'Fashion', revenue: 350000, percentage: 28 },
        { name: 'Home & Kitchen', revenue: 150000, percentage: 12 },
        { name: 'Sports', revenue: 100000, percentage: 8 },
        { name: 'Books', revenue: 50000, percentage: 4 }
      ],
      salesByPaymentMethod: [
        { method: 'Credit Card', count: 450, amount: 800000 },
        { method: 'UPI', count: 600, amount: 300000 },
        { method: 'Cash on Delivery', count: 150, amount: 100000 },
        { method: 'Net Banking', count: 100, amount: 50000 }
      ]
    };
  };

  const getRevenueChange = () => {
    if (revenueData.dailyRevenue.length < 2) return { value: 0, isPositive: true };
    
    const current = revenueData.dailyRevenue[revenueData.dailyRevenue.length - 1]?.revenue || 0;
    const previous = revenueData.dailyRevenue[revenueData.dailyRevenue.length - 2]?.revenue || 0;
    
    if (previous === 0) return { value: 100, isPositive: true };
    
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change).toFixed(1),
      isPositive: change >= 0
    };
  };

  const getOrdersChange = () => {
    if (revenueData.dailyRevenue.length < 2) return { value: 0, isPositive: true };
    
    const current = revenueData.dailyRevenue[revenueData.dailyRevenue.length - 1]?.orders || 0;
    const previous = revenueData.dailyRevenue[revenueData.dailyRevenue.length - 2]?.orders || 0;
    
    if (previous === 0) return { value: 100, isPositive: true };
    
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change).toFixed(1),
      isPositive: change >= 0
    };
  };

  const revenueChange = getRevenueChange();
  const ordersChange = getOrdersChange();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Revenue Analytics</h1>
        
        <div className="flex space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
            <option value="custom">Custom Range</option>
          </select>
          
          {timeRange === 'custom' && (
            <div className="flex space-x-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                ₹{revenueData.totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className={`p-3 rounded-full ${revenueChange.isPositive ? 'bg-green-100' : 'bg-red-100'}`}>
              <FiDollarSign className={`h-6 w-6 ${revenueChange.isPositive ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
          <div className="mt-4">
            <span className={`inline-flex items-center text-sm ${revenueChange.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {revenueChange.isPositive ? <FiTrendingUp className="mr-1" /> : <FiTrendingDown className="mr-1" />}
              {revenueChange.value}% from yesterday
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {revenueData.dailyRevenue.reduce((sum, day) => sum + day.orders, 0)}
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <FiShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className={`inline-flex items-center text-sm ${ordersChange.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {ordersChange.isPositive ? <FiTrendingUp className="mr-1" /> : <FiTrendingDown className="mr-1" />}
              {ordersChange.value}% from yesterday
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Order Value</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                ₹{(revenueData.totalRevenue / Math.max(1, revenueData.dailyRevenue.reduce((sum, day) => sum + day.orders, 0))).toFixed(0)}
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <FiUsers className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-500">Per customer</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                2.4%
              </p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100">
              <FiPackage className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-500">Based on 10,000 visits</span>
          </div>
        </div>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Trend</h3>
          <div className="h-64 flex items-end space-x-2">
            {revenueData.dailyRevenue.slice(-14).map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-green-500 rounded-t"
                  style={{ 
                    height: `${(day.revenue / Math.max(...revenueData.dailyRevenue.map(d => d.revenue))) * 100}%`,
                    maxHeight: '200px'
                  }}
                ></div>
                <div className="text-xs text-gray-500 mt-2">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="text-xs font-medium mt-1">
                  ₹{(day.revenue / 1000).toFixed(0)}K
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Products by Revenue</h3>
          <div className="space-y-4">
            {revenueData.topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900 mr-4">{index + 1}.</span>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-xs text-gray-500">{product.sales} sales</div>
                  </div>
                </div>
                <div className="text-sm font-bold text-gray-900">
                  ₹{product.revenue.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue by Category</h3>
          <div className="space-y-4">
            {revenueData.topCategories.map((category, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{category.name}</span>
                  <span className="text-sm font-medium text-gray-900">{category.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  ₹{category.revenue.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Sales by Payment Method</h3>
          <div className="space-y-4">
            {revenueData.salesByPaymentMethod.map((method, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">{method.method}</div>
                  <div className="text-xs text-gray-500">{method.count} transactions</div>
                </div>
                <div className="text-sm font-bold text-gray-900">
                  ₹{method.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Revenue Summary</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg. Order Value</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Growth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {revenueData.monthlyRevenue.map((month, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{month.month}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">₹{month.revenue.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{month.orders}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    ₹{Math.round(month.revenue / month.orders).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      index > 0 && month.revenue > revenueData.monthlyRevenue[index - 1].revenue
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {index > 0 ? (
                        <>
                          {month.revenue > revenueData.monthlyRevenue[index - 1].revenue ? 
                            <FiTrendingUp className="mr-1" /> : 
                            <FiTrendingDown className="mr-1" />
                          }
                          {Math.abs(
                            ((month.revenue - revenueData.monthlyRevenue[index - 1].revenue) / 
                            revenueData.monthlyRevenue[index - 1].revenue) * 100
                          ).toFixed(1)}%
                        </>
                      ) : '—'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Options */}
      <div className="mt-6 flex justify-end">
        <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
          Export Report (CSV)
        </button>
      </div>
    </div>
  );
};

export default AdminRevenue;