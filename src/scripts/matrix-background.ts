/**
 * Neural Network Background Animation
 * AI-style network with nodes and connections
 */

// ============ Type Definitions ============

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  pulsePhase: number;
  pulseSpeed: number;
}

interface ThemeColors {
  node: string;
  connection: string;
  glow: string;
}

interface Config {
  nodeCount: number;
  nodeRadius: number;
  connectionDistance: number;
  speed: number;
  pulseIntensity: number;
}

// ============ State ============

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let nodes: Node[] = [];
let colors: ThemeColors;
let config: Config;
let animationId: number | null = null;
let isInitialized = false;
let width = 0;
let height = 0;
let dpr = 1;

// ============ Configuration ============

function getConfig(): Config {
  const isMobile = window.innerWidth < 768;

  return {
    nodeCount: isMobile ? 50 : 100,
    nodeRadius: isMobile ? 3 : 4,
    connectionDistance: isMobile ? 150 : 180,
    speed: 0.4,
    pulseIntensity: 0.3,
  };
}

// ============ Theme Colors ============

function getThemeColors(): ThemeColors {
  const style = getComputedStyle(document.documentElement);
  const accent = style.getPropertyValue("--accent").trim() || "#006cac";

  return {
    node: accent,
    connection: accent,
    glow: accent,
  };
}

// ============ Node Management ============

function createNodes(): void {
  nodes = [];
  for (let i = 0; i < config.nodeCount; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * config.speed,
      vy: (Math.random() - 0.5) * config.speed,
      radius: config.nodeRadius * (0.8 + Math.random() * 0.4),
      pulsePhase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.02,
    });
  }
}

function updateNodes(): void {
  for (const node of nodes) {
    // Update position
    node.x += node.vx;
    node.y += node.vy;

    // Bounce off edges
    if (node.x < 0 || node.x > width) node.vx *= -1;
    if (node.y < 0 || node.y > height) node.vy *= -1;

    // Keep in bounds
    node.x = Math.max(0, Math.min(width, node.x));
    node.y = Math.max(0, Math.min(height, node.y));

    // Update pulse
    node.pulsePhase += node.pulseSpeed;

    // Limit velocity
    const maxSpeed = config.speed * 2;
    const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
    if (speed > maxSpeed) {
      node.vx = (node.vx / speed) * maxSpeed;
      node.vy = (node.vy / speed) * maxSpeed;
    }
  }
}

// ============ Rendering ============

function hexToRgba(hex: string, alpha: number): string {
  let r: number, g: number, b: number;
  if (hex.length === 4) {
    r = parseInt(hex + hex, 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function render(): void {
  if (!ctx || !canvas) return;

  // Clear
  ctx.clearRect(0, 0, width, height);

  // Draw connections
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[j].x - nodes[i].x;
      const dy = nodes[j].y - nodes[i].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < config.connectionDistance) {
        const alpha = (1 - dist / config.connectionDistance) * 0.25;
        ctx.strokeStyle = hexToRgba(colors.connection, alpha);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }
  }

  // Draw nodes
  for (const node of nodes) {
    const pulse = 1 + Math.sin(node.pulsePhase) * config.pulseIntensity;
    const radius = node.radius * pulse;

    // Glow
    ctx.beginPath();
    ctx.arc(node.x, node.y, radius * 3, 0, Math.PI * 2);
    ctx.fillStyle = hexToRgba(colors.glow, 0.08);
    ctx.fill();

    // Core
    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = hexToRgba(colors.node, 0.5);
    ctx.fill();
  }

}

// ============ Animation Loop ============

function animate(): void {
  updateNodes();
  render();
  animationId = requestAnimationFrame(animate);
}

function stopAnimation(): void {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}

// ============ Event Handlers ============

function handleResize(): void {
  if (!canvas || !ctx) return;

  width = window.innerWidth;
  height = window.innerHeight;

  // Match canvas to window size
  canvas.width = width;
  canvas.height = height;

  config = getConfig();
  createNodes();
}

function handleVisibilityChange(): void {
  if (document.hidden) {
    stopAnimation();
  } else {
    animate();
  }
}

function handleThemeChange(): void {
  colors = getThemeColors();
}

// ============ Lifecycle ============

function shouldAnimate(): boolean {
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function initMatrixBackground(): void {
  if (!shouldAnimate()) return;

  if (isInitialized) {
    destroy();
  }

  canvas = document.getElementById("matrix-bg") as HTMLCanvasElement;
  if (!canvas) return;

  ctx = canvas.getContext("2d");
  if (!ctx) return;

  config = getConfig();
  colors = getThemeColors();

  handleResize();

  window.addEventListener("resize", handleResize);
  document.addEventListener("visibilitychange", handleVisibilityChange);
  window.addEventListener("theme-changed", handleThemeChange);

  window
    .matchMedia("(prefers-reduced-motion: reduce)")
    .addEventListener("change", e => {
      if (e.matches) {
        destroy();
      } else {
        initMatrixBackground();
      }
    });

  animate();
  isInitialized = true;
}

export function destroy(): void {
  stopAnimation();

  window.removeEventListener("resize", handleResize);
  document.removeEventListener("visibilitychange", handleVisibilityChange);
  window.removeEventListener("theme-changed", handleThemeChange);

  nodes = [];
  canvas = null;
  ctx = null;
  isInitialized = false;
}
