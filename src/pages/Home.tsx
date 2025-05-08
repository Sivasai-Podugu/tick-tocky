import React, { useState } from 'react';
import { useTimerContext } from '../context/TimerContext';
import CategoryGroup from '../components/CategoryGroup';
import TimerForm from '../components/TimerForm';
import useTimerTick from '../hooks/useTimerTick';
import { Plus, Filter } from 'lucide-react';

const Home: React.FC = () => {
  const { categories } = useTimerContext();
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState<string>('');
  
  // Use the timer tick hook to update timers
  useTimerTick();
  
  // Filter categories based on the selected filter
  const filteredCategories = filter 
    ? categories.filter(category => category.name === filter)
    : categories;
  
  // Request notification permission if not granted
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Notification permission granted');
      }
    }
  };
  
  React.useEffect(() => {
    requestNotificationPermission();
  }, []);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Your Timers</h1>
        <div className="flex space-x-2">
          {categories.length > 0 && (
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-8 pr-4 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              <Filter className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          )}
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Timer
          </button>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <Plus className="h-8 w-8 text-indigo-600" />
          </div>
          <h2 className="text-xl font-medium text-gray-700 mb-2">No timers yet</h2>
          <p className="text-gray-500 mb-6">Create your first timer to get started</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Create Timer
          </button>
        </div>
      ) : (
        <div>
          {filteredCategories.map((category) => (
            <CategoryGroup key={category.name} category={category} />
          ))}
        </div>
      )}

      {showAddForm && <TimerForm onClose={() => setShowAddForm(false)} />}
    </div>
  );
};

export default Home;