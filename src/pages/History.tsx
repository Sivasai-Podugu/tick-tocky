import React from 'react';
import HistoryList from '../components/HistoryList';
import ExportData from '../components/ExportData';

const History: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Timer History</h1>
        <ExportData />
      </div>
      
      <HistoryList />
    </div>
  );
};

export default History;