import { useEffect, useRef } from 'react';
import { useTimerContext } from '../context/TimerContext';
import toast from 'react-hot-toast';
import { TimerActionType } from '../types/TimerActionType';

const useTimerTick = () => {
  const { state, dispatch } = useTimerContext();
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Only set up the interval if there are running timers
    const hasRunningTimers = state.timers.some(timer => timer.status === 'running');
    
    if (hasRunningTimers) {
      intervalRef.current = window.setInterval(() => {
        const now = Date.now();
        
        state.timers.forEach(timer => {
          if (timer.status === 'running' && timer.lastStarted) {
            const elapsedSinceStart = Math.floor((now - timer.lastStarted) / 1000);
            const newRemainingTime = Math.max(0, timer.remainingTime - elapsedSinceStart);
            
            // Update the timer with the new remaining time
            if (newRemainingTime !== timer.remainingTime) {
              // If the timer has reached zero, mark it as complete
              if (newRemainingTime === 0) {
                dispatch({ type: TimerActionType.COMPLETE_TIMER, payload: timer.id });
                
                // Add to history
                dispatch({ 
                  type: TimerActionType.ADD_TO_HISTORY, 
                  payload: {
                    id: crypto.randomUUID(),
                    timerId: timer.id,
                    timerName: timer.name,
                    category: timer.category,
                    duration: timer.duration,
                    completedAt: new Date().toISOString()
                  }
                });

                // Show completion notification
                toast.success(`Timer "${timer.name}" has completed!`, {
                  icon: '🎉',
                });

                if ('Notification' in window && Notification.permission === 'granted') {
                  new Notification('Timer Completed!', {
                    body: `Your timer "${timer.name}" has finished.`,
                    icon: '/vite.svg',
                    badge: '/vite.svg'
                  });
                }
              } else {
                // Otherwise update the timer with the new remaining time
                dispatch({ 
                  type: TimerActionType.UPDATE_TIMER, 
                  payload: { 
                    ...timer, 
                    remainingTime: newRemainingTime,
                    lastStarted: now 
                  } 
                });
                
                // Check for halfway alert if enabled
                if (timer.halfwayAlert && 
                    newRemainingTime <= timer.duration / 2 && 
                    (timer.remainingTime > timer.duration / 2)) {
                  toast(`Timer "${timer.name}" is halfway complete!`, {
                    icon: '⏱️',
                  });

                  if ('Notification' in window && Notification.permission === 'granted') {
                    new Notification('Halfway Point!', {
                      body: `Timer "${timer.name}" is halfway complete!`,
                      icon: '/vite.svg',
                      badge: '/vite.svg'
                    });
                  }
                }
              }
            }
          }
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.timers, dispatch]);

  return null;
};

export default useTimerTick;