import React, { useState } from 'react';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    maintenance: false
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">System settings</h1>
        <p className="text-gray-600 mt-2">Configure global settings for the platform.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
        {[
          { key: 'notifications', label: 'Enable notifications', description: 'Send system updates to users.' },
          { key: 'maintenance', label: 'Maintenance mode', description: 'Temporarily restrict public access.' }
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between">
            <div>
              <p className="text-gray-900 font-medium">{item.label}</p>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
            <button
              onClick={() => toggleSetting(item.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${settings[item.key] ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
            >
              {settings[item.key] ? 'On' : 'Off'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemSettings;
