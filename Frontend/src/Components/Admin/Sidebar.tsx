import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export const Sidebar = () => {
  const navigate = useNavigate();
  
  const menuItems = [
    { name: 'Category', path: '/admin/category' },
    { name: 'Product', path: '/admin/product' },
    { name: 'Sub-Category', path: '/admin/sub-category' },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/admin/login');
  };

  return (
    <aside className="w-full md:w-64 bg-white shadow-lg h-screen flex flex-col">
      <div className="p-6 flex-1">
        <div className="flex items-center space-x-2 mb-8">
          <h1 className="text-gray-800 text-2xl font-bold">FBB</h1>
          <span className="text-blue-600 text-2xl font-bold">STORE</span>
        </div>
        
        <nav>
          <ul className="space-y-2">
            {menuItems.map(({ name, path }) => (
              <li key={name}>
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    `block py-3 px-4 rounded-lg transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  {name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      <div className="p-6 border-t">
        <button
          onClick={handleLogout}
          className="w-full py-3 px-4 rounded-lg text-red-600 hover:bg-red-50 transition-all font-medium flex items-center justify-center"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};