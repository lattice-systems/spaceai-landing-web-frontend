import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, signal, ViewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideHistory } from '@ng-icons/lucide';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmDialogImports, HlmDialog } from '@spartan-ng/helm/dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmNativeSelectImports } from '@spartan-ng/helm/native-select';
import { HlmPaginationImports } from '@spartan-ng/helm/pagination';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { AuditLogResponse } from '../../../core/models/audit-log.model';
import { PagedResult } from '../../../core/models/paged-result.model';
import { AuditLogsService } from '../../../core/services/audit-logs.service';

const ENTITY_NAMES = [
  'User', 'Product', 'ProductModule', 'Material', 'ProductRecipe', 'Provider', 'Purchase',
  'Quote', 'Review', 'ContactMessage', 'SupportTicket', 'Document', 'Sale', 'BusinessSetting',
] as const;

@Component({
  selector: 'app-admin-audit-log',
  imports: [
    NgIcon,
    DatePipe,
    HlmCardImports,
    HlmButtonImports,
    HlmNativeSelectImports,
    HlmTableImports,
    HlmBadgeImports,
    HlmPaginationImports,
    HlmDialogImports,
  ],
  providers: [provideIcons({ lucideHistory })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="flex flex-1 flex-col gap-3 p-4 pt-0">
      <div class="flex items-center gap-3">
        <span
          class="flex size-10 shrink-0 items-center justify-center rounded-full"
          style="background: color-mix(in oklch, var(--chip-violet) 14%, transparent); color: var(--chip-violet)"
        >
          <ng-icon name="lucideHistory" class="text-lg" />
        </span>
        <div>
          <h1 class="text-foreground text-xl font-semibold tracking-tight">Auditoría</h1>
          <p class="text-muted-foreground text-sm">Quién creó, editó o eliminó cada registro del sistema.</p>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <hlm-native-select class="w-52" [value]="entityFilter()" (valueChange)="onEntityFilterChange($event)">
          <option value="" hlmNativeSelectOption>Todas las entidades</option>
          @for (name of entityNames; track name) {
            <option [value]="name" hlmNativeSelectOption>{{ name }}</option>
          }
        </hlm-native-select>

        <hlm-native-select class="w-40" [value]="actionFilter()" (valueChange)="onActionFilterChange($event)">
          <option value="" hlmNativeSelectOption>Todas las acciones</option>
          <option value="Created" hlmNativeSelectOption>Creado</option>
          <option value="Updated" hlmNativeSelectOption>Editado</option>
          <option value="Deleted" hlmNativeSelectOption>Eliminado</option>
        </hlm-native-select>
      </div>

      <div hlmCard class="gap-0 overflow-hidden rounded-xl py-0">
        <div hlmTableContainer>
          <table hlmTable>
            <thead hlmTHead>
              <tr hlmTr class="bg-muted/40 hover:bg-muted/40">
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Fecha</th>
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Quién</th>
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Acción</th>
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Entidad</th>
                <th hlmTh class="w-10 text-right"><span class="sr-only">Detalle</span></th>
              </tr>
            </thead>
            <tbody hlmTBody>
              @for (log of page().data; track log.id) {
                <tr hlmTr>
                  <td hlmTd class="text-muted-foreground whitespace-nowrap">{{ log.timestamp | date: 'medium' }}</td>
                  <td hlmTd>{{ log.performedByEmail ?? 'Sistema' }}</td>
                  <td hlmTd>
                    <span hlmBadge [variant]="actionVariant(log.action)" class="font-normal">{{ actionLabel(log.action) }}</span>
                  </td>
                  <td hlmTd class="text-muted-foreground">{{ log.entityName }} · {{ log.entityId.slice(0, 8) }}</td>
                  <td hlmTd class="text-right">
                    @if (log.changesJson) {
                      <button hlmBtn variant="ghost" size="sm" (click)="openDetail(log)">Ver</button>
                    }
                  </td>
                </tr>
              } @empty {
                <tr hlmTr>
                  <td hlmTd colspan="5" class="text-muted-foreground text-center">Sin actividad registrada.</td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <hlm-numbered-pagination
          class="border-border border-t"
          [(currentPage)]="pageNumber"
          [(itemsPerPage)]="pageSize"
          [totalItems]="page().totalRecords"
        />
      </div>
    </section>

    <!-- Detalle de cambios -->
    <hlm-dialog #detailDialogRef="hlmDialog">
      <hlm-dialog-content *hlmDialogPortal class="w-full sm:max-w-lg">
        <hlm-dialog-header>
          <h3 hlmDialogTitle>{{ selectedLog()?.entityName }} · {{ actionLabel(selectedLog()?.action ?? '') }}</h3>
          <p hlmDialogDescription>{{ selectedLog()?.performedByEmail ?? 'Sistema' }} — {{ selectedLog()?.timestamp | date: 'medium' }}</p>
        </hlm-dialog-header>
        <pre class="border-border bg-muted/30 max-h-96 overflow-auto rounded-lg border p-3 text-xs leading-5">{{ formattedChanges() }}</pre>
        <hlm-dialog-footer class="border-border mt-2 border-t pt-4">
          <button hlmBtn type="button" variant="outline" hlmDialogClose>Cerrar</button>
        </hlm-dialog-footer>
      </hlm-dialog-content>
    </hlm-dialog>
  `,
})
export class AdminAuditLog {
  private readonly auditLogsService = inject(AuditLogsService);

  @ViewChild('detailDialogRef') private detailDialogRef!: HlmDialog;

  protected readonly entityNames = ENTITY_NAMES;

  protected readonly entityFilter = signal('');
  protected readonly actionFilter = signal('');
  protected readonly pageNumber = signal(1);
  protected readonly pageSize = signal(20);
  protected readonly page = signal<PagedResult<AuditLogResponse>>({
    totalRecords: 0,
    pageNumber: 1,
    pageSize: 20,
    data: [],
  });
  protected readonly selectedLog = signal<AuditLogResponse | null>(null);

  protected readonly formattedChanges = () => {
    const raw = this.selectedLog()?.changesJson;
    if (!raw) return '';
    try {
      return JSON.stringify(JSON.parse(raw), null, 2);
    } catch {
      return raw;
    }
  };

  constructor() {
    effect(() => {
      this.entityFilter();
      this.actionFilter();
      this.pageNumber();
      this.pageSize();
      this.reload();
    });
  }

  protected actionLabel(action: string): string {
    if (action === 'Created') return 'Creado';
    if (action === 'Deleted') return 'Eliminado';
    return 'Editado';
  }

  protected actionVariant(action: string): 'default' | 'secondary' | 'outline' | 'destructive' {
    if (action === 'Created') return 'default';
    if (action === 'Deleted') return 'destructive';
    return 'secondary';
  }

  protected onEntityFilterChange(value: string | null | undefined): void {
    this.entityFilter.set(value ?? '');
    this.pageNumber.set(1);
  }

  protected onActionFilterChange(value: string | null | undefined): void {
    this.actionFilter.set(value ?? '');
    this.pageNumber.set(1);
  }

  protected openDetail(log: AuditLogResponse): void {
    this.selectedLog.set(log);
    this.detailDialogRef.open();
  }

  private reload(): void {
    this.auditLogsService
      .list({
        pageNumber: this.pageNumber(),
        pageSize: this.pageSize(),
        entityName: this.entityFilter() || undefined,
        action: this.actionFilter() || undefined,
      })
      .subscribe((result) => this.page.set(result));
  }
}
