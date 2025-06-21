
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
    this.x = Math.random() * this.canvas.width;
    this.y = this.canvas.height + 50;
    this.targetX = Math.random() * this.canvas.width;
    this.targetY = -50;
    this.progress = 0;
    this.speed = 0.002 + Math.random() * 0.003; // Much slower
    this.width = 2 + Math.random() * 2;
    this.opacity = 0;
    
    // Control points for bezier curve
    this.cp1x = this.x + (Math.random() - 0.5) * 400;
    this.cp1y = this.canvas.height * 0.7;
    this.cp2x = this.targetX + (Math.random() - 0.5) * 400;
    this.cp2y = this.canvas.height * 0.3;
  }

  update() {
    this.progress += this.speed;
    
    // Fade in and out
    if (this.progress < 0.1) {
      this.opacity = this.progress * 10;
    } else if (this.progress > 0.9) {
      this.opacity = (1 - this.progress) * 10;
    } else {
      this.opacity = 1;
    }

    if (this.progress > 1) {
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
    ctx.globalAlpha = this.opacity * 0.8;
    
    // Create gradient for fiber - Updated to Buckeye red (#BB0000)
    const gradient = ctx.createLinearGradient(
      x - 50, y - 50, 
      x + 50, y + 50
    );
    gradient.addColorStop(0, 'rgba(187, 0, 0, 0)');
    gradient.addColorStop(0.5, 'rgba(187, 0, 0, 1)');
    gradient.addColorStop(1, 'rgba(187, 0, 0, 0)');
    
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
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = this.width * 0.3;
    ctx.stroke();
    
    // Draw light point - Updated to Buckeye red
    ctx.beginPath();
    ctx.arc(x, y, 4 + this.width, 0, Math.PI * 2);
    const pointGradient = ctx.createRadialGradient(x, y, 0, x, y, 4 + this.width);
    pointGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    pointGradient.addColorStop(0.3, 'rgba(187, 0, 0, 0.8)');
    pointGradient.addColorStop(1, 'rgba(187, 0, 0, 0)');
    ctx.fillStyle = pointGradient;
    ctx.fill();
    
    ctx.restore();
  }
}
