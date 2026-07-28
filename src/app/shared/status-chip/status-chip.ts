import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';

/**
 * Badge de estado con color propio vía color-mix sobre un token --chip-* (o neutro si
 * chip() es null). Reemplaza la tríada bg/color/border que se repetía copiada en cada
 * pantalla admin (Reseñas, Cotizaciones, Mensajes, Compras, Materia Prima, Proveedores,
 * Usuarios, Catálogo) — cada una solo necesita su propio mapeo estado→chip.
 */
@Component({
  selector: 'app-status-chip',
  imports: [HlmBadgeImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      hlmBadge
      variant="outline"
      class="gap-1.5 font-normal"
      [style.background]="bg()"
      [style.color]="color()"
      [style.border-color]="border()"
    >
      {{ label() }}
    </span>
  `,
})
export class StatusChip {
  /** Texto visible del badge. */
  readonly label = input.required<string>();
  /** Nombre del token CSS, p.ej. '--chip-emerald'. null = badge neutro (outline sin color). */
  readonly chip = input<string | null>(null);

  protected readonly bg = computed(() => {
    const chip = this.chip();
    return chip ? `color-mix(in oklch, var(${chip}) 14%, transparent)` : null;
  });

  protected readonly color = computed(() => {
    const chip = this.chip();
    return chip ? `var(${chip})` : null;
  });

  protected readonly border = computed(() => {
    const chip = this.chip();
    return chip ? `color-mix(in oklch, var(${chip}) 35%, transparent)` : null;
  });
}
