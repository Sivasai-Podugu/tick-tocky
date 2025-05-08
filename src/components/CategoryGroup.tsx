import React, { useState } from 'react';
import { Category } from '../types';
import { useTimerContext } from '../context/TimerContext';
import TimerCard from './TimerCard';
import { ChevronDown, ChevronUp, Play, Pause, RefreshCw } from 'lucide-react';
import { TimerActionType } from '../types/TimerActionType';

interface CategoryGroupProps {
  category: Category;
}

const CategoryGroup: React.FC<CategoryGroupProps> = ({ category }) => {
  const { dispatch } = useTimerContext();
  const [isExpanded, setIsExpanded] = useState(true);
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  const startAllTimers = () => {
    dispatch({ type: TimerActionType.START_CATEGORY, payload: category.name });
  };
  
  const pauseAllTimers = () => {
    dispatch({ type: TimerActionType.PAUSE_CATEGORY, payload: category.name });
  };
  
  const resetAllTimers = () => {
    dispatch({ type: TimerActionType.RESET_CATEGORY, payload: category.name });
  };
  
  const runningCount = category.timers.filter(timer => timer.status === 'running').length;
  const completedCount = category.timers.filter(timer => timer.status === 'completed').length;
  
  return (
    <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div 
        className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
        onClick={toggleExpand}
      >
        <div className="flex items-center">
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-500 mr-2" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500 mr-2" />
          )}
          <h2 className="font-medium text-gray-800">{category.name}</h2>
          <div className="ml-3 flex space-x-2">
            <span className="px-2 py-0.5 text-xs rounded-full bg-gray-200 text-gray-700">
              {category.timers.length} timer{category.timers.length !== 1 ? 's' : ''}
            </span>
            {runningCount > 0 && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-indigo-100 text-indigo-700">
                {runningCount} running
              </span>
            )}
            {completedCount > 0 && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">
                {completedCount} completed
              </span>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            className="p-1.5 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              startAllTimers();
            }}
            title="Start all timers"
          >
            <Play className="h-4 w-4" />
          </button>
          <button
            className="p-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              pauseAllTimers();
            }}
            title="Pause all timers"
          >
            <Pause className="h-4 w-4" />
          </button>
          <button
            className="p-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              resetAllTimers();
            }}
            title="Reset all timers"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4 border-t border-gray-200">
          {category.timers.map((timer) => (
            <TimerCard key={timer.id} timer={timer} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryGroup;