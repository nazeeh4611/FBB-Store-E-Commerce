import React from 'react';

export const Sidebar = () => {
  const menuItems = [
    'Dashboard',
    'Products',
    'Coupons',
    'Banner',
    'User Management',
    'Category',
    'Order Management',
  ];

  return (
    <aside className="w-full md:w-64 bg-white shadow-lg">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <h1 className="text-gray-800 text-2xl font-bold">shoe</h1>
          <span className="text-blue-600 text-2xl font-bold">PLANET</span>
        </div>
        
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className={`block py-3 px-4 rounded-lg transition-all ${
                    item === 'Category'
                      ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

