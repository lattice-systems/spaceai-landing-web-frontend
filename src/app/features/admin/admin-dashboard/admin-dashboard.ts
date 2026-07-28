import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBeaker,
  lucideMail,
  lucidePlus,
  lucideQuote,
  lucideStar,
  lucideTruck,
  lucideUsers,
} from '@ng-icons/lucide';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { DashboardSummaryResponse } from '../../../core/models/dashboard.model';
import { DashboardService } from '../../../core/services/dashboard.service';

const EMPTY_SUMMARY: DashboardSummaryResponse = {
  pendingQuotes: 0,
  pendingMessages: 0,
  pendingReviews: 0,
  lowStockMaterials: 0,
  activeProviders: 0,
  totalClients: 0,
  monthlyPurchasesTotal: 0,
  monthlyApprovedQuotesTotal: 0,
  quotesByStatus: { pending: 0, approved: 0, rejected: 0 },
};

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink, NgIcon, CurrencyPipe, HlmButtonImports, HlmCardImports, HlmBadgeImports],
  providers: [
    provideIcons({ lucideBeaker, lucideMail, lucidePlus, lucideQuote, lucideStar, lucideTruck, lucideUsers }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div>
        <h1 class="text-foreground text-xl font-semibold tracking-tight">Resumen</h1>
        <p class="text-muted-foreground text-sm">
          Lo que necesita tu atención hoy, y el pulso del negocio este mes.
        </p>
      </div>

      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <a
          [routerLink]="'/admin/cotizaciones'"
          [queryParams]="{ status: 'Pending' }"
          hlmCard
          class="hover:border-primary/50 transition-colors"
        >
          <div hlmCardContent class="flex items-start justify-between gap-3">
            <div>
              <p class="text-muted-foreground text-sm">Cotizaciones pendientes</p>
              <p class="text-foreground mt-2 text-3xl font-semibold">{{ summary().pendingQuotes }}</p>
              <p class="text-muted-foreground mt-1 text-xs">Esperan aprobar o rechazar</p>
            </div>
            <span class="bg-primary/12 text-primary flex size-10 shrink-0 items-center justify-center rounded-full">
              <ng-icon name="lucideQuote" class="text-lg" />
            </span>
          </div>
        </a>

        <a
          [routerLink]="'/admin/mensajes'"
          [queryParams]="{ status: 'Pending' }"
          hlmCard
          class="hover:border-primary/50 transition-colors"
        >
          <div hlmCardContent class="flex items-start justify-between gap-3">
            <div>
              <p class="text-muted-foreground text-sm">Mensajes sin atender</p>
              <p class="text-foreground mt-2 text-3xl font-semibold">{{ summary().pendingMessages }}</p>
              <p class="text-muted-foreground mt-1 text-xs">Cola de contacto</p>
            </div>
            <span
              class="flex size-10 shrink-0 items-center justify-center rounded-full"
              style="background: color-mix(in oklch, var(--chip-violet) 14%, transparent); color: var(--chip-violet)"
            >
              <ng-icon name="lucideMail" class="text-lg" />
            </span>
          </div>
        </a>

        <a
          [routerLink]="'/admin/resenas'"
          [queryParams]="{ status: 'Pending' }"
          hlmCard
          class="hover:border-primary/50 transition-colors"
        >
          <div hlmCardContent class="flex items-start justify-between gap-3">
            <div>
              <p class="text-muted-foreground text-sm">Reseñas por moderar</p>
              <p class="text-foreground mt-2 text-3xl font-semibold">{{ summary().pendingReviews }}</p>
              <p class="text-muted-foreground mt-1 text-xs">Pendientes de aprobar/rechazar</p>
            </div>
            <span
              class="flex size-10 shrink-0 items-center justify-center rounded-full"
              style="background: color-mix(in oklch, var(--chip-amber) 16%, transparent); color: var(--chip-amber)"
            >
              <ng-icon name="lucideStar" class="text-lg" />
            </span>
          </div>
        </a>

        <a
          [routerLink]="'/admin/materiales'"
          [queryParams]="{ lowStock: 'true' }"
          hlmCard
          class="hover:border-primary/50 transition-colors"
        >
          <div hlmCardContent class="flex items-start justify-between gap-3">
            <div>
              <p class="text-muted-foreground text-sm">Materiales con stock bajo</p>
              <p class="text-foreground mt-2 text-3xl font-semibold">{{ summary().lowStockMaterials }}</p>
              <p class="text-muted-foreground mt-1 text-xs">Por debajo del mínimo</p>
            </div>
            <span class="bg-destructive/12 text-destructive flex size-10 shrink-0 items-center justify-center rounded-full">
              <ng-icon name="lucideBeaker" class="text-lg" />
            </span>
          </div>
        </a>
      </div>

      <div class="grid gap-3 lg:grid-cols-[0.9fr_1.1fr_0.8fr]">
        <div hlmCard>
          <div hlmCardHeader>
            <h2 hlmCardTitle>Cotizaciones por estado</h2>
            <p hlmCardDescription>Histórico completo registrado.</p>
          </div>
          <div hlmCardContent class="flex items-center gap-5">
            @if (totalQuotes() > 0) {
              <div
                class="relative size-28 shrink-0 rounded-full transition-[background] duration-700 ease-out"
                [style.background]="donutGradient()"
              >
                <div class="bg-card absolute inset-2.5 flex flex-col items-center justify-center rounded-full">
                  <span class="text-foreground text-2xl font-semibold tabular-nums">{{ totalQuotes() }}</span>
                  <span class="text-muted-foreground text-[10px] tracking-wide uppercase">total</span>
                </div>
              </div>
              <div class="grid gap-2.5 text-sm">
                <span class="flex items-center gap-2">
                  <span class="bg-primary size-2.5 shrink-0 rounded-full"></span>
                  <span class="text-foreground font-medium">{{ summary().quotesByStatus.pending }}</span>
                  <span class="text-muted-foreground">pendientes</span>
                </span>
                <span class="flex items-center gap-2">
                  <span class="size-2.5 shrink-0 rounded-full" style="background: var(--chip-emerald)"></span>
                  <span class="text-foreground font-medium">{{ summary().quotesByStatus.approved }}</span>
                  <span class="text-muted-foreground">aprobadas</span>
                </span>
                <span class="flex items-center gap-2">
                  <span class="bg-destructive size-2.5 shrink-0 rounded-full"></span>
                  <span class="text-foreground font-medium">{{ summary().quotesByStatus.rejected }}</span>
                  <span class="text-muted-foreground">rechazadas</span>
                </span>
              </div>
            } @else {
              <p class="text-muted-foreground text-sm">Aún no hay cotizaciones registradas.</p>
            }
          </div>
        </div>

        <div hlmCard>
          <div hlmCardHeader>
            <h2 hlmCardTitle>Pulso del negocio</h2>
            <p hlmCardDescription>Mes en curso.</p>
          </div>
          <div hlmCardContent class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-muted-foreground text-xs">Proveedores activos</p>
              <p class="text-foreground mt-1 text-xl font-semibold tabular-nums">{{ summary().activeProviders }}</p>
            </div>
            <div>
              <p class="text-muted-foreground text-xs">Clientes registrados</p>
              <p class="text-foreground mt-1 text-xl font-semibold tabular-nums">{{ summary().totalClients }}</p>
            </div>
            <div>
              <p class="text-muted-foreground text-xs">Compras del mes</p>
              <p class="text-foreground mt-1 text-xl font-semibold tabular-nums">
                {{ summary().monthlyPurchasesTotal | currency: 'USD' }}
              </p>
            </div>
            <div>
              <p class="text-muted-foreground text-xs">Cotizaciones aprobadas</p>
              <p class="text-foreground mt-1 text-xl font-semibold tabular-nums">
                {{ summary().monthlyApprovedQuotesTotal | currency: 'USD' }}
              </p>
            </div>
          </div>
        </div>

        <div hlmCard>
          <div hlmCardHeader>
            <h2 hlmCardTitle>Accesos rápidos</h2>
          </div>
          <div hlmCardContent class="grid gap-2">
            <a hlmBtn variant="outline" class="justify-start" routerLink="/admin/proveedores">
              <ng-icon name="lucidePlus" class="mr-2" />
              Nuevo proveedor
            </a>
            <a hlmBtn variant="outline" class="justify-start" routerLink="/admin/compras">
              <ng-icon name="lucidePlus" class="mr-2" />
              Nueva compra
            </a>
            <a hlmBtn variant="outline" class="justify-start" routerLink="/admin/materiales">
              <ng-icon name="lucidePlus" class="mr-2" />
              Nuevo material
            </a>
            <a hlmBtn variant="outline" class="justify-start" routerLink="/admin/usuarios">
              <ng-icon name="lucideUsers" class="mr-2" />
              Gestionar usuarios
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class AdminDashboard {
  private readonly dashboardService = inject(DashboardService);

  protected readonly summary = toSignal(this.dashboardService.getSummary(), { initialValue: EMPTY_SUMMARY });

  protected readonly totalQuotes = computed(() => {
    const s = this.summary().quotesByStatus;
    return s.pending + s.approved + s.rejected;
  });

  // Donut chart vía conic-gradient puro (sin librería) — más llamativo que la barra plana
  // anterior y sigue transicionando suave (background-transition) cuando cambian los datos.
  protected readonly donutGradient = computed(() => {
    const { pending, approved, rejected } = this.summary().quotesByStatus;
    const total = pending + approved + rejected;
    if (total === 0) return 'var(--muted)';

    const pendingEnd = (pending / total) * 100;
    const approvedEnd = pendingEnd + (approved / total) * 100;

    return (
      `conic-gradient(var(--primary) 0% ${pendingEnd}%, ` +
      `var(--quote-approved) ${pendingEnd}% ${approvedEnd}%, ` +
      `var(--destructive) ${approvedEnd}% 100%)`
    );
  });

  protected pct(count: number): number {
    const total = this.totalQuotes();
    return total === 0 ? 0 : (count / total) * 100;
  }
}
