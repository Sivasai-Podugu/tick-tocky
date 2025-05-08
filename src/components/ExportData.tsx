import React from 'react';
import { useTimerContext } from '../context/TimerContext';
import { Download } from 'lucide-react';

const ExportData: React.FC = () => {
  const { state } = useTimerContext();
  
  const handleExport = () => {
    // Create a JSON file from the state
    const dataStr = JSON.stringify(state, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    // Create a download link and trigger the download
    const exportName = `timer-data-${new Date().toISOString().slice(0, 10)}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportName);
    linkElement.click();
  };
  
  return (
    <button
      onClick={handleExport}
      className="flex items-center px-4 py-2 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors"
    >
      <Download className="h-4 w-4 mr-2" />
      Export Timer Data
    </button>
  );
};

export default ExportData;