import React, { useState, useEffect } from 'react';
import { FaUser, FaDatabase, FaCog } from 'react-icons/fa';
import http from '../../../Services/http/http';
import { ImConnection } from 'react-icons/im';
import { MdSignalWifiStatusbarConnectedNoInternet } from 'react-icons/md';

function Settings() {
  const [activeSection, setActiveSection] = useState('profile');
  const [dbStatus, setDbStatus] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');
  const checkDatabaseConnection = async () => {
    setLoading(true);
    try {
      const response: any = await http({
        url: `/auth/ping`,
        method: 'get',
        data: {
          email: userDetails.email
        }
      });
      if (response?.data?.code === 'SUCCESS_200') {
        setDbStatus(true);
      } else {
        setDbStatus(false);
      }
    } catch (error) {
      setDbStatus(false);
      console.log(error, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkDatabaseConnection();
    // eslint-disable-next-line
  }, []);

  const settingsSections = [
    { id: 'profile', name: 'Profile Settings', icon: <FaUser className="w-5 h-5" /> },
    { id: 'database', name: 'Database Status', icon: <FaDatabase className="w-5 h-5" /> },
    { id: 'general', name: 'General Settings', icon: <FaCog className="w-5 h-5" /> },
  ];

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Profile Information</h3>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                disabled={true}
                value={userDetails.name}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                disabled={true}
                value={userDetails.email}
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>
          </div>
        );
      case 'database':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Database Status</h3>
            <div className="flex items-center space-x-5">
              <span className="font-medium">Connection Status:</span>
              {loading ? (
                <span className="text-gray-500">Checking...</span>
              ) : dbStatus === true ? (
                <span title='Connected' className="flex items-center text-green-500">
                  <ImConnection className="w-6 h-6 mr-1" />
                </span>
              ) : (
                <span title='Disconnected' className="flex items-center text-red-500">
                  <MdSignalWifiStatusbarConnectedNoInternet className="w-6 h-6 mr-1" />
                </span>
              )}
            </div>
            <div className='flex justify-center mt-4'>
              <button
                onClick={checkDatabaseConnection}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {loading ? 'Checking...' : 'Check Connection'}
              </button>
            </div>
          </div>
        );
      case 'general':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">General Settings</h3>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Language</label>
              <select disabled={true} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Theme</label>
              <select disabled={true} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1> */}

          <div className="h-[calc(100vh-10rem)] flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="w-full md:w-64 bg-white rounded-lg shadow">
              <nav className="space-y-1 p-4">
                {settingsSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md ${activeSection === section.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    {section.icon}
                    <span>{section.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-white rounded-lg shadow p-6">
              {renderSectionContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
