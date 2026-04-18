import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, History, LogOut, Trash2 } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Event History', path: '/history', icon: History },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-100 flex flex-col shadow-sm">
      <div className="p-6 flex items-center mb-6">
        <div className="bg-primary/10 p-2 rounded-xl mr-3">
          <Trash2 className="w-6 h-6 text-primary" />
        </div>
        <h2 className="font-bold text-gray-800 text-lg leading-tight">Smart<br/>Bin IoT</h2>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-primary text-white shadow-sm font-medium' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-gray-400'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <Link 
          to="/login"
          className="flex items-center px-4 py-3 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3 text-gray-400" />
          Sign out
        </Link>
      </div>
    </div>
  );
}
