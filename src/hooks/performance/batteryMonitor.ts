
import { useEffect, useRef } from 'react';
import { QualityLevel } from './types';
import { PERFORMANCE_TOKENS, logPerformanceToken } from '../../constants';

export const useBatteryMonitor = (
  setPerformanceState: React.Dispatch<React.SetStateAction<any>>
) => {
  const batteryApiRef = useRef<any>(null);

  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        batteryApiRef.current = battery;
        
        const checkBattery = () => {
          if (battery.level < PERFORMANCE_TOKENS.battery.lowLevel && !battery.charging) {
            logPerformanceToken('low-battery', `${Math.round(battery.level * 100)}%`);
            setPerformanceState((prev: any) => ({ 
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
