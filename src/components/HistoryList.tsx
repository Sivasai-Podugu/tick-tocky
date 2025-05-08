import React from 'react';
import { useTimerContext } from '../context/TimerContext';
import { formatTime } from '../utils/timeUtils';
import { Clock } from 'lucide-react';

const HistoryList: React.FC = () => {
  const { state } = useTimerContext();
  
  if (state.history.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-500">No completed timers yet</h3>
        <p className="text-gray-400 mt-1">Complete a timer to see it in your history</p>
      </div>
    );
  }
  
  // Group history by date
  const groupedHistory = state.history.reduce((groups, entry) => {
    const date = new Date(entry.completedAt).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(entry);
    return groups;
  }, {} as Record<string, typeof state.history>);
  
  return (
    <div className="space-y-6">
      {Object.entries(groupedHistory).map(([date, entries]) => (
        <div key={date} className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <h3 className="font-medium text-gray-700">{date}</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {entries.map((entry) => {
              const completedTime = new Date(entry.completedAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });
              
              return (
                <div key={entry.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between mb-1">
                    <div className="font-medium text-gray-800">{entry.timerName}</div>
                    <div className="text-sm text-gray-500">{completedTime}</div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <div className="text-gray-600">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {entry.category}
                      </span>
                    </div>
                    <div className="text-gray-500">Duration: {formatTime(entry.duration)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistoryList;