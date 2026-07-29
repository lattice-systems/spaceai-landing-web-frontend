import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCheck,
  lucideCopy,
  lucideEllipsis,
  lucideMail,
  lucideSearch,
} from '@ng-icons/lucide';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmDialogImports, HlmDialog } from '@spartan-ng/helm/dialog';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmNativeSelectImports } from '@spartan-ng/helm/native-select';
import { HlmPaginationImports } from '@spartan-ng/helm/pagination';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { ContactMessageResponse } from '../../../core/models/contact-message.model';
import { PagedResult } from '../../../core/models/paged-result.model';
import { ContactMessagesService } from '../../../core/services/contact-messages.service';
import { StatusChip } from '../../../shared/status-chip/status-chip';
import { toast } from '@spartan-ng/brain/sonner';
import { TableSkeleton } from '../../../shared/table-skeleton/table-skeleton';

type StatusFilter = 'all' | 'Pending' | 'Answered' | 'Archived';

@Component({
  selector: 'app-admin-messages',
  imports: [
    NgIcon,
    DatePipe,
    HlmButtonImports,
    HlmCardImports,
    HlmInputImports,
    HlmNativeSelectImports,
    HlmTableImports,
    HlmBadgeImports,
    HlmCheckboxImports,
    HlmDropdownMenuImports,
    HlmDialogImports,
    HlmPaginationImports,
    StatusChip,
    TableSkeleton,
  ],
  providers: [
    provideIcons({ lucideCheck, lucideCopy, lucideEllipsis, lucideMail, lucideSearch }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="flex flex-1 flex-col gap-3 p-4 pt-0">
      <div class="flex items-center gap-3">
        <span class="bg-primary/12 text-primary flex size-10 shrink-0 items-center justify-center rounded-full">
          <ng-icon name="lucideMail" class="text-lg" />
        </span>
        <div>
          <h1 class="text-foreground text-xl font-semibold tracking-tight">Mensajes</h1>
          <p class="text-muted-foreground text-sm">
            Lo que llega desde el formulario de contacto del sitio. Los pendientes son los que faltan por responder.
          </p>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <div class="relative min-w-56 flex-1">
          <ng-icon
            name="lucideSearch"
            class="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-base"
          />
          <input
            hlmInput
            class="pl-9"
            placeholder="Buscar por nombre, correo, institución o texto…"
            [value]="search()"
            (input)="onSearchInput($event)"
          />
        </div>

        <hlm-native-select class="w-40" [value]="statusFilter()" (valueChange)="onStatusFilterChange($event)">
          <option value="all" hlmNativeSelectOption>Todos los estados</option>
          <option value="Pending" hlmNativeSelectOption>Pendientes</option>
          <option value="Answered" hlmNativeSelectOption>Atendidos</option>
          <option value="Archived" hlmNativeSelectOption>Archivados</option>
        </hlm-native-select>
      </div>


      @if (selectedIds().size > 0) {
        <div class="bg-muted/50 border-border flex items-center gap-3 rounded-lg border p-3">
          <p class="text-sm font-medium">{{ selectedIds().size }} seleccionados</p>
          <button hlmBtn size="sm" (click)="bulkSetStatus('Answered')">Marcar atendidos</button>
          <button hlmBtn variant="outline" size="sm" (click)="bulkSetStatus('Archived')">Archivar</button>
        </div>
      }

      <div hlmCard class="gap-0 overflow-hidden rounded-xl py-0">
        <div hlmTableContainer>
          <table hlmTable>
            <thead hlmTHead>
              <tr hlmTr class="bg-muted/40 hover:bg-muted/40">
                <th hlmTh class="w-10">
                  <hlm-checkbox [checked]="allSelected()" (checkedChange)="toggleSelectAll($event)" />
                </th>
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Remitente</th>
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Institución</th>
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Mensaje</th>
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Estado</th>
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Fecha</th>
                <th hlmTh class="w-10 text-right">
                  <span class="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody hlmTBody>
              @if (loading()) {
                <tr hlmTr>
                  <td hlmTd colspan="7"><app-table-skeleton [cols]="7" /></td>
                </tr>
              } @else {
              @for (msg of page().data; track msg.id) {
                <tr hlmTr [attr.data-state]="selectedIds().has(msg.id) ? 'selected' : null">
                  <td hlmTd>
                    <hlm-checkbox [checked]="selectedIds().has(msg.id)" (checkedChange)="toggleSelect(msg.id)" />
                  </td>
                  <td hlmTd>
                    <div class="flex flex-col">
                      <span class="text-foreground font-medium leading-tight">{{ msg.name }}</span>
                      <span class="text-muted-foreground text-xs leading-tight">{{ msg.email }}</span>
                    </div>
                  </td>
                  <td hlmTd>
                    <div class="flex flex-col text-xs leading-tight">
                      <span class="text-foreground">{{ msg.institutionName || 'Sin institución' }}</span>
                      <span class="text-muted-foreground">{{ msg.jobTitle || 'Sin cargo' }}</span>
                    </div>
                  </td>
                  <td hlmTd>
                    <button
                      type="button"
                      class="text-muted-foreground hover:text-foreground max-w-sm cursor-pointer truncate text-left text-sm"
                      (click)="openDetail(msg)"
                    >
                      {{ msg.message }}
                    </button>
                  </td>
                  <td hlmTd>
                    <app-status-chip [label]="statusLabel(msg.status)" [chip]="statusChip(msg.status)" />
                  </td>
                  <td hlmTd class="text-muted-foreground whitespace-nowrap">{{ msg.createdAt | date: 'mediumDate' }}</td>
                  <td hlmTd class="text-right">
                    <div class="flex items-center justify-end gap-1">
                      @if (msg.status !== 'Answered') {
                        <button
                          hlmBtn
                          variant="ghost"
                          size="icon"
                          aria-label="Marcar atendido"
                          title="Marcar atendido"
                          (click)="markAnswered(msg)"
                        >
                          <ng-icon name="lucideCheck" />
                        </button>
                      }
                      <button
                        hlmBtn
                        variant="ghost"
                        size="icon"
                        [hlmDropdownMenuTrigger]="rowMenu"
                        align="end"
                        aria-label="Acciones"
                      >
                        <ng-icon name="lucideEllipsis" />
                      </button>
                    </div>
                    <ng-template #rowMenu>
                      <hlm-dropdown-menu class="min-w-48 rounded-lg">
                        <button hlmDropdownMenuItem (click)="openDetail(msg)">Ver mensaje</button>
                        <button hlmDropdownMenuItem (click)="copyEmail(msg)">Copiar correo</button>
                        <hlm-dropdown-menu-separator />
                        @if (msg.status !== 'Answered') {
                          <button hlmDropdownMenuItem (click)="markAnswered(msg)">Marcar atendido</button>
                        }
                        @if (msg.status !== 'Archived') {
                          <button hlmDropdownMenuItem (click)="archive(msg)">Archivar</button>
                        }
                      </hlm-dropdown-menu>
                    </ng-template>
                  </td>
                </tr>
              } @empty {
                <tr hlmTr>
                  <td hlmTd colspan="7" class="text-muted-foreground text-center">
                    Sin mensajes que coincidan con la búsqueda.
                  </td>
                </tr>
              }
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

    <!-- Detalle del mensaje -->
    <hlm-dialog #detailDialogRef="hlmDialog">
      <hlm-dialog-content *hlmDialogPortal class="w-full sm:max-w-xl">
        <hlm-dialog-header>
          <h3 hlmDialogTitle>{{ selectedMessage()?.name }}</h3>
          <p hlmDialogDescription>
            {{ selectedMessage()?.email }}
            @if (selectedMessage()?.institutionName) { · {{ selectedMessage()?.institutionName }} }
            @if (selectedMessage()?.jobTitle) { · {{ selectedMessage()?.jobTitle }} }
          </p>
        </hlm-dialog-header>
        <div class="grid gap-4 py-2">
          <div class="flex items-center gap-2">
            <app-status-chip
              [label]="statusLabel(selectedMessage()?.status ?? '')"
              [chip]="statusChip(selectedMessage()?.status ?? '')"
            />
            <span class="text-muted-foreground text-xs">{{ selectedMessage()?.createdAt | date: 'medium' }}</span>
          </div>
          <p class="text-foreground border-border bg-muted/30 rounded-lg border p-3 text-sm leading-6 whitespace-pre-line">
            {{ selectedMessage()?.message }}
          </p>
        </div>
        <hlm-dialog-footer class="border-border mt-2 border-t pt-4">
          <button hlmBtn type="button" variant="outline" (click)="copyEmail(selectedMessage()!)">
            <ng-icon name="lucideCopy" class="mr-1" />
            {{ copiedEmail() === selectedMessage()?.email ? 'Copiado' : 'Copiar correo' }}
          </button>
          <button hlmBtn type="button" variant="outline" hlmDialogClose>Cerrar</button>
          @if (selectedMessage()?.status !== 'Answered') {
            <button hlmBtn type="button" (click)="markAnsweredFromDetail()">Marcar atendido</button>
          }
          @if (selectedMessage()?.status !== 'Archived') {
            <button hlmBtn type="button" variant="outline" (click)="archiveFromDetail()">Archivar</button>
          }
        </hlm-dialog-footer>
      </hlm-dialog-content>
    </hlm-dialog>
  `,
})
export class AdminMessages {
  private readonly contactMessagesService = inject(ContactMessagesService);

  @ViewChild('detailDialogRef') private detailDialogRef!: HlmDialog;

  protected readonly search = signal('');
  protected readonly statusFilter = signal<StatusFilter>('all');
  protected readonly pageNumber = signal(1);
  protected readonly pageSize = signal(10);
  protected readonly page = signal<PagedResult<ContactMessageResponse>>({
    totalRecords: 0,
    pageNumber: 1,
    pageSize: 10,
    data: [],
  });
  protected readonly selectedIds = signal<Set<string>>(new Set());
  protected readonly selectedMessage = signal<ContactMessageResponse | null>(null);
  protected readonly copiedEmail = signal<string | null>(null);
  protected readonly loading = signal(true);

  protected readonly allSelected = computed(() => {
    const data = this.page().data;
    return data.length > 0 && data.every((m) => this.selectedIds().has(m.id));
  });

  private searchTimeout?: ReturnType<typeof setTimeout>;

  constructor() {
    // Deep-link desde el dashboard (?status=Pending): fija el filtro inicial antes de que
    // corra el efecto de recarga, así el KPI aterriza ya filtrado.
    const initialStatus = inject(ActivatedRoute).snapshot.queryParamMap.get('status');
    if (initialStatus === 'Pending' || initialStatus === 'Answered' || initialStatus === 'Archived') {
      this.statusFilter.set(initialStatus);
    }

    // Efecto central: cualquier cambio de búsqueda/filtro/página dispara una sola recarga.
    effect(() => {
      this.search();
      this.statusFilter();
      this.pageNumber();
      this.pageSize();
      this.reload();
    });
  }

  protected statusLabel(status: string): string {
    if (status === 'Answered') return 'Atendido';
    if (status === 'Archived') return 'Archivado';
    return 'Pendiente';
  }

  protected statusChip(status: string): string | null {
    if (status === 'Answered') return '--chip-emerald';
    if (status === 'Pending') return '--chip-amber';
    return null;
  }

  protected copyEmail(message: ContactMessageResponse): void {
    navigator.clipboard?.writeText(message.email).then(() => {
      this.copiedEmail.set(message.email);
      setTimeout(() => this.copiedEmail.set(null), 1500);
    });
  }

  protected onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.search.set(value);
      this.pageNumber.set(1);
    }, 300);
  }

  protected onStatusFilterChange(value: string | null | undefined): void {
    this.statusFilter.set((value ?? 'all') as StatusFilter);
    this.pageNumber.set(1);
  }

  protected toggleSelect(id: string): void {
    const next = new Set(this.selectedIds());
    next.has(id) ? next.delete(id) : next.add(id);
    this.selectedIds.set(next);
  }

  protected toggleSelectAll(checked: boolean): void {
    if (!checked) {
      this.selectedIds.set(new Set());
      return;
    }
    this.selectedIds.set(new Set(this.page().data.map((m) => m.id)));
  }

  protected openDetail(message: ContactMessageResponse): void {
    this.selectedMessage.set(message);
    this.detailDialogRef.open();
  }

  protected markAnswered(message: ContactMessageResponse): void {
    this.setStatusOne(this.contactMessagesService.markAnswered(message.id));
  }

  protected archive(message: ContactMessageResponse): void {
    this.setStatusOne(this.contactMessagesService.archive(message.id));
  }

  protected markAnsweredFromDetail(): void {
    const message = this.selectedMessage();
    if (!message) return;
    this.detailDialogRef.close();
    this.markAnswered(message);
  }

  protected archiveFromDetail(): void {
    const message = this.selectedMessage();
    if (!message) return;
    this.detailDialogRef.close();
    this.archive(message);
  }

  protected bulkSetStatus(status: 'Answered' | 'Archived'): void {
    this.contactMessagesService.bulkSetStatus(Array.from(this.selectedIds()), status).subscribe((result) => {
      this.selectedIds.set(new Set());
      this.reportBulkResult(result.affected, result.skipped);
      this.reload();
    });
  }

  private setStatusOne(call: ReturnType<ContactMessagesService['markAnswered']>): void {
    call.subscribe({
      next: () => this.reload(),
      error: (err: HttpErrorResponse) =>
        toast.error(this.extractError(err, 'No se pudo actualizar el mensaje.')),
    });
  }

  private reportBulkResult(affected: number, skipped: string[]): void {
    if (skipped.length > 0) {
      toast.error(`${affected} aplicados. Omitidos: ${skipped.join(' ')}`);
    } else {
      toast.success(`${affected} aplicados.`);
    }
  }

  private extractError(err: HttpErrorResponse, fallback: string): string {
    const errors = err.error?.errors as string[] | undefined;
    if (errors?.length) return errors.join(' ');
    return err.error?.message || fallback;
  }

  private reload(): void {
    this.loading.set(true);
    this.contactMessagesService
      .list({
        pageNumber: this.pageNumber(),
        pageSize: this.pageSize(),
        search: this.search() || undefined,
        status: this.statusFilter() === 'all' ? undefined : this.statusFilter(),
      })
      .subscribe((result) => {
        this.page.set(result);
        this.loading.set(false);
      });
  }
}
