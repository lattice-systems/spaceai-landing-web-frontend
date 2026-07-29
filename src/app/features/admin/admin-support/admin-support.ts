import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, effect, inject, signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLifeBuoy, lucideSearch, lucideSend } from '@ng-icons/lucide';
import { toast } from '@spartan-ng/brain/sonner';
import { TableSkeleton } from '../../../shared/table-skeleton/table-skeleton';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmDialogImports, HlmDialog } from '@spartan-ng/helm/dialog';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmNativeSelectImports } from '@spartan-ng/helm/native-select';
import { HlmPaginationImports } from '@spartan-ng/helm/pagination';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { PagedResult } from '../../../core/models/paged-result.model';
import { SupportTicketMessageResponse, SupportTicketResponse } from '../../../core/models/support-ticket.model';
import { SupportTicketsService } from '../../../core/services/support-tickets.service';
import { StatusChip } from '../../../shared/status-chip/status-chip';

type StatusFilter = 'all' | 'Open' | 'InProgress' | 'Closed';

@Component({
  selector: 'app-admin-support',
  imports: [
    ReactiveFormsModule,
    NgIcon,
    DatePipe,
    HlmButtonImports,
    HlmCardImports,
    HlmInputImports,
    HlmNativeSelectImports,
    HlmTableImports,
    HlmBadgeImports,
    HlmDialogImports,
    HlmPaginationImports,
    StatusChip,
    TableSkeleton,
  ],
  providers: [provideIcons({ lucideLifeBuoy, lucideSearch, lucideSend })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="flex flex-1 flex-col gap-3 p-4 pt-0">
      <div class="flex items-center gap-3">
        <span
          class="flex size-10 shrink-0 items-center justify-center rounded-full"
          style="background: color-mix(in oklch, var(--chip-sky) 16%, transparent); color: var(--chip-sky)"
        >
          <ng-icon name="lucideLifeBuoy" class="text-lg" />
        </span>
        <div>
          <h1 class="text-foreground text-xl font-semibold tracking-tight">Soporte</h1>
          <p class="text-muted-foreground text-sm">Tickets abiertos por los clientes en su portal.</p>
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
            placeholder="Buscar por asunto o descripción…"
            [value]="search()"
            (input)="onSearchInput($event)"
          />
        </div>

        <hlm-native-select class="w-40" [value]="statusFilter()" (valueChange)="onStatusFilterChange($event)">
          <option value="all" hlmNativeSelectOption>Todos los estados</option>
          <option value="Open" hlmNativeSelectOption>Abiertos</option>
          <option value="InProgress" hlmNativeSelectOption>En progreso</option>
          <option value="Closed" hlmNativeSelectOption>Cerrados</option>
        </hlm-native-select>
      </div>

      <div hlmCard class="gap-0 overflow-hidden rounded-xl py-0">
        <div hlmTableContainer>
          <table hlmTable>
            <thead hlmTHead>
              <tr hlmTr class="bg-muted/40 hover:bg-muted/40">
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Institución</th>
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Asunto</th>
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Prioridad</th>
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Estado</th>
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Fecha</th>
                <th hlmTh class="w-10"><span class="sr-only">Ver</span></th>
              </tr>
            </thead>
            <tbody hlmTBody>
              @if (loading()) {
                <tr hlmTr>
                  <td hlmTd colspan="6"><app-table-skeleton [cols]="6" /></td>
                </tr>
              } @else {
              @for (ticket of page().data; track ticket.id) {
                <tr hlmTr>
                  <td hlmTd class="text-foreground font-medium">{{ ticket.institutionName }}</td>
                  <td hlmTd>
                    <button
                      type="button"
                      class="text-foreground hover:text-primary max-w-sm cursor-pointer truncate text-left"
                      (click)="openDetail(ticket)"
                    >
                      {{ ticket.subject }}
                    </button>
                  </td>
                  <td hlmTd>
                    <span hlmBadge variant="outline" class="font-normal">{{ priorityLabel(ticket.priority) }}</span>
                  </td>
                  <td hlmTd>
                    <app-status-chip [label]="statusLabel(ticket.status)" [chip]="statusChip(ticket.status)" />
                  </td>
                  <td hlmTd class="text-muted-foreground whitespace-nowrap">{{ ticket.createdAt | date: 'mediumDate' }}</td>
                  <td hlmTd class="text-right">
                    <button hlmBtn variant="ghost" size="sm" (click)="openDetail(ticket)">Ver</button>
                  </td>
                </tr>
              } @empty {
                <tr hlmTr>
                  <td hlmTd colspan="6" class="text-muted-foreground text-center">
                    Sin tickets que coincidan con la búsqueda.
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

    <!-- Detalle -->
    <hlm-dialog #detailDialogRef="hlmDialog">
      <hlm-dialog-content *hlmDialogPortal class="w-full sm:max-w-lg">
        <hlm-dialog-header>
          <h3 hlmDialogTitle>{{ selectedTicket()?.subject }}</h3>
          <p hlmDialogDescription>
            {{ selectedTicket()?.institutionName }} · {{ selectedTicket()?.createdAt | date: 'medium' }}
          </p>
        </hlm-dialog-header>
        <div class="grid gap-3 py-2">
          <div class="flex flex-wrap items-center gap-2">
            <app-status-chip
              [label]="statusLabel(selectedTicket()?.status ?? '')"
              [chip]="statusChip(selectedTicket()?.status ?? '')"
            />
            <span hlmBadge variant="outline" class="font-normal">{{ priorityLabel(selectedTicket()?.priority ?? '') }}</span>

            <hlm-native-select
              class="ml-auto w-40"
              [value]="selectedTicket()?.status"
              (valueChange)="changeStatus($event)"
            >
              <option value="Open" hlmNativeSelectOption>Abierto</option>
              <option value="InProgress" hlmNativeSelectOption>En progreso</option>
              <option value="Closed" hlmNativeSelectOption>Cerrado</option>
            </hlm-native-select>
          </div>

          <p class="text-foreground border-border bg-muted/30 rounded-lg border p-3 text-sm leading-6 whitespace-pre-line">
            {{ selectedTicket()?.description }}
          </p>

          <div class="flex flex-col gap-2">
            <p class="text-muted-foreground text-xs font-medium uppercase tracking-wide">Seguimiento</p>
            <div class="flex max-h-56 flex-col gap-2 overflow-y-auto">
              @for (message of messages(); track message.id) {
                <div
                  class="rounded-lg border p-2.5 text-sm"
                  [class]="message.senderRole === 'Admin'
                    ? 'border-primary/20 bg-primary/5'
                    : 'border-border bg-muted/40'"
                >
                  <p class="text-foreground/90 whitespace-pre-line">{{ message.body }}</p>
                  <p class="text-muted-foreground mt-1 text-xs">
                    {{ message.senderRole === 'Admin' ? 'Tú (Soporte)' : 'Cliente' }} ·
                    {{ message.createdAt | date: 'short' }}
                  </p>
                </div>
              } @empty {
                <p class="text-muted-foreground text-xs">Sin mensajes todavía.</p>
              }
            </div>
            <form class="flex gap-2" (ngSubmit)="submitMessage()">
              <input
                hlmInput
                class="flex-1"
                placeholder="Responder al cliente…"
                [formControl]="messageControl"
              />
              <button hlmBtn type="submit" size="icon" [disabled]="sendingMessage() || !messageControl.value?.trim()">
                <ng-icon name="lucideSend" />
              </button>
            </form>
            @if (messageError()) {
              <p class="text-destructive text-xs">{{ messageError() }}</p>
            }
          </div>
        </div>
        <hlm-dialog-footer class="border-border mt-2 border-t pt-4">
          <button hlmBtn type="button" variant="outline" hlmDialogClose>Cerrar</button>
        </hlm-dialog-footer>
      </hlm-dialog-content>
    </hlm-dialog>
  `,
})
export class AdminSupport {
  private readonly supportTicketsService = inject(SupportTicketsService);

  @ViewChild('detailDialogRef') private detailDialogRef!: HlmDialog;

  protected readonly search = signal('');
  protected readonly statusFilter = signal<StatusFilter>('all');
  protected readonly pageNumber = signal(1);
  protected readonly pageSize = signal(10);
  protected readonly page = signal<PagedResult<SupportTicketResponse>>({
    totalRecords: 0,
    pageNumber: 1,
    pageSize: 10,
    data: [],
  });
  protected readonly selectedTicket = signal<SupportTicketResponse | null>(null);
  protected readonly messages = signal<SupportTicketMessageResponse[]>([]);
  protected readonly sendingMessage = signal(false);
  protected readonly messageError = signal<string | null>(null);
  protected readonly loading = signal(true);
  protected readonly messageControl = new FormControl('', { nonNullable: true });

  private searchTimeout?: ReturnType<typeof setTimeout>;

  constructor() {
    // Deep-link desde el dashboard (?status=Pending no aplica aquí; Soporte usa Open) —
    // mismo patrón de los otros módulos por si se enlaza en el futuro.
    const initialStatus = inject(ActivatedRoute).snapshot.queryParamMap.get('status');
    if (initialStatus === 'Open' || initialStatus === 'InProgress' || initialStatus === 'Closed') {
      this.statusFilter.set(initialStatus);
    }

    effect(() => {
      this.search();
      this.statusFilter();
      this.pageNumber();
      this.pageSize();
      this.reload();
    });
  }

  protected statusLabel(status: string): string {
    if (status === 'InProgress') return 'En progreso';
    if (status === 'Closed') return 'Cerrado';
    return 'Abierto';
  }

  protected statusChip(status: string): string | null {
    if (status === 'InProgress') return '--chip-amber';
    if (status === 'Open') return '--chip-sky';
    return null;
  }

  protected priorityLabel(priority: string): string {
    if (priority === 'Low') return 'Prioridad baja';
    if (priority === 'High') return 'Prioridad alta';
    return 'Prioridad media';
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

  protected openDetail(ticket: SupportTicketResponse): void {
    this.selectedTicket.set(ticket);
    this.messages.set([]);
    this.messageError.set(null);
    this.messageControl.reset('');
    this.detailDialogRef.open();
    this.supportTicketsService.getMessages(ticket.id).subscribe({
      next: (data) => this.messages.set(data),
      error: () => this.messageError.set('No se pudo cargar el seguimiento.'),
    });
  }

  protected changeStatus(value: string | null | undefined): void {
    const ticket = this.selectedTicket();
    if (!ticket || !value || value === ticket.status) return;

    this.supportTicketsService.updateStatus(ticket.id, value).subscribe({
      next: (updated) => {
        this.selectedTicket.set(updated);
        this.reload();
      },
      error: (err: HttpErrorResponse) =>
        toast.error(this.extractError(err, 'No se pudo actualizar el estado.')),
    });
  }

  protected submitMessage(): void {
    const ticket = this.selectedTicket();
    const body = this.messageControl.value.trim();
    if (!ticket || !body) return;

    this.sendingMessage.set(true);
    this.messageError.set(null);

    this.supportTicketsService.addMessage(ticket.id, { body }).subscribe({
      next: (message) => {
        this.sendingMessage.set(false);
        this.messages.update((current) => [...current, message]);
        this.messageControl.reset('');
      },
      error: (err: HttpErrorResponse) => {
        this.sendingMessage.set(false);
        this.messageError.set(this.extractError(err, 'No se pudo enviar el mensaje.'));
      },
    });
  }

  private extractError(err: HttpErrorResponse, fallback: string): string {
    const errors = err.error?.errors as string[] | undefined;
    if (errors?.length) return errors.join(' ');
    return err.error?.message || fallback;
  }

  private reload(): void {
    this.loading.set(true);
    this.supportTicketsService
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
