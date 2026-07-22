import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { AuthService } from '../../../core/services/auth.service';
import { ClientsService } from '../../../core/services/clients.service';
import { UsersService } from '../../../core/services/users.service';

@Component({
  selector: 'app-client-profile',
  imports: [ReactiveFormsModule, HlmButtonImports, HlmInputImports, HlmCardImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div class="bg-muted/50 rounded-xl p-5">
        <p class="text-muted-foreground text-sm">Portal cliente</p>
        <h1 class="text-foreground mt-2 text-2xl font-semibold tracking-normal">Perfil</h1>
        <p class="text-muted-foreground mt-3 max-w-2xl text-sm leading-6">
          Actualiza tus datos de cuenta, la información institucional y tu contraseña.
        </p>
      </div>

      <div class="grid gap-4 lg:grid-cols-2">
        <!-- Datos de cuenta -->
        <div hlmCard>
          <div hlmCardHeader>
            <h2 hlmCardTitle>Datos de cuenta</h2>
          </div>
          <div hlmCardContent>
            <form [formGroup]="accountForm" (ngSubmit)="submitAccount()" class="grid gap-3">
              <input hlmInput placeholder="Nombre" formControlName="firstName" />
              <input hlmInput placeholder="Apellido" formControlName="lastName" />
              <input hlmInput type="email" placeholder="Correo" formControlName="email" />
              <input hlmInput placeholder="Teléfono" formControlName="phone" />
              <button hlmBtn type="submit" [disabled]="accountForm.invalid || accountSubmitting()" class="w-fit">
                @if (accountSubmitting()) { Guardando… } @else { Guardar datos de cuenta }
              </button>
              @if (accountSaved()) {
                <p class="text-muted-foreground text-xs">Datos de cuenta actualizados.</p>
              }
            </form>
          </div>
        </div>

        <!-- Datos institucionales -->
        <div hlmCard>
          <div hlmCardHeader>
            <h2 hlmCardTitle>Datos institucionales</h2>
          </div>
          <div hlmCardContent>
            <form [formGroup]="institutionForm" (ngSubmit)="submitInstitution()" class="grid gap-3">
              <input hlmInput placeholder="Institución" formControlName="institutionName" />
              <input hlmInput placeholder="Persona de contacto" formControlName="contactPerson" />
              <input hlmInput type="email" placeholder="Correo de contacto" formControlName="contactEmail" />
              <input hlmInput placeholder="Teléfono" formControlName="phone" />
              <input hlmInput placeholder="Dirección" formControlName="address" />
              <input hlmInput placeholder="Tipo de institución" formControlName="institutionType" />
              <input hlmInput type="number" placeholder="Número de estudiantes" formControlName="studentCount" />
              <button
                hlmBtn
                type="submit"
                [disabled]="institutionForm.invalid || institutionSubmitting()"
                class="w-fit"
              >
                @if (institutionSubmitting()) { Guardando… } @else { Guardar datos institucionales }
              </button>
              @if (institutionSaved()) {
                <p class="text-muted-foreground text-xs">Datos institucionales actualizados.</p>
              }
            </form>
          </div>
        </div>

        <!-- Cambiar contraseña -->
        <div hlmCard class="lg:col-span-2">
          <div hlmCardHeader>
            <h2 hlmCardTitle>Cambiar contraseña</h2>
          </div>
          <div hlmCardContent>
            <form [formGroup]="passwordForm" (ngSubmit)="submitPassword()" class="grid max-w-sm gap-3">
              <input hlmInput type="password" placeholder="Contraseña actual" formControlName="currentPassword" />
              <input hlmInput type="password" placeholder="Contraseña nueva" formControlName="newPassword" />
              <input hlmInput type="password" placeholder="Confirmar contraseña nueva" formControlName="confirmPassword" />
              @if (passwordForm.errors?.['mismatch'] && passwordForm.controls.confirmPassword.touched) {
                <p class="text-destructive text-xs">Las contraseñas no coinciden.</p>
              }
              <button hlmBtn type="submit" [disabled]="passwordForm.invalid || passwordSubmitting()" class="w-fit">
                @if (passwordSubmitting()) { Guardando… } @else { Cambiar contraseña }
              </button>
              @if (passwordSaved()) {
                <p class="text-muted-foreground text-xs">Contraseña actualizada.</p>
              }
              @if (passwordError()) {
                <p class="text-destructive text-xs">{{ passwordError() }}</p>
              }
            </form>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class ClientProfile {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly clientsService = inject(ClientsService);
  private readonly usersService = inject(UsersService);

  protected readonly accountSubmitting = signal(false);
  protected readonly accountSaved = signal(false);
  protected readonly institutionSubmitting = signal(false);
  protected readonly institutionSaved = signal(false);
  protected readonly passwordSubmitting = signal(false);
  protected readonly passwordSaved = signal(false);
  protected readonly passwordError = signal<string | null>(null);

  protected readonly accountForm = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
  });

  protected readonly institutionForm = this.fb.nonNullable.group({
    institutionName: ['', Validators.required],
    contactPerson: ['', Validators.required],
    contactEmail: ['', [Validators.required, Validators.email]],
    phone: [''],
    address: [''],
    institutionType: [''],
    studentCount: [0],
  });

  protected readonly passwordForm = this.fb.nonNullable.group(
    {
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: (group) => (group.get('newPassword')?.value === group.get('confirmPassword')?.value ? null : { mismatch: true }) },
  );

  constructor() {
    const user = this.authService.user();
    if (user) {
      this.accountForm.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone ?? '',
      });

      if (user.clientId) {
        this.clientsService.getById(user.clientId).subscribe((client) => {
          this.institutionForm.patchValue({
            institutionName: client.institutionName,
            contactPerson: client.contactPerson,
            contactEmail: client.contactEmail,
            phone: client.phone ?? '',
            address: client.address ?? '',
            institutionType: client.institutionType ?? '',
            studentCount: client.studentCount ?? 0,
          });
        });
      }
    }
  }

  protected submitAccount(): void {
    if (this.accountForm.invalid) return;
    this.accountSubmitting.set(true);
    this.accountSaved.set(false);

    this.usersService.updateMe(this.accountForm.getRawValue()).subscribe({
      next: (user) => {
        this.accountSubmitting.set(false);
        this.accountSaved.set(true);
        this.authService.updateUser(user);
      },
      error: () => this.accountSubmitting.set(false),
    });
  }

  protected submitInstitution(): void {
    if (this.institutionForm.invalid) return;
    this.institutionSubmitting.set(true);
    this.institutionSaved.set(false);

    this.clientsService.updateMe(this.institutionForm.getRawValue()).subscribe({
      next: () => {
        this.institutionSubmitting.set(false);
        this.institutionSaved.set(true);
      },
      error: () => this.institutionSubmitting.set(false),
    });
  }

  protected submitPassword(): void {
    if (this.passwordForm.invalid) return;
    this.passwordSubmitting.set(true);
    this.passwordSaved.set(false);
    this.passwordError.set(null);

    const { currentPassword, newPassword } = this.passwordForm.getRawValue();
    this.usersService.changePassword({ currentPassword, newPassword }).subscribe({
      next: () => {
        this.passwordSubmitting.set(false);
        this.passwordSaved.set(true);
        this.passwordForm.reset({ currentPassword: '', newPassword: '', confirmPassword: '' });
      },
      error: () => {
        this.passwordSubmitting.set(false);
        this.passwordError.set('Contraseña actual incorrecta.');
      },
    });
  }
}
