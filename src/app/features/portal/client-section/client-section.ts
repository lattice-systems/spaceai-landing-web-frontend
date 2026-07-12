import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

type PortalSectionKey = 'documentos' | 'cotizaciones' | 'soporte' | 'perfil';

const CONTENT: Record<
  PortalSectionKey,
  {
    title: string;
    description: string;
    primary: string;
    items: readonly string[];
  }
> = {
  documentos: {
    title: 'Documentación',
    description: 'Manuales, guías de instalación y recursos técnicos asociados al cliente.',
    primary: 'Buscar documentos',
    items: ['Manual de usuario', 'Guía de instalación', 'Documentación técnica'],
  },
  cotizaciones: {
    title: 'Cotizaciones',
    description: 'Historial de propuestas, módulos solicitados y estado comercial.',
    primary: 'Cotizaciones recientes',
    items: ['Propuesta campus inteligente', 'Módulo control de acceso', 'Kiosco SIDE'],
  },
  soporte: {
    title: 'Soporte',
    description: 'Tickets abiertos, detalles de atención y seguimiento de estado.',
    primary: 'Tickets abiertos',
    items: ['Acceso QR en revisión', 'Ajuste de usuarios', 'Solicitud de capacitación'],
  },
  perfil: {
    title: 'Perfil',
    description: 'Información institucional, contacto y configuración básica de cuenta.',
    primary: 'Datos de cuenta',
    items: ['Información personal', 'Contacto institucional', 'Cambio de contraseña'],
  },
};

@Component({
  selector: 'app-client-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div class="bg-muted/50 rounded-xl p-5">
        <p class="text-muted-foreground text-sm">Portal cliente</p>
        <h1 class="text-foreground mt-2 text-2xl font-semibold tracking-normal">
          {{ section.title }}
        </h1>
        <p class="text-muted-foreground mt-3 max-w-2xl text-sm leading-6">
          {{ section.description }}
        </p>
      </div>

      <div class="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <section class="bg-muted/50 rounded-xl p-5">
          <h2 class="text-foreground text-base font-semibold">{{ section.primary }}</h2>
          <div class="mt-5 grid gap-3">
            <div class="bg-background/70 border-border h-10 rounded-lg border"></div>
            <div class="bg-background/70 border-border h-10 rounded-lg border"></div>
            <div class="bg-background/70 border-border h-10 rounded-lg border"></div>
          </div>
        </section>

        <section class="bg-muted/50 rounded-xl p-5">
          <h2 class="text-foreground text-base font-semibold">Listado</h2>
          <div class="mt-5 grid gap-3">
            @for (item of section.items; track item) {
              <article class="bg-background/70 border-border rounded-lg border p-4">
                <p class="text-foreground text-sm font-medium">{{ item }}</p>
                <div class="bg-muted mt-3 h-2 rounded-full"></div>
              </article>
            }
          </div>
        </section>
      </div>

      <div class="bg-muted/50 min-h-80 flex-1 rounded-xl"></div>
    </section>
  `,
})
export class ClientSection {
  readonly #route = inject(ActivatedRoute);
  protected readonly section =
    CONTENT[(this.#route.snapshot.data['section'] as PortalSectionKey | undefined) ?? 'documentos'];
}
