import React, { useState } from 'react';
import { Timer } from '../types';
import { useTimerContext } from '../context/TimerContext';
import { formatTime } from '../utils/timeUtils';
import { Play, Pause, RefreshCw, Trash2, Bell, BellOff } from 'lucide-react';
import { TimerActionType } from '../types/TimerActionType';

interface TimerCardProps {
  timer: Timer;
}

const TimerCard: React.FC<TimerCardProps> = ({ timer }) => {
  const { dispatch } = useTimerContext();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Calculate progress percentage
  const progress = (timer.duration - timer.remainingTime) / timer.duration * 100;
  
  // Determine progress bar color based on remaining time
  const getProgressColor = () => {
    if (timer.status === 'completed') return 'bg-green-500';
    if (progress < 50) return 'bg-indigo-500';
    if (progress < 75) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const handleStart = () => {
    dispatch({ type: TimerActionType.START_TIMER, payload: timer.id });
  };

  const handlePause = () => {
    dispatch({ type: TimerActionType.PAUSE_TIMER, payload: timer.id });
  };

  const handleReset = () => {
    dispatch({ type: TimerActionType.RESET_TIMER, payload: timer.id });
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    dispatch({ type: TimerActionType.DELETE_TIMER, payload: timer.id });
    setShowDeleteConfirm(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const toggleHalfwayAlert = () => {
    dispatch({ 
      type: TimerActionType.UPDATE_TIMER, 
      payload: { ...timer, halfwayAlert: !timer.halfwayAlert } 
    });
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 mb-3 border-l-4 ${
      timer.status === 'running' 
        ? 'border-indigo-500' 
        : timer.status === 'completed' 
          ? 'border-green-500' 
          : 'border-gray-300'
    }`}>
      {showDeleteConfirm ? (
        <div className="flex flex-col">
          <p className="text-sm text-gray-700 mb-3">Are you sure you want to delete this timer?</p>
          <div className="flex justify-end space-x-2">
            <button 
              onClick={cancelDelete}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Cancel
            </button>
            <button 
              onClick={confirmDelete}
              className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between mb-1">
            <h3 className="font-semibold text-gray-800">{timer.name}</h3>
            <div className="flex items-center">
              <button 
                onClick={toggleHalfwayAlert}
                className={`p-1 mr-1 rounded-full ${
                  timer.halfwayAlert ? 'text-amber-500 hover:text-amber-600' : 'text-gray-400 hover:text-gray-500'
                }`}
                title={timer.halfwayAlert ? "Disable halfway alert" : "Enable halfway alert"}
              >
                {timer.halfwayAlert ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
              </button>
              <button 
                onClick={handleDelete}
                className="p-1 text-gray-400 hover:text-red-500 rounded-full"
                title="Delete timer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">
                {formatTime(timer.remainingTime)} / {formatTime(timer.duration)}
              </span>
              <span className={`font-medium ${
                timer.status === 'running' 
                  ? 'text-indigo-600' 
                  : timer.status === 'completed' 
                    ? 'text-green-600' 
                    : 'text-gray-500'
              }`}>
                {timer.status.charAt(0).toUpperCase() + timer.status.slice(1)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${getProgressColor()}`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="flex space-x-2">
            {timer.status === 'running' ? (
              <button
                onClick={handlePause}
                className="flex-1 flex items-center justify-center px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors"
              >
                <Pause className="h-4 w-4 mr-1" />
                Pause
              </button>
            ) : timer.status === 'completed' ? (
              <button
                onClick={handleReset}
                className="flex-1 flex items-center justify-center px-3 py-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Restart
              </button>
            ) : (
              <button
                onClick={handleStart}
                className="flex-1 flex items-center justify-center px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors"
              >
                <Play className="h-4 w-4 mr-1" />
                Start
              </button>
            )}
            
            {timer.status !== 'completed' && (
              <button
                onClick={handleReset}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                title="Reset timer"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TimerCard;