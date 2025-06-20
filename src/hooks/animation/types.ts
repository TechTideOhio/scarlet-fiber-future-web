
import { EnhancedSnakePath, EnhancedSnakeGenerator } from '../../components/fiber/EnhancedSnakeGenerator';

export interface AnimationState {
  paths: EnhancedSnakePath[];
  animationStarted: boolean;
  frameCount: number;
  lastTime: number;
}

export interface UseSnakeAnimationProps {
  isVisible: boolean;
  canvasReady: boolean;
  renderError: string | null;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  pathGeneratorRef: React.RefObject<EnhancedSnakeGenerator>;
  pathCount: number;
  heroGlowIntensity: number;
  isMobile: boolean;
  setRenderError: (error: string | null) => void;
}

export interface PathInitializationProps {
  canvasReady: boolean;
  pathGeneratorRef: React.RefObject<EnhancedSnakeGenerator>;
  pathCount: number;
  setRenderError: (error: string | null) => void;
}

export interface AnimationLoopProps {
  isVisible: boolean;
  canvasReady: boolean;
  renderError: string | null;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  pathGeneratorRef: React.RefObject<EnhancedSnakeGenerator>;
  heroGlowIntensity: number;
  isMobile: boolean;
  setRenderError: (error: string | null) => void;
  animationState: AnimationState;
  setAnimationState: React.Dispatch<React.SetStateAction<AnimationState>>;
}
