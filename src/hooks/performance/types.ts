
export type QualityLevel = 'high' | 'medium' | 'low' | 'static';

export interface PerformanceState {
  currentQuality: QualityLevel;
  fps: number;
  isMonitoring: boolean;
  shouldAutoDegrade: boolean;
  deviceCapabilities: ReturnType<typeof import('../../utils/deviceDetection').detectDeviceCapabilities>;
  isPaused: boolean;
}

export interface FPSMonitorConfig {
  isMobile: boolean;
  minFPS: number;
  monitoringDuration: number;
}
