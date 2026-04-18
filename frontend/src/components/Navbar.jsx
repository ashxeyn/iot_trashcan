import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, History, LogOut, Trash2 } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'History', path: '/history', icon: History },
  ];

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
  };

  return (
    <>
        {/* Desktop Sidebar */}
        <div className="hidden md:flex w-64 bg-white border-r border-gray-100 flex-col shadow-sm">
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
                <button 
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors cursor-pointer"
                >
                <LogOut className="w-5 h-5 mr-3 text-gray-400" />
                Sign out
                </button>
            </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around p-3 z-50 rounded-t-xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                    <Link
                    key={item.path}
                    to={item.path}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg ${
                        isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
                    }`}
                    >
                    <Icon className={`w-6 h-6 mb-1 ${isActive ? 'text-primary' : 'text-gray-400'}`} />
                    <span className="text-xs font-medium">{item.name}</span>
                    </Link>
                );
            })}
             <button
                onClick={handleLogout}
                className="flex flex-col items-center justify-center p-2 rounded-lg text-gray-400 hover:text-red-500"
            >
                <LogOut className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">Logout</span>
            </button>
        </div>
    </>
  );
}
