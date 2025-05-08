import { TimerStatus } from "./TimerStatus";
import { TimerCategory } from "./TimerCategory";


export interface Timer {
  id: string;
  name: string;
  category: TimerCategory;
  duration: number; // Total duration in seconds
  remainingTime: number; // Remaining time in seconds
  status: TimerStatus;
  createdAt: string; // ISO date string
  lastStarted?: number; // timestamp when the timer was last started
  halfwayAlert?: boolean; // Whether to show an alert halfway through
}

export interface Category {
  name: string;
  timers: Timer[];
}

export interface TimerHistory {
  id: string;
  timerId: string;
  timerName: string;
  category: string;
  duration: number;
  completedAt: string; // ISO date string
}