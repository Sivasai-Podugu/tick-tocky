import React, { useState } from 'react';
import { Timer } from '../types';
import { TimerCategory } from '../types/TimerCategory';
import { useTimerContext } from '../context/TimerContext';
import { formatTime, parseTimeInput } from '../utils/timeUtils';
import { Plus, X } from 'lucide-react';
import { TimerActionType } from '../types/TimerActionType';

interface TimerFormProps {
  onClose: () => void;
}

const TimerForm: React.FC<TimerFormProps> = ({ onClose }) => {
  const { dispatch } = useTimerContext();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<TimerCategory>(TimerCategory.OTHER);
  const [durationInput, setDurationInput] = useState('');
  const [error, setError] = useState('');
  const [halfwayAlert, setHalfwayAlert] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!name.trim()) {
      setError('Please enter a timer name');
      return;
    }
    
    const duration = parseTimeInput(durationInput);
    if (!duration || duration <= 0) {
      setError('Please enter a valid duration');
      return;
    }

    // Create new timer object
    const newTimer: Timer = {
      id: crypto.randomUUID(),
      name: name.trim(),
      category,
      duration,
      remainingTime: duration,
      status: 'paused',
      createdAt: new Date().toISOString(),
      halfwayAlert,
    };

    // Add timer to state
    dispatch({ type: TimerActionType.ADD_TIMER, payload: newTimer });
    
    // Reset form and close
    setName('');
    setCategory(TimerCategory.OTHER);
    setDurationInput('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Create New Timer</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-50 text-red-600 rounded border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Timer Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="E.g., Morning Workout"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as TimerCategory)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {Object.values(TimerCategory).map((cat) => (
                <option key={cat} value={cat}>
                  {cat.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
              Duration
            </label>
            <input
              id="duration"
              type="text"
              value={durationInput}
              onChange={(e) => setDurationInput(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Format: HH:MM:SS or MM:SS or seconds"
            />
            <p className="text-xs text-gray-500 mt-1">
              Examples: 30 (for 30 seconds), 5:00 (for 5 minutes), 1:30:00 (for 1 hour 30 minutes)
            </p>
          </div>

          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={halfwayAlert}
                onChange={(e) => setHalfwayAlert(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                Enable halfway alert
              </span>
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Create Timer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TimerForm;