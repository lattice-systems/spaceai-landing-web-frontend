import { ChangeDetectionStrategy, Component } from '@angular/core';

const CX = 320;
const CY = 252;

// Center node outer ring r=80, satellite outer ring r=54.
// All curve endpoints computed at ring boundaries so lines don't pierce nodes.
//
// Unit vectors from center → each node (all equidistant at ~271px):
//   mobile/kiosk: ux=±0.856  uy=±0.517
//
// Start: center + unit * 80
// End:   node   - unit * 54

interface GraphNode {
  readonly id: string;
  readonly label: string;
  readonly sub: string;
  readonly x: number;
  readonly y: number;
  readonly color: string;
  readonly curve: string;
}

const NODES: GraphNode[] = [
  {
    id: 'mobile',
    label: 'App Móvil',
    sub: 'Campus digital',
    x: 88, y: 112,
    color: '#22D3EE',
    // Start (252,211) → End (134,140)
    // Baja a la derecha primero, luego gran arco a la izquierda y sube
    curve: 'M 252 211 C 340 330, -60 90, 134 140',
  },
  {
    id: 'access',
    label: 'Control Acceso',
    sub: 'IoT + QR',
    x: 552, y: 112,
    color: '#38BDF8',
    // Start (389,211) → End (506,140)
    // Arco limpio hacia arriba pasando por encima del diagrama
    curve: 'M 389 211 C 420 90, 560 70, 506 140',
  },
  {
    id: 'kiosk',
    label: 'Kiosco SIDE',
    sub: 'IA conversacional',
    x: 88, y: 392,
    color: '#2DD4BF',
    // Start (252,293) → End (134,364)
    // Horizontal izquierda plana luego curva hacia abajo
    curve: 'M 252 293 C 70 290, 30 340, 134 364',
  },
  {
    id: 'robot',
    label: 'Robot Autónomo',
    sub: 'Navegación IA',
    x: 552, y: 392,
    color: '#818CF8',
    // Start (389,293) → End (506,364)
    // Sale derecha-arriba, curva amplia y baja de vuelta
    curve: 'M 389 293 C 560 260, 650 400, 506 364',
  },
];

@Component({
  selector: 'app-campus-graph',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host { display: block; width: 100%; }

    .pulse-ring {
      animation: pulse-ring 4s cubic-bezier(0.23, 1, 0.32, 1) infinite;
      transform-origin: 320px 252px;
    }
    .line-dash {
      stroke-dasharray: 5 13;
      animation: dash-flow 4s linear infinite;
    }

    @keyframes pulse-ring {
      0%   { opacity: 0.18; transform: scale(1); }
      70%  { opacity: 0;    transform: scale(1.24); }
      100% { opacity: 0;    transform: scale(1.24); }
    }
    @keyframes dash-flow {
      to { stroke-dashoffset: -36; }
    }

    @media (prefers-reduced-motion: reduce) {
      .pulse-ring, .line-dash { animation: none; }
      .pulse-ring { opacity: 0.07; }
    }
  `],
  template: `
    <svg
      viewBox="0 0 640 504"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      class="w-full"
    >
      <defs>
        <!-- Radial glow interno del grafo -->
        <radialGradient id="bg-glow" cx="50%" cy="50%" r="50%" gradientUnits="objectBoundingBox">
          <stop offset="0%"   stop-color="#06B6D4" stop-opacity="0.12"/>
          <stop offset="55%"  stop-color="#06B6D4" stop-opacity="0.03"/>
          <stop offset="100%" stop-color="#06B6D4" stop-opacity="0"/>
        </radialGradient>

        <filter id="center-glow" x="-55%" y="-55%" width="210%" height="210%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        <pattern id="dot-grid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="#06B6D4" opacity="0.07"/>
        </pattern>

        <!-- Paths para animateMotion (mismas curvas que las líneas) -->
        @for (node of nodes; track node.id) {
          <path [id]="'p-' + node.id" [attr.d]="node.curve" fill="none"/>
        }
      </defs>

      <rect width="640" height="504" fill="url(#dot-grid)"/>
      <rect width="640" height="504" fill="url(#bg-glow)"/>

      <!-- Líneas base (baja opacidad) — terminan en borde del ring, no traspasan -->
      @for (node of nodes; track node.id) {
        <path
          [attr.d]="node.curve"
          [attr.stroke]="node.color"
          fill="none"
          stroke-width="1.5"
          opacity="0.2"
        />
      }

      <!-- Dashed animado -->
      @for (node of nodes; track node.id; let i = $index) {
        <path
          class="line-dash"
          [attr.d]="node.curve"
          [attr.stroke]="node.color"
          [style.animation-delay]="'-' + (i * 1) + 's'"
          fill="none"
          stroke-width="1.5"
          opacity="0.6"
        />
      }

      <!-- Dots viajando (2 por línea, offset 50%) -->
      @for (node of nodes; track node.id) {
        <circle r="4.5" [attr.fill]="node.color">
          <animateMotion dur="3.2s" repeatCount="indefinite" begin="0s" calcMode="linear">
            <mpath [attr.href]="'#p-' + node.id"/>
          </animateMotion>
        </circle>
        <circle r="4.5" [attr.fill]="node.color" opacity="0.55">
          <animateMotion dur="3.2s" repeatCount="indefinite" begin="-1.6s" calcMode="linear">
            <mpath [attr.href]="'#p-' + node.id"/>
          </animateMotion>
        </circle>
      }

      <!-- Nodos satélite -->
      @for (node of nodes; track node.id) {
        <g [style.color]="node.color">
          <!-- Tres anillos concéntricos — el color diferencia cada nodo -->
          <circle [attr.cx]="node.x" [attr.cy]="node.y" r="54"
            fill="currentColor" opacity="0.05"
            stroke="currentColor" stroke-width="1" stroke-opacity="0.12"/>
          <circle [attr.cx]="node.x" [attr.cy]="node.y" r="44"
            fill="none"
            stroke="currentColor" stroke-width="1" stroke-opacity="0.25"/>
          <circle [attr.cx]="node.x" [attr.cy]="node.y" r="34"
            fill="currentColor" opacity="0.14"
            stroke="currentColor" stroke-width="1.5" stroke-opacity="0.6"/>

          <!-- Ícono del producto -->
          <g [attr.transform]="'translate(' + node.x + ',' + node.y + ')'">
            @switch (node.id) {
              @case ('mobile') {
                <rect x="-9" y="-14" width="18" height="28" rx="3.5"
                  fill="none" stroke="currentColor" stroke-width="1.6"/>
                <line x1="0" y1="10" x2="0" y2="10.5"
                  stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
              }
              @case ('access') {
                <rect x="-8" y="-1.5" width="16" height="13" rx="2.5"
                  fill="none" stroke="currentColor" stroke-width="1.6"/>
                <path d="M-6 -1.5 V-7 a6 6 0 0 1 12 0 V-1.5"
                  fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
                <circle cx="0" cy="6" r="2.5" fill="currentColor"/>
              }
              @case ('kiosk') {
                <rect x="-11" y="-9" width="22" height="15" rx="2.5"
                  fill="none" stroke="currentColor" stroke-width="1.6"/>
                <line x1="0" y1="6" x2="0" y2="11"
                  stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
                <line x1="-5.5" y1="11" x2="5.5" y2="11"
                  stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
              }
              @case ('robot') {
                <rect x="-9" y="-9" width="18" height="17" rx="3.5"
                  fill="none" stroke="currentColor" stroke-width="1.6"/>
                <circle cx="-3.5" cy="-1.5" r="2.2" fill="currentColor"/>
                <circle cx="3.5" cy="-1.5" r="2.2" fill="currentColor"/>
                <path d="M-4 5.5 Q0 8 4 5.5"
                  fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
                <line x1="0" y1="-9" x2="0" y2="-13.5"
                  stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
                <circle cx="0" cy="-15" r="1.8" fill="currentColor"/>
              }
            }
          </g>

          <!-- Labels: arriba si nodo está en mitad superior, abajo si inferior -->
          @if (node.y < cy) {
            <text [attr.x]="node.x" [attr.y]="node.y - 63"
              text-anchor="middle" font-size="12.5" font-weight="600"
              [style.fill]="'var(--foreground)'">{{ node.label }}</text>
            <text [attr.x]="node.x" [attr.y]="node.y - 48"
              text-anchor="middle" font-size="10.5"
              [style.fill]="'var(--muted-foreground)'">{{ node.sub }}</text>
          } @else {
            <text [attr.x]="node.x" [attr.y]="node.y + 63"
              text-anchor="middle" font-size="12.5" font-weight="600"
              [style.fill]="'var(--foreground)'">{{ node.label }}</text>
            <text [attr.x]="node.x" [attr.y]="node.y + 78"
              text-anchor="middle" font-size="10.5"
              [style.fill]="'var(--muted-foreground)'">{{ node.sub }}</text>
          }
        </g>
      }

      <!-- Nodo central SpaceIA -->
      <circle class="pulse-ring text-primary"
        [attr.cx]="cx" [attr.cy]="cy" r="80"
        fill="currentColor" opacity="0.08"/>
      <circle class="text-primary"
        [attr.cx]="cx" [attr.cy]="cy" r="68"
        fill="none" stroke="currentColor" stroke-width="1" stroke-opacity="0.2"/>
      <circle class="text-primary"
        [attr.cx]="cx" [attr.cy]="cy" r="56"
        fill="currentColor" opacity="0.1"
        stroke="currentColor" stroke-width="1.5" stroke-opacity="0.55"
        filter="url(#center-glow)"/>
      <text [attr.x]="cx" [attr.y]="cy - 9"
        text-anchor="middle" font-size="18" font-weight="700" letter-spacing="0.5"
        [style.fill]="'var(--foreground)'">Space</text>
      <text [attr.x]="cx" [attr.y]="cy + 15"
        text-anchor="middle" font-size="18" font-weight="700" letter-spacing="2"
        [style.fill]="'var(--primary)'">IA</text>
    </svg>
  `,
})
export class CampusGraph {
  protected readonly nodes = NODES;
  protected readonly cx = CX;
  protected readonly cy = CY;
}
