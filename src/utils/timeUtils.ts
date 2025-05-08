export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const parseTimeInput = (input: string): number => {
  // If input is empty, return 0
  if (!input.trim()) return 0;
  
  // If input is just a number, assume it's in seconds
  if (/^\d+$/.test(input)) {
    return parseInt(input, 10);
  }
  
  // If input has colons, parse as HH:MM:SS or MM:SS
  const parts = input.split(':').map(part => parseInt(part, 10));
  
  if (parts.length === 2) {
    // MM:SS format
    const [minutes, seconds] = parts;
    return minutes * 60 + seconds;
  } else if (parts.length === 3) {
    // HH:MM:SS format
    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
  }
  
  // If input doesn't match any expected format, return 0
  return 0;
};