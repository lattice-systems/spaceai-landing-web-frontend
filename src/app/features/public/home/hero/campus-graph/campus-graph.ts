import { ChangeDetectionStrategy, Component } from '@angular/core';

const NODES = [
  { id: 'mobile', label: 'App Móvil',       x: 80,  y: 65  },
  { id: 'access', label: 'Control Acceso',  x: 320, y: 65  },
  { id: 'kiosk',  label: 'Kiosco SIDE',     x: 80,  y: 235 },
  { id: 'robot',  label: 'Robot Autónomo',  x: 320, y: 235 },
] as const;

const CENTER = { x: 200, y: 150 };

@Component({
  selector: 'app-campus-graph',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .graph-line {
      stroke-dasharray: 6 4;
      animation: dash 2.4s linear infinite;
    }
    .graph-line:nth-of-type(2) { animation-delay: -0.6s; }
    .graph-line:nth-of-type(3) { animation-delay: -1.2s; }
    .graph-line:nth-of-type(4) { animation-delay: -1.8s; }
    .pulse {
      animation: pulse-dot 2.4s ease-in-out infinite;
    }
    .pulse:nth-of-type(2) { animation-delay: -0.6s; }
    .pulse:nth-of-type(3) { animation-delay: -1.2s; }
    .pulse:nth-of-type(4) { animation-delay: -1.8s; }
    @keyframes dash {
      to { stroke-dashoffset: -20; }
    }
    @keyframes pulse-dot {
      0%, 100% { opacity: 0.3; r: 2.5px; }
      50%       { opacity: 1;   r: 4.5px; }
    }
  `],
  template: `
    <svg
      viewBox="0 0 400 300"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      class="w-full max-w-lg text-primary"
    >
      <!-- Animated lines -->
      @for (node of nodes; track node.id) {
        <line
          class="graph-line"
          [attr.x1]="center.x" [attr.y1]="center.y"
          [attr.x2]="node.x"   [attr.y2]="node.y"
          stroke="currentColor"
          stroke-width="1.5"
          opacity="0.35"
        />
      }

      <!-- Pulse dots at midpoint -->
      @for (node of nodes; track node.id) {
        <circle
          class="pulse"
          [attr.cx]="(center.x + node.x) / 2"
          [attr.cy]="(center.y + node.y) / 2"
          r="3"
          fill="currentColor"
        />
      }

      <!-- Satellite nodes -->
      @for (node of nodes; track node.id) {
        <g>
          <circle
            [attr.cx]="node.x" [attr.cy]="node.y" r="30"
            fill="currentColor" opacity="0.08"
            stroke="currentColor" stroke-width="1" opacity="0.4"
          />
          <text
            [attr.x]="node.x" [attr.y]="node.y - 5"
            text-anchor="middle" font-size="8.5" font-weight="600"
            fill="currentColor" class="text-foreground"
          >{{ node.label.split(' ')[0] }}</text>
          <text
            [attr.x]="node.x" [attr.y]="node.y + 8"
            text-anchor="middle" font-size="8.5"
            fill="currentColor" class="text-foreground" opacity="0.7"
          >{{ node.label.split(' ').slice(1).join(' ') }}</text>
        </g>
      }

      <!-- Center node -->
      <circle
        [attr.cx]="center.x" [attr.cy]="center.y" r="40"
        fill="currentColor" opacity="0.12"
        stroke="currentColor" stroke-width="1.5"
      />
      <text
        [attr.x]="center.x" [attr.y]="center.y - 6"
        text-anchor="middle" font-size="14" font-weight="700"
        fill="currentColor" class="text-foreground"
      >Space</text>
      <text
        [attr.x]="center.x" [attr.y]="center.y + 10"
        text-anchor="middle" font-size="14" font-weight="700"
        fill="currentColor"
      >IA</text>
    </svg>
  `,
})
export class CampusGraph {
  protected readonly nodes = NODES;
  protected readonly center = CENTER;
}
