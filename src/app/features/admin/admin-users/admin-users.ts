import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideEllipsis,
  lucideKeyRound,
  lucidePencil,
  lucideUsers,
  lucidePlus,
  lucideSearch,
  lucideTrash2,
  lucideUserCheck,
  lucideUserX,
} from '@ng-icons/lucide';
import { HlmAlertDialogImports, HlmAlertDialog } from '@spartan-ng/helm/alert-dialog';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmDialogImports, HlmDialog } from '@spartan-ng/helm/dialog';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmNativeSelectImports } from '@spartan-ng/helm/native-select';
import { HlmPaginationImports } from '@spartan-ng/helm/pagination';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';
import { AuthService } from '../../../core/services/auth.service';
import { ClientsService } from '../../../core/services/clients.service';
import { RolesService } from '../../../core/services/roles.service';
import { UsersService } from '../../../core/services/users.service';
import { PagedResult } from '../../../core/models/paged-result.model';
import { RoleResponse } from '../../../core/models/role-catalog.model';
import { Role } from '../../../core/models/role.model';
import { UserResponse } from '../../../core/models/user.model';
import { StatusChip } from '../../../shared/status-chip/status-chip';

type StatusFilter = 'all' | 'active' | 'inactive';

@Component({
  selector: 'app-admin-users',
  imports: [
    ReactiveFormsModule,
    NgIcon,
    DatePipe,
    HlmAvatarImports,
    HlmButtonImports,
    HlmCardImports,
    HlmInputImports,
    HlmLabelImports,
    HlmNativeSelectImports,
    HlmTableImports,
    HlmBadgeImports,
    HlmTabsImports,
    HlmCheckboxImports,
    HlmDropdownMenuImports,
    HlmDialogImports,
    HlmAlertDialogImports,
    HlmPaginationImports,
    StatusChip,
  ],
  providers: [
    provideIcons({
      lucideEllipsis,
      lucideKeyRound,
      lucidePencil,
      lucideUsers,
      lucidePlus,
      lucideSearch,
      lucideTrash2,
      lucideUserCheck,
      lucideUserX,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="flex flex-1 flex-col gap-3 p-4 pt-0">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <span class="bg-primary/12 text-primary flex size-10 shrink-0 items-center justify-center rounded-full">
            <ng-icon name="lucideUsers" class="text-lg" />
          </span>
          <div>
            <h1 class="text-foreground text-xl font-semibold tracking-tight">Usuarios</h1>
            <p class="text-muted-foreground text-sm">
              Administradores y clientes con acceso al portal.
            </p>
          </div>
        </div>

        <button hlmBtn size="sm" (click)="openCreate()">
          <ng-icon name="lucidePlus" class="mr-1" />
          Nuevo {{ activeRole() === 'Admin' ? 'administrador' : 'cliente' }}
        </button>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <hlm-tabs [tab]="activeRole()" (tabActivated)="onTabChange($event)">
          <hlm-tabs-list aria-label="Tipo de cuenta" class="w-fit">
            <button hlmTabsTrigger="Admin">Administradores</button>
            <button hlmTabsTrigger="Client">Clientes</button>
          </hlm-tabs-list>
        </hlm-tabs>

        <div class="relative min-w-56 flex-1">
          <ng-icon
            name="lucideSearch"
            class="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-base"
          />
          <input
            hlmInput
            class="pl-9"
            placeholder="Buscar por nombre o correo…"
            [value]="search()"
            (input)="onSearchInput($event)"
          />
        </div>

        <hlm-native-select class="w-40" [value]="statusFilter()" (valueChange)="onStatusFilterChange($event)">
          <option value="all" hlmNativeSelectOption>Todos los estados</option>
          <option value="active" hlmNativeSelectOption>Activos</option>
          <option value="inactive" hlmNativeSelectOption>Inactivos</option>
        </hlm-native-select>
      </div>

      @if (selectedIds().size > 0) {
        <div class="bg-muted/50 border-border flex items-center gap-3 rounded-lg border p-3">
          <p class="text-sm font-medium">{{ selectedIds().size }} seleccionados</p>
          <button hlmBtn variant="outline" size="sm" (click)="bulkDeactivateConfirmRef.open()">
            Desactivar seleccionados
          </button>
          <button hlmBtn variant="destructive" size="sm" (click)="bulkDeleteConfirmRef.open()">
            Eliminar seleccionados
          </button>
        </div>
      }

      <div hlmCard class="gap-0 overflow-hidden rounded-xl py-0">
        <div hlmTableContainer>
          <table hlmTable>
            <thead hlmTHead>
              <tr hlmTr class="bg-muted/40 hover:bg-muted/40">
                <th hlmTh class="w-10">
                  <hlm-checkbox
                    [checked]="allSelected()"
                    (checkedChange)="toggleSelectAll($event)"
                  />
                </th>
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Nombre</th>
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Correo</th>
                @if (activeRole() === 'Client') {
                  <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Institución</th>
                }
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Estado</th>
                <th hlmTh class="text-muted-foreground text-xs font-medium tracking-wide uppercase">Creado</th>
                <th hlmTh class="w-10 text-right">
                  <span class="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody hlmTBody>
              @for (user of page().data; track user.id) {
                <tr hlmTr [attr.data-state]="selectedIds().has(user.id) ? 'selected' : null">
                  <td hlmTd>
                    <hlm-checkbox
                      [checked]="selectedIds().has(user.id)"
                      (checkedChange)="toggleSelect(user.id)"
                    />
                  </td>
                  <td hlmTd>
                    <div class="flex items-center gap-3">
                      <hlm-avatar class="size-8 shrink-0">
                        <span hlmAvatarFallback class="text-xs">{{ initialsOf(user) }}</span>
                      </hlm-avatar>
                      <div class="flex flex-col">
                        <span class="text-foreground font-medium leading-tight">
                          {{ user.firstName }} {{ user.lastName }}
                        </span>
                        <span class="text-muted-foreground text-xs leading-tight sm:hidden">
                          {{ user.email }}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td hlmTd class="text-muted-foreground hidden sm:table-cell">{{ user.email }}</td>
                  @if (activeRole() === 'Client') {
                    <td hlmTd class="text-muted-foreground">{{ user.institutionName ?? '—' }}</td>
                  }
                  <td hlmTd>
                    <app-status-chip
                      [label]="user.isActive ? 'Activo' : 'Inactivo'"
                      [chip]="user.isActive ? '--chip-emerald' : null"
                    />
                  </td>
                  <td hlmTd class="text-muted-foreground">{{ user.createdAt | date: 'dd MMM yyyy' }}</td>
                  <td hlmTd class="text-right">
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
                    <ng-template #rowMenu>
                      <hlm-dropdown-menu class="min-w-48 rounded-lg">
                        <button hlmDropdownMenuItem (click)="openEdit(user)">
                          <ng-icon name="lucidePencil" />
                          Editar
                        </button>
                        <button hlmDropdownMenuItem (click)="openResetPassword(user)">
                          <ng-icon name="lucideKeyRound" />
                          Restablecer contraseña
                        </button>
                        @if (user.id !== currentUserId()) {
                          <hlm-dropdown-menu-separator />
                          @if (user.isActive) {
                            <button hlmDropdownMenuItem (click)="deactivateOne(user)">
                              <ng-icon name="lucideUserX" />
                              Desactivar
                            </button>
                          } @else {
                            <button hlmDropdownMenuItem (click)="activateOne(user)">
                              <ng-icon name="lucideUserCheck" />
                              Activar
                            </button>
                          }
                          <hlm-dropdown-menu-separator />
                          <button hlmDropdownMenuItem variant="destructive" (click)="openDeleteConfirm(user)">
                            <ng-icon name="lucideTrash2" />
                            Eliminar
                          </button>
                        }
                      </hlm-dropdown-menu>
                    </ng-template>
                  </td>
                </tr>
              } @empty {
                <tr hlmTr>
                  <td hlmTd [attr.colspan]="activeRole() === 'Client' ? 7 : 6" class="text-muted-foreground text-center">
                    Sin usuarios que coincidan con la búsqueda.
                  </td>
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

    <!-- Crear usuario -->
    <hlm-dialog #createDialogRef="hlmDialog">
      <hlm-dialog-content *hlmDialogPortal class="w-full sm:max-w-xl">
        <hlm-dialog-header>
          <h3 hlmDialogTitle>Nuevo {{ activeRole() === 'Admin' ? 'administrador' : 'cliente' }}</h3>
          <p hlmDialogDescription>
            Completa los datos de la cuenta. Se creará con acceso activo al portal.
          </p>
        </hlm-dialog-header>
        <form [formGroup]="createForm" (ngSubmit)="submitCreate()" class="grid gap-5 py-2">
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="grid gap-2">
              <label hlmLabel>Nombre</label>
              <input hlmInput placeholder="Juan" formControlName="firstName" />
            </div>
            <div class="grid gap-2">
              <label hlmLabel>Apellido</label>
              <input hlmInput placeholder="Pérez" formControlName="lastName" />
            </div>
          </div>
          <div class="grid gap-2">
            <label hlmLabel>Correo electrónico</label>
            <input hlmInput type="email" placeholder="juan@institucion.edu" formControlName="email" />
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="grid gap-2">
              <label hlmLabel>Teléfono</label>
              <input hlmInput placeholder="55 1234 5678" formControlName="phone" />
            </div>
            <div class="grid gap-2">
              <label hlmLabel>Contraseña</label>
              <input hlmInput type="password" placeholder="Mínimo 6 caracteres" formControlName="password" />
            </div>
          </div>
          @if (activeRole() === 'Client') {
            <div class="grid gap-2">
              <label hlmLabel>Institución</label>
              <input hlmInput placeholder="Universidad Ejemplo" formControlName="institutionName" />
            </div>
          }
          @if (formError()) {
            <p class="text-destructive text-sm">{{ formError() }}</p>
          }
          <hlm-dialog-footer class="border-border mt-2 border-t pt-4">
            <button hlmBtn type="button" variant="outline" hlmDialogClose>Cancelar</button>
            <button hlmBtn type="submit" [disabled]="createForm.invalid || submitting()">
              @if (submitting()) { Creando… } @else { Crear usuario }
            </button>
          </hlm-dialog-footer>
        </form>
      </hlm-dialog-content>
    </hlm-dialog>

    <!-- Editar usuario -->
    <hlm-dialog #editDialogRef="hlmDialog">
      <hlm-dialog-content *hlmDialogPortal class="w-full sm:max-w-xl">
        <hlm-dialog-header>
          <h3 hlmDialogTitle>Editar usuario</h3>
          <p hlmDialogDescription>Actualiza los datos de la cuenta seleccionada.</p>
        </hlm-dialog-header>
        <form [formGroup]="editForm" (ngSubmit)="submitEdit()" class="grid gap-5 py-2">
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="grid gap-2">
              <label hlmLabel>Nombre</label>
              <input hlmInput placeholder="Juan" formControlName="firstName" />
            </div>
            <div class="grid gap-2">
              <label hlmLabel>Apellido</label>
              <input hlmInput placeholder="Pérez" formControlName="lastName" />
            </div>
          </div>
          <div class="grid gap-2">
            <label hlmLabel>Correo electrónico</label>
            <input hlmInput type="email" placeholder="juan@institucion.edu" formControlName="email" />
          </div>
          <div class="grid gap-2">
            <label hlmLabel>Teléfono</label>
            <input hlmInput placeholder="55 1234 5678" formControlName="phone" />
          </div>
          @if (formError()) {
            <p class="text-destructive text-sm">{{ formError() }}</p>
          }
          <hlm-dialog-footer class="border-border mt-2 border-t pt-4">
            <button hlmBtn type="button" variant="outline" hlmDialogClose>Cancelar</button>
            <button hlmBtn type="submit" [disabled]="editForm.invalid || submitting()">
              @if (submitting()) { Guardando… } @else { Guardar cambios }
            </button>
          </hlm-dialog-footer>
        </form>
      </hlm-dialog-content>
    </hlm-dialog>

    <!-- Restablecer contraseña -->
    <hlm-dialog #resetPasswordDialogRef="hlmDialog">
      <hlm-dialog-content *hlmDialogPortal class="w-full sm:max-w-xl">
        <hlm-dialog-header>
          <h3 hlmDialogTitle>Restablecer contraseña</h3>
          <p hlmDialogDescription>
            {{ selectedUser()?.firstName }} {{ selectedUser()?.lastName }} — {{ selectedUser()?.email }}
          </p>
        </hlm-dialog-header>
        <form [formGroup]="resetPasswordForm" (ngSubmit)="submitResetPassword()" class="grid gap-5 py-2">
          <div class="grid gap-2">
            <label hlmLabel>Nueva contraseña</label>
            <input hlmInput type="password" placeholder="Mínimo 6 caracteres" formControlName="newPassword" />
            <p class="text-muted-foreground text-xs">
              El usuario podrá iniciar sesión con esta contraseña de inmediato.
            </p>
          </div>
          @if (formError()) {
            <p class="text-destructive text-sm">{{ formError() }}</p>
          }
          <hlm-dialog-footer class="border-border mt-2 border-t pt-4">
            <button hlmBtn type="button" variant="outline" hlmDialogClose>Cancelar</button>
            <button hlmBtn type="submit" [disabled]="resetPasswordForm.invalid || submitting()">
              @if (submitting()) { Guardando… } @else { Restablecer }
            </button>
          </hlm-dialog-footer>
        </form>
      </hlm-dialog-content>
    </hlm-dialog>

    <!-- Confirmar eliminación individual -->
    <hlm-alert-dialog #deleteConfirmRef="hlmAlertDialog">
      <hlm-alert-dialog-content *hlmAlertDialogPortal>
        <hlm-alert-dialog-header>
          <h2 hlmAlertDialogTitle>¿Eliminar este usuario?</h2>
          <p hlmAlertDialogDescription>
            {{ selectedUser()?.firstName }} {{ selectedUser()?.lastName }} perderá acceso al portal.
            Esta acción se puede revertir solo desde la base de datos.
          </p>
        </hlm-alert-dialog-header>
        <hlm-alert-dialog-footer>
          <button hlmAlertDialogCancel>Cancelar</button>
          <button hlmAlertDialogAction variant="destructive" (click)="confirmDeleteOne()">Eliminar</button>
        </hlm-alert-dialog-footer>
      </hlm-alert-dialog-content>
    </hlm-alert-dialog>

    <!-- Confirmar desactivación en lote -->
    <hlm-alert-dialog #bulkDeactivateConfirmRef="hlmAlertDialog">
      <hlm-alert-dialog-content *hlmAlertDialogPortal>
        <hlm-alert-dialog-header>
          <h2 hlmAlertDialogTitle>¿Desactivar {{ selectedIds().size }} usuarios?</h2>
          <p hlmAlertDialogDescription>No podrán iniciar sesión hasta que se reactiven.</p>
        </hlm-alert-dialog-header>
        <hlm-alert-dialog-footer>
          <button hlmAlertDialogCancel>Cancelar</button>
          <button hlmAlertDialogAction (click)="confirmBulkDeactivate()">Desactivar</button>
        </hlm-alert-dialog-footer>
      </hlm-alert-dialog-content>
    </hlm-alert-dialog>

    <!-- Confirmar eliminación en lote -->
    <hlm-alert-dialog #bulkDeleteConfirmRef="hlmAlertDialog">
      <hlm-alert-dialog-content *hlmAlertDialogPortal>
        <hlm-alert-dialog-header>
          <h2 hlmAlertDialogTitle>¿Eliminar {{ selectedIds().size }} usuarios?</h2>
          <p hlmAlertDialogDescription>Perderán acceso al portal de forma inmediata.</p>
        </hlm-alert-dialog-header>
        <hlm-alert-dialog-footer>
          <button hlmAlertDialogCancel>Cancelar</button>
          <button hlmAlertDialogAction variant="destructive" (click)="confirmBulkDelete()">Eliminar</button>
        </hlm-alert-dialog-footer>
      </hlm-alert-dialog-content>
    </hlm-alert-dialog>
  `,
})
export class AdminUsers {
  private readonly fb = inject(FormBuilder);
  private readonly usersService = inject(UsersService);
  private readonly clientsService = inject(ClientsService);
  private readonly rolesService = inject(RolesService);
  private readonly authService = inject(AuthService);

  @ViewChild('createDialogRef') private createDialogRef!: HlmDialog;
  @ViewChild('editDialogRef') private editDialogRef!: HlmDialog;
  @ViewChild('resetPasswordDialogRef') private resetPasswordDialogRef!: HlmDialog;
  @ViewChild('deleteConfirmRef') protected deleteConfirmRef!: HlmAlertDialog;
  @ViewChild('bulkDeactivateConfirmRef') protected bulkDeactivateConfirmRef!: HlmAlertDialog;
  @ViewChild('bulkDeleteConfirmRef') protected bulkDeleteConfirmRef!: HlmAlertDialog;

  protected readonly activeRole = signal<Role>('Admin');
  protected readonly search = signal('');
  protected readonly statusFilter = signal<StatusFilter>('all');
  protected readonly pageNumber = signal(1);
  protected readonly pageSize = signal(10);
  protected readonly page = signal<PagedResult<UserResponse>>({
    totalRecords: 0,
    pageNumber: 1,
    pageSize: 10,
    data: [],
  });
  protected readonly selectedIds = signal<Set<string>>(new Set());
  protected readonly roles = signal<RoleResponse[]>([]);
  protected readonly selectedUser = signal<UserResponse | null>(null);
  protected readonly submitting = signal(false);
  protected readonly formError = signal<string | null>(null);
  protected readonly currentUserId = computed(() => this.authService.user()?.id ?? null);

  protected readonly allSelected = computed(() => {
    const data = this.page().data;
    return data.length > 0 && data.every((u) => this.selectedIds().has(u.id));
  });

  protected readonly createForm = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    password: ['', [Validators.required, Validators.minLength(6)]],
    institutionName: [''],
  });

  protected readonly editForm = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
  });

  protected readonly resetPasswordForm = this.fb.nonNullable.group({
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
  });

  private searchTimeout?: ReturnType<typeof setTimeout>;

  constructor() {
    this.rolesService.list().subscribe((roles) => this.roles.set(roles));

    // Efecto central: cualquier cambio de tab/búsqueda/filtro/página dispara una sola recarga.
    // Las mutaciones (crear/editar/activar/eliminar) no tocan estos signals, así que llaman
    // reload() explícitamente en sus propios callbacks de éxito.
    effect(() => {
      this.activeRole();
      this.search();
      this.statusFilter();
      this.pageNumber();
      this.pageSize();
      this.reload();
    });
  }

  protected onTabChange(role: string): void {
    this.activeRole.set(role as Role);
    this.pageNumber.set(1);
    this.selectedIds.set(new Set());
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
    this.selectedIds.set(new Set(this.page().data.map((u) => u.id)));
  }

  protected openCreate(): void {
    this.formError.set(null);
    this.createForm.reset({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      institutionName: '',
    });
    this.createDialogRef.open();
  }

  protected openEdit(user: UserResponse): void {
    this.formError.set(null);
    this.selectedUser.set(user);
    this.editForm.reset({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone ?? '',
    });
    this.editDialogRef.open();
  }

  protected openResetPassword(user: UserResponse): void {
    this.formError.set(null);
    this.selectedUser.set(user);
    this.resetPasswordForm.reset({ newPassword: '' });
    this.resetPasswordDialogRef.open();
  }

  protected openDeleteConfirm(user: UserResponse): void {
    this.selectedUser.set(user);
    this.deleteConfirmRef.open();
  }

  protected submitCreate(): void {
    if (this.createForm.invalid) return;
    this.submitting.set(true);
    this.formError.set(null);

    const roleId = this.roles().find((r) => r.name === this.activeRole())?.id;
    if (!roleId) {
      this.submitting.set(false);
      this.formError.set('No se encontró el rol seleccionado.');
      return;
    }

    const { firstName, lastName, email, phone, password, institutionName } =
      this.createForm.getRawValue();

    this.usersService.create({ firstName, lastName, email, phone, password, roleId }).subscribe({
      next: (createdUser) => {
        if (this.activeRole() === 'Client') {
          this.clientsService
            .create({
              userId: createdUser.id,
              institutionName: institutionName || `${firstName} ${lastName}`,
              contactPerson: `${firstName} ${lastName}`,
              phone,
              address: '',
            })
            .subscribe();
        }
        this.submitting.set(false);
        this.createDialogRef.close();
        this.reload();
      },
      error: () => {
        this.submitting.set(false);
        this.formError.set('No se pudo crear el usuario. Verifica los datos.');
      },
    });
  }

  protected submitEdit(): void {
    const user = this.selectedUser();
    if (this.editForm.invalid || !user) return;
    this.submitting.set(true);
    this.formError.set(null);

    const roleId = this.roles().find((r) => r.name === user.role)?.id;
    if (!roleId) {
      this.submitting.set(false);
      this.formError.set('No se encontró el rol del usuario.');
      return;
    }

    this.usersService.update(user.id, { ...this.editForm.getRawValue(), roleId }).subscribe({
      next: () => {
        this.submitting.set(false);
        this.editDialogRef.close();
        this.reload();
      },
      error: () => {
        this.submitting.set(false);
        this.formError.set('No se pudo actualizar el usuario.');
      },
    });
  }

  protected submitResetPassword(): void {
    const user = this.selectedUser();
    if (this.resetPasswordForm.invalid || !user) return;
    this.submitting.set(true);
    this.formError.set(null);

    this.usersService.resetPassword(user.id, this.resetPasswordForm.getRawValue()).subscribe({
      next: () => {
        this.submitting.set(false);
        this.resetPasswordDialogRef.close();
      },
      error: () => {
        this.submitting.set(false);
        this.formError.set('No se pudo restablecer la contraseña.');
      },
    });
  }

  protected activateOne(user: UserResponse): void {
    this.usersService.activate(user.id).subscribe(() => this.reload());
  }

  protected deactivateOne(user: UserResponse): void {
    this.usersService.deactivate(user.id).subscribe(() => this.reload());
  }

  protected confirmDeleteOne(): void {
    const user = this.selectedUser();
    if (!user) return;
    this.usersService.remove(user.id).subscribe(() => {
      this.deleteConfirmRef.close();
      this.reload();
    });
  }

  protected confirmBulkDeactivate(): void {
    this.usersService.bulkSetStatus(Array.from(this.selectedIds()), false).subscribe(() => {
      this.bulkDeactivateConfirmRef.close();
      this.selectedIds.set(new Set());
      this.reload();
    });
  }

  protected confirmBulkDelete(): void {
    this.usersService.bulkDelete(Array.from(this.selectedIds())).subscribe(() => {
      this.bulkDeleteConfirmRef.close();
      this.selectedIds.set(new Set());
      this.reload();
    });
  }

  protected initialsOf(user: UserResponse): string {
    return `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() || '?';
  }

  private reload(): void {
    this.usersService
      .list({
        pageNumber: this.pageNumber(),
        pageSize: this.pageSize(),
        search: this.search() || undefined,
        role: this.activeRole(),
        isActive:
          this.statusFilter() === 'all' ? undefined : this.statusFilter() === 'active',
      })
      .subscribe((result) => this.page.set(result));
  }
}
