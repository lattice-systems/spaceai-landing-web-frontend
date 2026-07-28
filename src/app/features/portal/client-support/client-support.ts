import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLifeBuoy, lucidePlus, lucideSend, lucideTriangleAlert, lucideX } from '@ng-icons/lucide';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmDialogImports, HlmDialog } from '@spartan-ng/helm/dialog';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmNativeSelectImports } from '@spartan-ng/helm/native-select';
import { AuthService } from '../../../core/services/auth.service';
import { SupportTicketMessageResponse, SupportTicketResponse } from '../../../core/models/support-ticket.model';
import { SupportTicketsService } from '../../../core/services/support-tickets.service';
import { StatusChip } from '../../../shared/status-chip/status-chip';

@Component({
  selector: 'app-client-support',
  imports: [
    ReactiveFormsModule,
    NgIcon,
    DatePipe,
    HlmButtonImports,
    HlmCardImports,
    HlmInputImports,
    HlmLabelImports,
    HlmNativeSelectImports,
    HlmBadgeImports,
    HlmDialogImports,
    StatusChip,
  ],
  providers: [provideIcons({ lucideLifeBuoy, lucidePlus, lucideSend, lucideTriangleAlert, lucideX })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <span
            class="flex size-10 shrink-0 items-center justify-center rounded-full"
            style="background: color-mix(in oklch, var(--chip-amber) 16%, transparent); color: var(--chip-amber)"
          >
            <ng-icon name="lucideLifeBuoy" class="text-lg" />
          </span>
          <div>
            <h1 class="text-foreground text-xl font-semibold tracking-tight">Soporte</h1>
            <p class="text-muted-foreground text-sm">Tus tickets abiertos con el equipo SpaceIA.</p>
          </div>
        </div>
        <button hlmBtn size="sm" (click)="openCreate()">
          <ng-icon name="lucidePlus" class="mr-1" />
          Nuevo ticket
        </button>
      </div>

      @if (actionError()) {
        <div class="border-destructive/30 bg-destructive/10 text-destructive flex items-start gap-2 rounded-lg border p-3 text-sm">
          <ng-icon name="lucideTriangleAlert" class="mt-0.5 shrink-0 text-base" />
          <p class="flex-1">{{ actionError() }}</p>
          <button
            type="button"
            class="text-destructive/70 hover:text-destructive"
            aria-label="Cerrar"
            (click)="actionError.set(null)"
          >
            <ng-icon name="lucideX" />
          </button>
        </div>
      }

      <div class="grid gap-3">
        @for (ticket of tickets(); track ticket.id) {
          <button type="button" class="text-left" (click)="openDetail(ticket)">
            <div hlmCard class="hover:border-primary/50 transition-colors">
              <div hlmCardContent class="flex items-start justify-between gap-3">
                <div>
                  <p class="text-foreground text-sm font-medium">{{ ticket.subject }}</p>
                  <p class="text-muted-foreground mt-1 line-clamp-1 text-xs">{{ ticket.description }}</p>
                  <p class="text-muted-foreground mt-2 text-xs">{{ ticket.createdAt | date: 'mediumDate' }}</p>
                </div>
                <div class="flex flex-col items-end gap-1.5">
                  <app-status-chip [label]="statusLabel(ticket.status)" [chip]="statusChip(ticket.status)" />
                  <span hlmBadge variant="outline" class="font-normal">{{ priorityLabel(ticket.priority) }}</span>
                </div>
              </div>
            </div>
          </button>
        } @empty {
          <p class="text-muted-foreground text-sm">Aún no has abierto ningún ticket.</p>
        }
      </div>
    </section>

    <!-- Nuevo ticket -->
    <hlm-dialog #createDialogRef="hlmDialog">
      <hlm-dialog-content *hlmDialogPortal class="w-full sm:max-w-lg">
        <hlm-dialog-header>
          <h3 hlmDialogTitle>Nuevo ticket de soporte</h3>
          <p hlmDialogDescription>Cuéntanos qué necesitas — te contactaremos por este medio.</p>
        </hlm-dialog-header>
        <form [formGroup]="form" (ngSubmit)="submitCreate()" class="grid gap-4 py-2">
          <div class="grid gap-2">
            <label hlmLabel>Asunto</label>
            <input hlmInput placeholder="Resumen breve del problema" formControlName="subject" />
          </div>
          <div class="grid gap-2">
            <label hlmLabel>Prioridad</label>
            <hlm-native-select formControlName="priority">
              <option value="Low" hlmNativeSelectOption>Baja</option>
              <option value="Medium" hlmNativeSelectOption>Media</option>
              <option value="High" hlmNativeSelectOption>Alta</option>
            </hlm-native-select>
          </div>
          <div class="grid gap-2">
            <label hlmLabel>Descripción</label>
            <input hlmInput placeholder="Detalla el problema (mínimo 10 caracteres)…" formControlName="description" />
          </div>
          @if (formError()) {
            <p class="text-destructive text-sm">{{ formError() }}</p>
          }
          <hlm-dialog-footer class="border-border mt-2 border-t pt-4">
            <button hlmBtn type="button" variant="outline" hlmDialogClose>Cancelar</button>
            <button hlmBtn type="submit" [disabled]="form.invalid || submitting()">
              @if (submitting()) { Enviando… } @else { Crear ticket }
            </button>
          </hlm-dialog-footer>
        </form>
      </hlm-dialog-content>
    </hlm-dialog>

    <!-- Detalle -->
    <hlm-dialog #detailDialogRef="hlmDialog">
      <hlm-dialog-content *hlmDialogPortal class="w-full sm:max-w-lg">
        <hlm-dialog-header>
          <h3 hlmDialogTitle>{{ selectedTicket()?.subject }}</h3>
          <p hlmDialogDescription>{{ selectedTicket()?.createdAt | date: 'medium' }}</p>
        </hlm-dialog-header>
        <div class="grid gap-3 py-2">
          <div class="flex gap-2">
            <app-status-chip
              [label]="statusLabel(selectedTicket()?.status ?? '')"
              [chip]="statusChip(selectedTicket()?.status ?? '')"
            />
            <span hlmBadge variant="outline" class="font-normal">{{ priorityLabel(selectedTicket()?.priority ?? '') }}</span>
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
                    ? 'border-border bg-muted/40'
                    : 'border-primary/20 bg-primary/5'"
                >
                  <p class="text-foreground/90 whitespace-pre-line">{{ message.body }}</p>
                  <p class="text-muted-foreground mt-1 text-xs">
                    {{ message.senderRole === 'Admin' ? 'Soporte SpaceIA' : 'Tú' }} ·
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
                placeholder="Escribe un mensaje de seguimiento…"
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
export class ClientSupport {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly supportTicketsService = inject(SupportTicketsService);

  @ViewChild('createDialogRef') private createDialogRef!: HlmDialog;
  @ViewChild('detailDialogRef') private detailDialogRef!: HlmDialog;

  protected readonly tickets = signal<SupportTicketResponse[]>([]);
  protected readonly selectedTicket = signal<SupportTicketResponse | null>(null);
  protected readonly messages = signal<SupportTicketMessageResponse[]>([]);
  protected readonly submitting = signal(false);
  protected readonly sendingMessage = signal(false);
  protected readonly formError = signal<string | null>(null);
  protected readonly messageError = signal<string | null>(null);
  protected readonly actionError = signal<string | null>(null);
  protected readonly messageControl = new FormControl('', { nonNullable: true });

  protected readonly form = this.fb.nonNullable.group({
    subject: ['', Validators.required],
    priority: ['Medium', Validators.required],
    description: ['', [Validators.required, Validators.minLength(10)]],
  });

  constructor() {
    this.refresh();
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

  protected openCreate(): void {
    this.formError.set(null);
    this.form.reset({ subject: '', priority: 'Medium', description: '' });
    this.createDialogRef.open();
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

  protected submitCreate(): void {
    if (this.form.invalid) return;
    const clientId = this.authService.user()?.clientId;
    if (!clientId) {
      this.formError.set('No se pudo determinar tu cuenta de cliente.');
      return;
    }

    this.submitting.set(true);
    this.formError.set(null);

    this.supportTicketsService.create({ ...this.form.getRawValue(), clientId }).subscribe({
      next: () => {
        this.submitting.set(false);
        this.createDialogRef.close();
        this.refresh();
      },
      error: (err: HttpErrorResponse) => {
        this.submitting.set(false);
        this.formError.set(this.extractError(err, 'No se pudo crear el ticket.'));
      },
    });
  }

  private refresh(): void {
    this.supportTicketsService.listAll().subscribe({
      next: (data) => this.tickets.set(data),
      error: () => this.actionError.set('No se pudo actualizar la lista de tickets.'),
    });
  }

  private extractError(err: HttpErrorResponse, fallback: string): string {
    const errors = err.error?.errors as string[] | undefined;
    if (errors?.length) return errors.join(' ');
    return err.error?.message || fallback;
  }
}
