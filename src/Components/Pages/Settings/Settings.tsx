import React, { useState, useEffect, useContext } from 'react';
import { FaUser, FaDatabase, FaCog, FaSync } from 'react-icons/fa';
import http from '../../../Services/http/http';
import { ImConnection } from 'react-icons/im';
import { MdSignalWifiStatusbarConnectedNoInternet } from 'react-icons/md';
import { DataContext } from '../../../Context/DataProvider';
import { db } from '../../../db';
import { toast } from 'react-toastify';

function Settings() {
  const [activeSection, setActiveSection] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [unsyncedCount, setUnsyncedCount] = useState(0);
  const userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');
  const { dbStatus, setDbStatus, setRender } = useContext(DataContext);

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
        setTimeout(() => {
          setLoading(false);
        }, 2000);
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

  const getUnsyncedTransactions = async () => {
    const transactions = await db.transactions.toArray();
    const unsynced = transactions.filter(t => !t.data.synced);
    // console.log(unsynced, 'unsynced', transactions);
    setUnsyncedCount(unsynced.length);
    return unsynced;
  };

  const syncTransactions = async () => {
    if (!dbStatus) {
      toast.error('Please check your database connection');
      return;
    }

    setSyncing(true);
    const unsyncedTransactions = await getUnsyncedTransactions();
    let syncedCount = 0;
    for (const transaction of unsyncedTransactions) {
      try {
        if (transaction.data.deleted) {
          // Handle deleted transaction
          console.log(transaction.data, 'deleteTransaction');
          const response: any = await http({
            url: `/transaction/deleteTransaction`,
            method: 'delete',
            data: [transaction.data.id] // Backend expects an array of _id
          });

          if (response?.data?.code === 'SUCCESS_200') {
            // Remove from IndexedDB after successful sync
            await db.transactions.delete(transaction.id);
            syncedCount++;
            setSyncProgress((syncedCount / unsyncedTransactions.length) * 100);
          }
        } else if (transaction.data.edited) {
          console.log(transaction.data, 'editTransactions');
          // Handle new/updated transaction
          const response: any = await http({
            url: `/transaction/editTransactions`,
            method: 'put',
            data: transaction.data
          });
        } else {
          // Handle new/updated transaction
          const response: any = await http({
            url: `/transaction/addTransaction`,
            method: 'post',
            data: transaction.data
          });
          if (response?.data?.code === 'SUCCESS_200') {
            // Update sync status in IndexedDB
            
            await db.transactions.update(transaction.id, {
              data: { ...transaction.data, synced: true }
            });
           
            syncedCount++;
            setSyncProgress((syncedCount / unsyncedTransactions.length) * 100);
          }
        }
      } catch (error: any) {
        toast.error(`Failed to sync transaction: ${error.message}`);
      }
    }

    if (syncedCount > 0) {
      toast.success(`Successfully synced ${syncedCount} transactions`);
      setRender(prev => !prev);
    }
    setSyncing(false);
    setSyncProgress(0);
    getUnsyncedTransactions();
  };

  useEffect(() => {
    checkDatabaseConnection();
    getUnsyncedTransactions();
    // eslint-disable-next-line
  }, []);

  const settingsSections = [
    { id: 'profile', name: 'Profile Settings', icon: <FaUser className="w-5 h-5" /> },
    { id: 'database', name: 'Database Status', icon: <FaDatabase className="w-5 h-5" /> },
    { id: 'sync', name: 'Sync Data', icon: <FaSync className="w-5 h-5" /> },
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
      case 'sync':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Sync Data</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Unsynced Transactions:</span>
                <span className="text-blue-600 font-semibold">{unsyncedCount}</span>
              </div>

              {syncing && (
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${syncProgress}%` }}
                  ></div>
                </div>
              )}

              <div className='flex justify-center mt-4'>
                <button
                  onClick={syncTransactions}
                  disabled={syncing || !dbStatus || unsyncedCount === 0}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${syncing || !dbStatus || unsyncedCount === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                >
                  {syncing ? 'Syncing...' : 'Sync Now'}
                </button>
              </div>
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
