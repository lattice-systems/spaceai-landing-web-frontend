import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  NgZone,
  DOCUMENT,
  viewChild,
} from '@angular/core';

interface Dot {
  x: number; y: number;
  ox: number; oy: number;
  vx: number; vy: number;
}

const SPACING = 32;
const DOT_R = 1.3;
const REPEL_R = 100;
const REPEL_STR = 5;
const SPRING = 0.09;
const FRICTION = 0.80;

@Component({
  selector: 'app-particle-bg',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`:host { display: contents; }`],
  template: `<canvas #canvas class="pointer-events-none fixed inset-0 -z-10 block h-full w-full"></canvas>`,
})
export class ParticleBg {
  private readonly zone = inject(NgZone);
  private readonly doc = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  constructor() {
    afterNextRender(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      this.zone.runOutsideAngular(() => this.init());
    });
  }

  private init(): void {
    const canvas = this.canvasRef().nativeElement;
    const ctx = canvas.getContext('2d')!;
    const win = this.doc.defaultView!;
    const dpr = win.devicePixelRatio || 1;

    let dots: Dot[] = [];
    let w = 0, h = 0;
    const mouse = { x: -9999, y: -9999 };
    let frameId = 0;

    const isDark = () => this.doc.documentElement.classList.contains('dark');

    const resize = () => {
      w = win.innerWidth;
      h = win.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.scale(dpr, dpr);
      buildGrid();
    };

    const buildGrid = () => {
      dots = [];
      for (let y = SPACING / 2; y < h; y += SPACING) {
        for (let x = SPACING / 2; x < w; x += SPACING) {
          dots.push({ x, y, ox: x, oy: y, vx: 0, vy: 0 });
        }
      }
    };

    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = isDark()
        ? 'rgba(248, 250, 252, 0.065)'
        : 'rgba(15, 23, 42, 0.085)';

      for (const d of dots) {
        let ax = (d.ox - d.x) * SPRING;
        let ay = (d.oy - d.y) * SPRING;

        const mdx = mouse.x - d.x;
        const mdy = mouse.y - d.y;
        const dist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (dist < REPEL_R && dist > 0) {
          const f = ((1 - dist / REPEL_R) ** 2) * REPEL_STR;
          ax -= (mdx / dist) * f;
          ay -= (mdy / dist) * f;
        }

        d.vx = (d.vx + ax) * FRICTION;
        d.vy = (d.vy + ay) * FRICTION;
        d.x += d.vx;
        d.y += d.vy;

        ctx.beginPath();
        ctx.arc(d.x, d.y, DOT_R, 0, Math.PI * 2);
        ctx.fill();
      }

      frameId = requestAnimationFrame(loop);
    };

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onMouseLeave = () => { mouse.x = -9999; mouse.y = -9999; };

    resize();
    win.addEventListener('resize', resize, { passive: true });
    this.doc.addEventListener('mousemove', onMouseMove, { passive: true });
    this.doc.addEventListener('mouseleave', onMouseLeave);

    // Fade canvas in after first frame
    canvas.style.opacity = '0';
    canvas.style.transition = 'opacity 1s ease';
    frameId = requestAnimationFrame(() => {
      loop();
      canvas.style.opacity = '1';
    });

    this.destroyRef.onDestroy(() => {
      cancelAnimationFrame(frameId);
      win.removeEventListener('resize', resize);
      this.doc.removeEventListener('mousemove', onMouseMove);
      this.doc.removeEventListener('mouseleave', onMouseLeave);
    });
  }
}
