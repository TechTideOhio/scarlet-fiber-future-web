# 🎯 Design Token System

## Overview
This project uses a comprehensive design token system to eliminate magic numbers and create a single source of truth for all constants.

## Token Categories

### 🎬 Animation Tokens (`animationTokens.ts`)
- **Duration**: All animation timings (flash, fast, comfortable, etc.)
- **Easing**: Transition curves (linear, smooth, spring)
- **Opacity**: Transparency levels (invisible to full)
- **Delays**: Stagger timings

### 🔆 Fiber Animation Tokens (`fiberAnimationTokens.ts`)
- **Path Count**: Quality-based path generation for mobile/desktop
- **Segment Length**: Visual segments per path
- **Speed**: Animation progression rates
- **Visual Properties**: Opacity, glow, color intensity
- **Node Properties**: Visibility thresholds, radius multipliers

### 📐 Layout Tokens (`layoutTokens.ts`)
- **Spacing**: Standardized spacing scale
- **Breakpoints**: Responsive design breakpoints
- **Z-Index**: Layer management
- **Grid**: Background grid dimensions
- **Scroll**: Thresholds for sticky elements and parallax

### ⚡ Performance Tokens (`performanceTokens.ts`)
- **FPS**: Frame rate targets and thresholds
- **Monitoring**: Performance tracking intervals
- **Battery**: Power management thresholds
- **Canvas**: Rendering optimization values
- **Delta Time**: Animation timing bounds
- **Logging**: Frame logging intervals

### 🎨 Color Tokens (`colorTokens.ts`)
- **Brand**: Company colors (Buckeye scarlet)
- **Fiber Paths**: Animation color palette
- **Glow**: Light effect colors
- **Background**: Canvas colors

## Usage Examples

```typescript
import { ANIMATION_TOKENS, FIBER_ANIMATION_TOKENS } from '@/constants';

// ✅ Good - Using tokens
const opacity = ANIMATION_TOKENS.opacity.veryBright;
const duration = ANIMATION_TOKENS.duration.comfortable;
const pathCount = FIBER_ANIMATION_TOKENS.pathCount.desktop.high;

// ❌ Bad - Magic numbers
const opacity = 0.8;
const duration = 500;
const pathCount = 10;
```

## Benefits

### Single Responsibility
Each token has one clear purpose with a semantic name.

### Self-Documenting
Emojis + clear names = no comments needed. AI can understand intent immediately.

### DRY Principle
No repeated values across the codebase.

### Easy Maintenance
Change one value, update entire app consistently.

### Type Safety
All tokens are strongly typed with TypeScript.
