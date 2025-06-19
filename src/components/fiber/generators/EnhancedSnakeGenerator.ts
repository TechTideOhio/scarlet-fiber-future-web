
import { SnakeGenerator } from '../core/SnakeGenerator';

// Enhanced Snake Generator extends the core functionality
export class EnhancedSnakeGenerator extends SnakeGenerator {
  constructor(containerWidth: number, containerHeight: number, isMobile: boolean = false) {
    super(containerWidth, containerHeight, isMobile);
  }

  // Additional enhanced methods could be added here in the future
  // For now, it inherits all functionality from the base SnakeGenerator
}

export default EnhancedSnakeGenerator;
