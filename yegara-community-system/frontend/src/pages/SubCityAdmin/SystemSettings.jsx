import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    maintenance: false
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    toast.success('Settings updated');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">System settings</h1>
        <p className="text-gray-600 mt-2">
          Turn platform-wide features on or off. These controls affect all users in the system.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-5">
        {[
          {
            key: 'notifications',
            label: 'System notifications',
            description: 'Sends platform announcements and important updates to users.',
            onMeaning: 'Enabled: Users receive important system notifications.',
            offMeaning: 'Disabled: No system-wide notification broadcasts are sent.'
          },
          {
            key: 'maintenance',
            label: 'Maintenance mode',
            description: 'Use this when the platform is being fixed or updated.',
            onMeaning: 'Enabled: Public access is restricted during maintenance.',
            offMeaning: 'Disabled: Platform stays available for normal use.'
          }
        ].map((item) => (
          <div key={item.key} className="rounded-lg border border-gray-200 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-gray-900 font-medium">{item.label}</p>
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {settings[item.key] ? item.onMeaning : item.offMeaning}
                </p>
              </div>
              <button
                onClick={() => toggleSetting(item.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${settings[item.key] ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
              >
                {settings[item.key] ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            {item.key === 'maintenance' && settings[item.key] && (
              <div className="mt-3 rounded-md bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800">
                Warning: Maintenance mode can block public access. Enable only when needed.
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} className="btn btn-primary">
          Save changes
        </button>
      </div>
    </div>
  );
};

export default SystemSettings;
