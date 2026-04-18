import { useState, useEffect } from 'react';
import axios from 'axios';
import { History, Clock, FileText, AlertCircle } from 'lucide-react';

export default function HistoryLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/logs/history`);
        setLogs(response.data);
      } catch (err) {
        console.error("Failed to fetch logs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [apiUrl]);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center mb-6">
        <History className="w-8 h-8 text-primary mr-3" />
        <h1 className="text-3xl font-bold text-gray-800">Event History</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-semibold text-gray-600">Date & Time</th>
                <th className="p-4 font-semibold text-gray-600">Event Type</th>
                <th className="p-4 font-semibold text-gray-600">Fill Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                 <tr>
                    <td colSpan="3" className="p-8 text-center text-gray-500">
                        <span className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin inline-block mr-2 align-middle"></span>
                        Loading Logs...
                    </td>
                 </tr>
              ) : logs.length === 0 ? (
                 <tr>
                    <td colSpan="3" className="p-8 text-center text-gray-500">
                        No history found.
                    </td>
                 </tr>
              ) : logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-gray-700 flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        log.event_type === 'Full' ? 'bg-red-100 text-red-700' : 
                        log.event_type === 'Manual Open' ? 'bg-blue-100 text-blue-700' : 
                        'bg-gray-100 text-gray-700'
                    }`}>
                      {log.event_type === 'Full' && <AlertCircle className="w-3 h-3 mr-1" />}
                      {log.event_type === 'Manual Open' && <FileText className="w-3 h-3 mr-1" />}
                      {log.event_type}
                    </span>
                  </td>
                  <td className="p-4 text-gray-700 font-medium">
                    {log.level}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
