
import { useEffect, useRef } from 'react';
import { PerformanceState } from './types';

// Battery Status API is not in the standard DOM lib typings.
interface BatteryManager extends EventTarget {
  level: number;
  charging: boolean;
}

type NavigatorWithBattery = Navigator & { getBattery: () => Promise<BatteryManager> };
import { PERFORMANCE_TOKENS, logPerformanceToken } from '../../constants';

export const useBatteryMonitor = (
  setPerformanceState: React.Dispatch<React.SetStateAction<PerformanceState>>
) => {
  const batteryApiRef = useRef<BatteryManager | null>(null);

  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as NavigatorWithBattery).getBattery().then((battery) => {
        batteryApiRef.current = battery;
        
        const checkBattery = () => {
          if (battery.level < PERFORMANCE_TOKENS.battery.lowLevel && !battery.charging) {
            logPerformanceToken('low-battery', `${Math.round(battery.level * 100)}%`);
            setPerformanceState((prev) => ({ 
              ...prev, 
              currentQuality: prev.currentQuality === 'high' ? 'medium' : 'low'
            }));
          }
        };
        
        battery.addEventListener('levelchange', checkBattery);
        battery.addEventListener('chargingchange', checkBattery);
        checkBattery();
      });
    }
  }, [setPerformanceState]);

  return { batteryApiRef };
};
