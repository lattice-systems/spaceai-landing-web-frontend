import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { UsersService } from '../../../core/services/users.service';

@Component({
  selector: 'app-admin-users',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div class="bg-muted/50 rounded-xl p-5">
        <p class="text-muted-foreground text-sm">Portal admin</p>
        <h1 class="text-foreground mt-2 text-2xl font-semibold tracking-normal">Usuarios</h1>
        <p class="text-muted-foreground mt-3 max-w-2xl text-sm leading-6">
          Cuentas con acceso al portal cliente y al portal admin.
        </p>
      </div>

      <section class="bg-muted/50 overflow-x-auto rounded-xl p-5">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="text-muted-foreground border-border border-b">
              <th class="pb-3 font-medium">Nombre</th>
              <th class="pb-3 font-medium">Correo</th>
              <th class="pb-3 font-medium">Rol</th>
            </tr>
          </thead>
          <tbody>
            @for (user of users(); track user.id) {
              <tr class="border-border/60 border-b last:border-0">
                <td class="text-foreground py-3 font-medium">
                  {{ user.firstName }} {{ user.lastName }}
                </td>
                <td class="text-muted-foreground py-3">{{ user.email }}</td>
                <td class="text-muted-foreground py-3">{{ user.role }}</td>
              </tr>
            } @empty {
              <tr>
                <td colspan="3" class="text-muted-foreground py-6 text-center">Sin usuarios.</td>
              </tr>
            }
          </tbody>
        </table>
      </section>
    </section>
  `,
})
export class AdminUsers {
  private readonly usersService = inject(UsersService);
  protected readonly users = toSignal(this.usersService.list(), { initialValue: [] });
}
