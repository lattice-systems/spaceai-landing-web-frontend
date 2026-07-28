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
            <ng-icon name="lucideQuote" class="text-muted-foreground text-xl" />
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
            <ng-icon name="lucideMail" class="text-muted-foreground text-xl" />
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
            <ng-icon name="lucideStar" class="text-muted-foreground text-xl" />
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
            <ng-icon name="lucideBeaker" class="text-muted-foreground text-xl" />
          </div>
        </a>
      </div>

      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div hlmCard>
          <div hlmCardContent>
            <p class="text-muted-foreground text-sm">Proveedores activos</p>
            <p class="text-foreground mt-2 text-2xl font-semibold">{{ summary().activeProviders }}</p>
          </div>
        </div>
        <div hlmCard>
          <div hlmCardContent>
            <p class="text-muted-foreground text-sm">Clientes registrados</p>
            <p class="text-foreground mt-2 text-2xl font-semibold">{{ summary().totalClients }}</p>
          </div>
        </div>
        <div hlmCard>
          <div hlmCardContent>
            <p class="text-muted-foreground text-sm">Compras del mes</p>
            <p class="text-foreground mt-2 text-2xl font-semibold">
              {{ summary().monthlyPurchasesTotal | currency: 'USD' }}
            </p>
          </div>
        </div>
        <div hlmCard>
          <div hlmCardContent>
            <p class="text-muted-foreground text-sm">Cotizaciones aprobadas (mes)</p>
            <p class="text-foreground mt-2 text-2xl font-semibold">
              {{ summary().monthlyApprovedQuotesTotal | currency: 'USD' }}
            </p>
          </div>
        </div>
      </div>

      <div class="grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
        <div hlmCard>
          <div hlmCardHeader>
            <h2 hlmCardTitle>Cotizaciones por estado</h2>
            <p hlmCardDescription>Desglose de todo el histórico registrado.</p>
          </div>
          <div hlmCardContent class="grid gap-4">
            @if (totalQuotes() > 0) {
              <div class="bg-muted flex h-3 overflow-hidden rounded-full">
                <div class="bg-primary h-full" [style.width.%]="pct(summary().quotesByStatus.pending)"></div>
                <div class="bg-foreground h-full" [style.width.%]="pct(summary().quotesByStatus.approved)"></div>
                <div class="bg-destructive h-full" [style.width.%]="pct(summary().quotesByStatus.rejected)"></div>
              </div>
              <div class="flex flex-wrap gap-4 text-sm">
                <span class="flex items-center gap-2">
                  <span class="bg-primary size-2.5 rounded-full"></span>
                  Pendientes · {{ summary().quotesByStatus.pending }}
                </span>
                <span class="flex items-center gap-2">
                  <span class="bg-foreground size-2.5 rounded-full"></span>
                  Aprobadas · {{ summary().quotesByStatus.approved }}
                </span>
                <span class="flex items-center gap-2">
                  <span class="bg-destructive size-2.5 rounded-full"></span>
                  Rechazadas · {{ summary().quotesByStatus.rejected }}
                </span>
              </div>
            } @else {
              <p class="text-muted-foreground text-sm">Aún no hay cotizaciones registradas.</p>
            }
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
            <a hlmBtn variant="outline" class="justify-start" routerLink="/admin/proveedores">
              <ng-icon name="lucideTruck" class="mr-2" />
              Ver proveedores
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

  protected pct(count: number): number {
    const total = this.totalQuotes();
    return total === 0 ? 0 : (count / total) * 100;
  }
}
