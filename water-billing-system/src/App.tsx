import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Users, FileText, DollarSign, TrendingUp } from 'lucide-react';
import './index.css'; 
const API_URL = 'http://localhost:5000/api';

const App = () => {
  const [activeMenu, setActiveMenu] = useState('home');
  const [customers, setCustomers] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    full_name: '',
    previous_reading: '',
    current_reading: ''
  });
  const [searchId, setSearchId] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [monthlySummary, setMonthlySummary] = useState(null);

  useEffect(() => {
    if (activeMenu === 'list' || activeMenu === 'report') {
      fetchCustomers();
    }
  }, [activeMenu]);

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`${API_URL}/customers`);
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      showMessage('error', 'Failed to fetch customers');
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!formData.full_name || !formData.previous_reading || !formData.current_reading) {
      showMessage('error', 'All fields are required');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.full_name,
          previous_reading: parseFloat(formData.previous_reading),
          current_reading: parseFloat(formData.current_reading)
        })
      });

      const data = await response.json();

      if (response.ok) {
        showMessage('success', 'Customer registered successfully!');
        setFormData({ full_name: '', previous_reading: '', current_reading: '' });
        fetchCustomers();
      } else {
        showMessage('error', data.error || 'Failed to register customer');
      }
    } catch (error) {
      showMessage('error', 'Network error. Please try again.');
    }
  };

  const handleSearchCustomer = async (e) => {
    e.preventDefault();
    
    if (!searchId) {
      showMessage('error', 'Please enter a customer ID');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/customers/${searchId}`);
      
      if (response.ok) {
        const data = await response.json();
        setSelectedCustomer(data);
      } else {
        showMessage('error', 'Customer not found');
        setSelectedCustomer(null);
      }
    } catch (error) {
      showMessage('error', 'Failed to fetch customer details');
    }
  };

  const handleGenerateReport = async () => {
    try {
      const response = await fetch(`${API_URL}/reports/monthly-summary`);
      const data = await response.json();
      setMonthlySummary(data);
    } catch (error) {
      showMessage('error', 'Failed to generate report');
    }
  };

  useEffect(() => {
    if (activeMenu === 'report') {
      handleGenerateReport();
    }
  }, [activeMenu]);

  const renderHome = () => (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">
        AquaServe Water Company
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Smart Water Billing Management System
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
        <div 
          onClick={() => setActiveMenu('register')}
          className="bg-blue-50 p-6 rounded-lg cursor-pointer hover:bg-blue-100 transition"
        >
          <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Register Customer</h3>
          <p className="text-gray-600 text-sm">Add new customer records</p>
        </div>
        
        <div 
          onClick={() => setActiveMenu('search')}
          className="bg-green-50 p-6 rounded-lg cursor-pointer hover:bg-green-100 transition"
        >
          <FileText className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">View Bill</h3>
          <p className="text-gray-600 text-sm">Display customer bill details</p>
        </div>
        
        <div 
          onClick={() => setActiveMenu('list')}
          className="bg-purple-50 p-6 rounded-lg cursor-pointer hover:bg-purple-100 transition"
        >
          <DollarSign className="w-12 h-12 text-purple-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">All Customers</h3>
          <p className="text-gray-600 text-sm">View all customer records</p>
        </div>
        
        <div 
          onClick={() => setActiveMenu('report')}
          className="bg-orange-50 p-6 rounded-lg cursor-pointer hover:bg-orange-100 transition"
        >
          <TrendingUp className="w-12 h-12 text-orange-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Monthly Report</h3>
          <p className="text-gray-600 text-sm">Generate summary reports</p>
        </div>
      </div>

      <div className="mt-12 p-6 bg-gray-50 rounded-lg max-w-2xl mx-auto">
        <h4 className="font-semibold text-lg mb-4">Tariff Structure</h4>
        <div className="space-y-2 text-left">
          <p className="text-gray-700">• 0-30 cubic meters: <span className="font-semibold">Ksh 25</span> per cubic meter</p>
          <p className="text-gray-700">• 31-60 cubic meters: <span className="font-semibold">Ksh 35</span> per cubic meter</p>
          <p className="text-gray-700">• Above 60 cubic meters: <span className="font-semibold">Ksh 45</span> per cubic meter</p>
        </div>
      </div>
    </div>
  );

  const renderRegister = () => (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Register New Customer</h2>
      
      <form onSubmit={handleRegister} className="bg-white p-8 rounded-lg shadow-md">
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={formData.full_name}
            onChange={(e) => setFormData({...formData, full_name: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter customer's full name"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Previous Month's Reading (cubic meters)
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.previous_reading}
            onChange={(e) => setFormData({...formData, previous_reading: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter previous reading"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Current Month's Reading (cubic meters)
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.current_reading}
            onChange={(e) => setFormData({...formData, current_reading: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter current reading"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          Register Customer
        </button>
      </form>

      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Maximum 50 customers can be registered. Current reading must be greater than or equal to previous reading.
        </p>
      </div>
    </div>
  );

  const renderSearch = () => (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Display Customer Bill</h2>
      
      <form onSubmit={handleSearchCustomer} className="mb-6">
        <div className="flex gap-4">
          <input
            type="number"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter Customer ID"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-8 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
          >
            Search
          </button>
        </div>
      </form>

      {selectedCustomer && (
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center border-b pb-4">
            Customer Bill Details
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b">
              <span className="font-semibold text-gray-700">Customer ID:</span>
              <span className="text-gray-900">{selectedCustomer.customer_id}</span>
            </div>
            
            <div className="flex justify-between py-3 border-b">
              <span className="font-semibold text-gray-700">Name:</span>
              <span className="text-gray-900">{selectedCustomer.full_name}</span>
            </div>
            
            <div className="flex justify-between py-3 border-b">
              <span className="font-semibold text-gray-700">Previous Reading:</span>
              <span className="text-gray-900">{parseFloat(selectedCustomer.previous_reading).toFixed(2)} m³</span>
            </div>
            
            <div className="flex justify-between py-3 border-b">
              <span className="font-semibold text-gray-700">Current Reading:</span>
              <span className="text-gray-900">{parseFloat(selectedCustomer.current_reading).toFixed(2)} m³</span>
            </div>
            
            <div className="flex justify-between py-3 border-b bg-blue-50 px-4 rounded">
              <span className="font-semibold text-gray-700">Water Consumption:</span>
              <span className="text-blue-600 font-bold">{parseFloat(selectedCustomer.consumption).toFixed(2)} m³</span>
            </div>
            
            <div className="flex justify-between py-4 bg-green-50 px-4 rounded mt-4">
              <span className="font-bold text-gray-800 text-lg">Total Bill Amount:</span>
              <span className="text-green-600 font-bold text-xl">Ksh {parseFloat(selectedCustomer.bill_amount).toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderList = () => (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">All Customers</h2>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prev Reading</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Curr Reading</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consumption</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No customers registered yet
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.customer_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {customer.customer_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer.full_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {parseFloat(customer.previous_reading).toFixed(2)} m³
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {parseFloat(customer.current_reading).toFixed(2)} m³
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-semibold">
                      {parseFloat(customer.consumption).toFixed(2)} m³
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                      Ksh {parseFloat(customer.bill_amount).toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderReport = () => (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Monthly Summary Report</h2>
      
      {monthlySummary && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <p className="text-blue-600 text-sm font-semibold mb-2">Total Customers</p>
              <p className="text-3xl font-bold text-blue-700">{monthlySummary.summary.totalCustomers}</p>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <p className="text-green-600 text-sm font-semibold mb-2">Total Revenue</p>
              <p className="text-3xl font-bold text-green-700">Ksh {monthlySummary.summary.totalRevenue}</p>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <p className="text-purple-600 text-sm font-semibold mb-2">Avg Consumption</p>
              <p className="text-3xl font-bold text-purple-700">{monthlySummary.summary.averageConsumption} m³</p>
            </div>
            
            <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
              <p className="text-orange-600 text-sm font-semibold mb-2">Highest Bill</p>
              <p className="text-2xl font-bold text-orange-700">
                {monthlySummary.summary.highestBillCustomer 
                  ? `Ksh ${parseFloat(monthlySummary.summary.highestBillCustomer.bill_amount).toFixed(2)}`
                  : 'N/A'}
              </p>
              <p className="text-xs text-orange-600 mt-1">
                {monthlySummary.summary.highestBillCustomer?.full_name || ''}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h3 className="text-xl font-semibold text-gray-800">Customer Details</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Consumption</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bill Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {monthlySummary.customers.map((customer) => (
                    <tr key={customer.customer_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {customer.customer_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {customer.full_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-semibold">
                        {parseFloat(customer.consumption).toFixed(2)} m³
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                        Ksh {parseFloat(customer.bill_amount).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">AquaServe</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setActiveMenu('home')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  activeMenu === 'home'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setActiveMenu('register')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  activeMenu === 'register'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Register
              </button>
              <button
                onClick={() => setActiveMenu('search')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  activeMenu === 'search'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Search
              </button>
              <button
                onClick={() => setActiveMenu('list')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  activeMenu === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Customers
              </button>
              <button
                onClick={() => setActiveMenu('report')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  activeMenu === 'report'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Report
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Message Notification */}
      {message.text && (
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4`}>
          <div
            className={`flex items-center p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
            )}
            <span
              className={`font-medium ${
                message.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}
            >
              {message.text}
            </span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeMenu === 'home' && renderHome()}
        {activeMenu === 'register' && renderRegister()}
        {activeMenu === 'search' && renderSearch()}
        {activeMenu === 'list' && renderList()}
        {activeMenu === 'report' && renderReport()}
      </main>

      {/* Footer */}
      <footer className="bg-white mt-12 py-6 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">
            © 2025 AquaServe Water Company. Smart Water Billing Management System.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;