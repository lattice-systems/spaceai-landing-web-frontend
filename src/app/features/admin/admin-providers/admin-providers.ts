import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { ProviderResponse } from '../../../core/models/provider.model';
import { ProvidersService } from '../../../core/services/providers.service';

@Component({
  selector: 'app-admin-providers',
  imports: [ReactiveFormsModule, HlmButtonImports, HlmInputImports, HlmTableImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div class="bg-muted/50 rounded-xl p-5">
        <p class="text-muted-foreground text-sm">Portal admin</p>
        <h1 class="text-foreground mt-2 text-2xl font-semibold tracking-normal">Proveedores</h1>
        <p class="text-muted-foreground mt-3 max-w-2xl text-sm leading-6">
          Proveedores de materia prima para la fabricación de los módulos SpaceIA.
        </p>
      </div>

      <section class="bg-muted/50 rounded-xl p-5">
        <h2 class="text-foreground mb-4 text-base font-semibold">Nuevo proveedor</h2>
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="grid gap-3 sm:grid-cols-3">
          <input hlmInput placeholder="Nombre" formControlName="name" />
          <input hlmInput placeholder="Persona de contacto" formControlName="contactPerson" />
          <input hlmInput type="email" placeholder="Correo" formControlName="email" />
          <input hlmInput placeholder="Teléfono" formControlName="phone" />
          <input hlmInput placeholder="Dirección" formControlName="address" class="sm:col-span-2" />
          <button hlmBtn type="submit" [disabled]="form.invalid || submitting()" class="sm:col-span-3">
            @if (submitting()) { Guardando… } @else { Agregar proveedor }
          </button>
        </form>
      </section>

      <section class="bg-muted/50 rounded-xl p-5">
        <div hlmTableContainer>
          <table hlmTable>
            <thead hlmTHead>
              <tr hlmTr>
                <th hlmTh>Nombre</th>
                <th hlmTh>Contacto</th>
                <th hlmTh>Correo</th>
                <th hlmTh>Teléfono</th>
              </tr>
            </thead>
            <tbody hlmTBody>
              @for (provider of providers(); track provider.id) {
                <tr hlmTr>
                  <td hlmTd class="font-medium">{{ provider.name }}</td>
                  <td hlmTd>{{ provider.contactPerson }}</td>
                  <td hlmTd>{{ provider.email }}</td>
                  <td hlmTd>{{ provider.phone }}</td>
                </tr>
              } @empty {
                <tr hlmTr>
                  <td hlmTd colspan="4" class="text-muted-foreground text-center">
                    Sin proveedores registrados.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>
    </section>
  `,
})
export class AdminProviders {
  private readonly fb = inject(FormBuilder);
  private readonly providersService = inject(ProvidersService);

  protected readonly submitting = signal(false);
  protected readonly providers = signal<ProviderResponse[]>([]);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    contactPerson: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    address: ['', Validators.required],
  });

  constructor() {
    this.reload();
  }

  protected onSubmit(): void {
    if (this.form.invalid) return;
    this.submitting.set(true);
    this.providersService.create(this.form.getRawValue()).subscribe({
      next: () => {
        this.submitting.set(false);
        this.form.reset({ name: '', contactPerson: '', email: '', phone: '', address: '' });
        this.reload();
      },
      error: () => this.submitting.set(false),
    });
  }

  private reload(): void {
    this.providersService.list().subscribe((data) => this.providers.set(data));
  }
}
