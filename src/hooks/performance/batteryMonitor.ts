
import { useEffect, useRef } from 'react';
import { QualityLevel } from './types';

export const useBatteryMonitor = (
  setPerformanceState: React.Dispatch<React.SetStateAction<any>>
) => {
  const batteryApiRef = useRef<any>(null);

  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        batteryApiRef.current = battery;
        
        const checkBattery = () => {
          if (battery.level < 0.2 && !battery.charging) {
            console.log('Low battery detected, reducing animation quality');
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
