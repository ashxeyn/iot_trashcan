import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Activity, Battery, AlertTriangle, Key } from 'lucide-react';

export default function Dashboard() {
  const [status, setStatus] = useState({
    fill_level: 0,
    is_online: false,
    manual_open_command: false
  });
  const [opening, setOpening] = useState(false);
  const [isLidForcedOpen, setIsLidForcedOpen] = useState(false);
  const [error, setError] = useState('');

  const hasAlerted = useRef(false);

  // We will setup env variable handling. Using relative path for proxy locally, or railway directly
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  useEffect(() => {
    // Request notification permission on mount
    if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission();
    }

    // In a real scenario, this polls the API every 3-5 seconds
    const fetchStatus = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/bin/status`);
        setStatus(response.data);
        setError('');

        // Trigger system alert if hit 80%
        if (response.data.fill_level >= 80 && !hasAlerted.current) {
            hasAlerted.current = true;
            if ("Notification" in window && Notification.permission === "granted") {
                new Notification("🛑 Smart Bin Alert", { 
                    body: `Bin is nearly full (${response.data.fill_level}%). Please empty it soon.` 
                });
            } else {
                alert(`WARNING: Smart Bin is nearly full (${response.data.fill_level}%). Maintenance required.`);
            }
        } else if (response.data.fill_level < 80) {
            // Reset alert flag if trash was taken out
            hasAlerted.current = false;
        }

      } catch (err) {
        console.error(err);
        setError('Failed to connect to Bin API');
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, [apiUrl]);

  const handleForceOpen = async () => {
    setOpening(true);
    try {
      await axios.post(`${apiUrl}/api/bin/open`, { command: true });
      setStatus(s => ({ ...s, manual_open_command: true }));
      setIsLidForcedOpen(true);
    } catch (err) {
      console.error(err);
      alert('Failed to send command to bin');
    } finally {
      setOpening(false);
    }
  };

  const handleTrashOut = async () => {
    setOpening(true);
    try {
      await axios.post(`${apiUrl}/api/bin/empty`);
      // Update local state proactively
      setStatus(s => ({ ...s, fill_level: 0, manual_open_command: false }));
      setIsLidForcedOpen(false);
      alert('Trash successfully taken out!');
    } catch (err) {
      console.error(err);
      alert('Failed to record empty trash state');
    } finally {
      setOpening(false);
    }
  };

  const handleCancelOpen = () => {
     // User just wanted to test/force open but not empty trash. Close it.
     setIsLidForcedOpen(false);
  };

  const isFull = status.fill_level >= 81;
  const isWarning = status.fill_level >= 51 && status.fill_level <= 80;

  let gaugeColor = 'bg-primary';
  if (isFull) gaugeColor = 'bg-red-500 animate-pulse';
  else if (isWarning) gaugeColor = 'bg-yellow-500';

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Device Dashboard</h1>

      {/* Alert Banner */}
      {status.fill_level > 80 && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-xl flex items-center shadow-sm">
          <AlertTriangle className="w-6 h-6 mr-3 text-red-500 animate-bounce" />
          <p className="font-bold">WARNING: BIN FULL - MAINTENANCE REQUIRED</p>
        </div>
      )}

      {error && (
        <div className="bg-orange-100 text-orange-700 p-4 rounded-xl font-medium">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Status Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
          <div className="mb-4">
            <Activity className={`w-12 h-12 ${status.is_online ? 'text-primary' : 'text-gray-400'}`} />
          </div>
          <h2 className="text-xl font-semibold text-gray-700">Bin Status</h2>
          <div className="mt-2 flex items-center bg-gray-50 px-4 py-2 rounded-full">
            <div className={`w-3 h-3 rounded-full mr-2 ${status.is_online ? 'bg-primary animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="font-medium text-gray-600">
              {status.is_online ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>

        {/* Visual Gauge Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold text-gray-700 flex items-center mb-6">
            <Battery className="w-5 h-5 mr-2 text-gray-500" />
            Fill Level
          </h2>
          {/* Vertical Progress Bar */}
          <div className="relative w-24 h-48 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
            <div 
              className={`absolute bottom-0 left-0 w-full rounded-b-full transition-all duration-1000 ease-in-out ${gaugeColor}`}
              style={{ height: `${status.fill_level}%` }}
            ></div>
            {/* Percentage text overlayed inside the gauge */}
            <div className="absolute inset-0 flex items-center justify-center font-bold text-gray-800 drop-shadow-md pb-2">
               {status.fill_level}%
            </div>
          </div>
        </div>

        {/* Maintenance Actions Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
             <h2 className="text-xl font-semibold text-gray-700 mb-6 flex items-center">
                <Key className="w-5 h-5 mr-2 text-gray-500"/>
                Manual Override
            </h2>
            <p className="text-gray-500 text-sm mb-6">
                Force the bin lid to open immediately, overriding the hardware sensors.
            </p>
            
            {!isLidForcedOpen ? (
                <button
                    onClick={handleForceOpen}
                    disabled={opening}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 px-6 rounded-2xl shadow-sm transition-colors duration-200 flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {opening ? (
                        <>
                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></span>
                            Opening...
                        </>
                    ) : (
                        'Force Open Lid'
                    )}
                </button>
            ) : (
                <div className="flex flex-col space-y-3">
                    <div className="bg-green-50 text-green-700 text-sm p-3 rounded-lg text-center mb-2 animate-pulse">
                        Lid is open!
                    </div>
                    <button
                        onClick={handleTrashOut}
                        disabled={opening}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl shadow-sm transition-colors duration-200 flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {opening ? 'Processing...' : 'Confirm Trash Out'}
                    </button>
                    <button
                        onClick={handleCancelOpen}
                        disabled={opening}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-xl shadow-sm transition-colors duration-200 flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        Cancel / Keep Trash
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
