import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { Timer, Category, TimerHistory } from '../types';
import { TimerActionType } from '../types/TimerActionType';
import toast from 'react-hot-toast';

interface TimerState {
  timers: Timer[];
  history: TimerHistory[];
  version: string;
}

type TimerAction =
  | { type: TimerActionType.ADD_TIMER; payload: Timer }
  | { type: TimerActionType.UPDATE_TIMER; payload: Timer }
  | { type: TimerActionType.DELETE_TIMER; payload: string }
  | { type: TimerActionType.START_TIMER; payload: string }
  | { type: TimerActionType.PAUSE_TIMER; payload: string }
  | { type: TimerActionType.RESET_TIMER; payload: string }
  | { type: TimerActionType.COMPLETE_TIMER; payload: string }
  | { type: TimerActionType.START_CATEGORY; payload: string }
  | { type: TimerActionType.PAUSE_CATEGORY; payload: string }
  | { type: TimerActionType.RESET_CATEGORY; payload: string }
  | { type: TimerActionType.ADD_TO_HISTORY; payload: TimerHistory }
  | { type: TimerActionType.INIT_STATE; payload: TimerState };

interface TimerContextProps {
  state: TimerState;
  dispatch: React.Dispatch<TimerAction>;
  categories: Category[];
}

const TimerContext = createContext<TimerContextProps | undefined>(undefined);

const initialState: TimerState = {
  timers: [],
  history: [],
  version: '1.0.0',
};

const STORAGE_KEY = 'timerState';

const timerReducer = (state: TimerState, action: TimerAction): TimerState => {
  switch (action.type) {
    case TimerActionType.ADD_TIMER:
      return {
        ...state,
        timers: [...state.timers, action.payload],
      };
    case TimerActionType.UPDATE_TIMER:
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.id === action.payload.id ? action.payload : timer
        ),
      };
    case TimerActionType.DELETE_TIMER:
      return {
        ...state,
        timers: state.timers.filter((timer) => timer.id !== action.payload),
      };
    case TimerActionType.START_TIMER:
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.id === action.payload
            ? { ...timer, status: 'running', lastStarted: Date.now() }
            : timer
        ),
      };
    case TimerActionType.PAUSE_TIMER:
      return {
        ...state,
        timers: state.timers.map((timer) => {
          if (timer.id === action.payload && timer.status === 'running') {
            const elapsedSinceStart = Math.floor((Date.now() - (timer.lastStarted || 0)) / 1000);
            const newRemainingTime = Math.max(0, timer.remainingTime - elapsedSinceStart);
            return {
              ...timer,
              status: 'paused',
              remainingTime: newRemainingTime,
              lastStarted: undefined,
            };
          }
          return timer;
        }),
      };
    case TimerActionType.RESET_TIMER:
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.id === action.payload
            ? { ...timer, status: 'paused', remainingTime: timer.duration, lastStarted: undefined }
            : timer
        ),
      };
    case TimerActionType.COMPLETE_TIMER:
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.id === action.payload
            ? { ...timer, status: 'completed', remainingTime: 0, lastStarted: undefined }
            : timer
        ),
      };
    case TimerActionType.START_CATEGORY:
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.category === action.payload && timer.status !== 'completed'
            ? { ...timer, status: 'running', lastStarted: Date.now() }
            : timer
        ),
      };
    case TimerActionType.PAUSE_CATEGORY:
      return {
        ...state,
        timers: state.timers.map((timer) => {
          if (timer.category === action.payload && timer.status === 'running') {
            const elapsedSinceStart = Math.floor((Date.now() - (timer.lastStarted || 0)) / 1000);
            const newRemainingTime = Math.max(0, timer.remainingTime - elapsedSinceStart);
            return {
              ...timer,
              status: 'paused',
              remainingTime: newRemainingTime,
              lastStarted: undefined,
            };
          }
          return timer;
        }),
      };
    case TimerActionType.RESET_CATEGORY:
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.category === action.payload
            ? { ...timer, status: 'paused', remainingTime: timer.duration, lastStarted: undefined }
            : timer
        ),
      };
    case TimerActionType.ADD_TO_HISTORY:
      return {
        ...state,
        history: [action.payload, ...state.history],
      };
    case TimerActionType.INIT_STATE:
      return {
        ...action.payload,
        version: initialState.version,
      };
    default:
      return state;
  }
};

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(timerReducer, initialState);
  const [isLoaded, setIsLoaded] = useState(false);

  // Get unique categories from timers
  const categories = Array.from(
    new Set(state.timers.map((timer) => timer.category))
  ).map((category) => ({
    name: category,
    timers: state.timers.filter((timer) => timer.category === category),
  }));

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        
        // Version check and migration could be added here
        if (parsedState.version !== initialState.version) {
          console.log('Data version mismatch, using defaults');
          toast.error('Error loading saved data');
          return;
        }
        
        dispatch({ type: TimerActionType.INIT_STATE, payload: parsedState });
      }
      setIsLoaded(true); 
    } catch (err) {
      console.error('Failed to load saved state:', err);
      toast.error('Error loading saved data');
      setIsLoaded(true);
    }
  }, []);

  // Save state to localStorage on state change
  useEffect(() => {
    if (!isLoaded) return; 
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error('Failed to save state:', err);
      toast.error('Error saving data');
    }
  }, [state, isLoaded]);

  return (
    <TimerContext.Provider value={{ state, dispatch, categories }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimerContext = () => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimerContext must be used within a TimerProvider');
  }
  return context;
};