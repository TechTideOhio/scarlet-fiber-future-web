import { FIBER_ANIMATION_TOKENS, COLOR_TOKENS, LAYOUT_TOKENS, ANIMATION_TOKENS, logFiberToken } from '../constants';

export class AnimatedFiber {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  progress: number;
  speed: number;
  width: number;
  opacity: number;
  cp1x: number;
  cp1y: number;
  cp2x: number;
  cp2y: number;
  canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.x = 0;
    this.y = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.progress = 0;
    this.speed = 0;
    this.width = 0;
    this.opacity = 0;
    this.cp1x = 0;
    this.cp1y = 0;
    this.cp2x = 0;
    this.cp2y = 0;
    this.reset();
  }

  reset() {
    const edgeOffset = LAYOUT_TOKENS.spacing.massive;
    this.x = Math.random() * this.canvas.width;
    this.y = this.canvas.height + edgeOffset;
    this.targetX = Math.random() * this.canvas.width;
    this.targetY = -edgeOffset;
    this.progress = 0;
    
    // Calculate base speed with master speed multiplier
    const baseSpeed = FIBER_ANIMATION_TOKENS.speed.base.min + 
                      Math.random() * (FIBER_ANIMATION_TOKENS.speed.base.default - FIBER_ANIMATION_TOKENS.speed.base.min);
    
    // Apply master speed controls (global * fiber.progress * fiber.canvas)
    this.speed = baseSpeed * 
                 ANIMATION_TOKENS.masterSpeed.global * 
                 ANIMATION_TOKENS.masterSpeed.fiber.progress *
                 ANIMATION_TOKENS.masterSpeed.fiber.canvas;
    
    this.width = FIBER_ANIMATION_TOKENS.lineWidth.mobile.main + 
                 Math.random() * FIBER_ANIMATION_TOKENS.lineWidth.mobile.main;
    this.opacity = 0;
    
    console.log(`🎨 Fiber Reset: speed=${this.speed.toFixed(4)} (base=${baseSpeed.toFixed(4)} × global=${ANIMATION_TOKENS.masterSpeed.global}), width=${this.width.toFixed(1)}px`);
    
    // Control points for bezier curve
    const curveDeviation = LAYOUT_TOKENS.spacing.gigantic * 6;
    this.cp1x = this.x + (Math.random() - 0.5) * curveDeviation;
    this.cp1y = this.canvas.height * 0.7;
    this.cp2x = this.targetX + (Math.random() - 0.5) * curveDeviation;
    this.cp2y = this.canvas.height * 0.3;
  }

  update() {
    this.progress += this.speed;
    
    // Fade in and out using token values
    const fadeThreshold = ANIMATION_TOKENS.opacity.subtle;
    if (this.progress < fadeThreshold) {
      this.opacity = this.progress / fadeThreshold;
    } else if (this.progress > (1 - fadeThreshold)) {
      this.opacity = (1 - this.progress) / fadeThreshold;
    } else {
      this.opacity = FIBER_ANIMATION_TOKENS.opacity.path.max;
    }

    if (this.progress > 1) {
      console.log(`🔄 Fiber Complete: progress=${this.progress.toFixed(2)}, resetting...`);
      this.reset();
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const t = this.progress;
    
    // Calculate current position on bezier curve
    const x = Math.pow(1-t, 3) * this.x + 
             3 * Math.pow(1-t, 2) * t * this.cp1x + 
             3 * (1-t) * Math.pow(t, 2) * this.cp2x + 
             Math.pow(t, 3) * this.targetX;
             
    const y = Math.pow(1-t, 3) * this.y + 
             3 * Math.pow(1-t, 2) * t * this.cp1y + 
             3 * (1-t) * Math.pow(t, 2) * this.cp2y + 
             Math.pow(t, 3) * this.targetY;

    // Draw fiber trail
    ctx.save();
    ctx.globalAlpha = this.opacity * FIBER_ANIMATION_TOKENS.opacity.path.base;
    
    // Create gradient for fiber - Updated to Buckeye red
    const gradientSpread = LAYOUT_TOKENS.spacing.massive;
    const gradient = ctx.createLinearGradient(
      x - gradientSpread, y - gradientSpread, 
      x + gradientSpread, y + gradientSpread
    );
    gradient.addColorStop(0, COLOR_TOKENS.buckeye.scarletRgba(0));
    gradient.addColorStop(0.5, COLOR_TOKENS.buckeye.scarlet);
    gradient.addColorStop(1, COLOR_TOKENS.buckeye.scarletRgba(0));
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = this.width;
    ctx.lineCap = 'round';
    
    // Draw the path
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.bezierCurveTo(
      this.cp1x, this.cp1y,
      this.cp2x, this.cp2y,
      this.targetX, this.targetY
    );
    ctx.stroke();
    
    // Draw bright core
    ctx.globalAlpha = this.opacity;
    ctx.strokeStyle = COLOR_TOKENS.glow.core(0.8);
    ctx.lineWidth = this.width * 0.3;
    ctx.stroke();
    
    // Draw light point - Updated to Buckeye red
    const pointRadius = FIBER_ANIMATION_TOKENS.node.minRadius + this.width;
    ctx.beginPath();
    ctx.arc(x, y, pointRadius, 0, Math.PI * 2);
    const pointGradient = ctx.createRadialGradient(x, y, 0, x, y, pointRadius);
    pointGradient.addColorStop(0, COLOR_TOKENS.glow.core(1));
    pointGradient.addColorStop(0.3, COLOR_TOKENS.buckeye.scarletRgba(0.8));
    pointGradient.addColorStop(1, COLOR_TOKENS.buckeye.scarletRgba(0));
    ctx.fillStyle = pointGradient;
    ctx.fill();
    
    ctx.restore();
  }
}
