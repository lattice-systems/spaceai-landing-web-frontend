import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { UsersService } from '../../../core/services/users.service';

@Component({
  selector: 'app-admin-users',
  imports: [HlmTableImports, HlmBadgeImports],
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

      <section class="bg-muted/50 rounded-xl p-5">
        <div hlmTableContainer>
          <table hlmTable>
            <thead hlmTHead>
              <tr hlmTr>
                <th hlmTh>Nombre</th>
                <th hlmTh>Correo</th>
                <th hlmTh>Rol</th>
              </tr>
            </thead>
            <tbody hlmTBody>
              @for (user of users(); track user.id) {
                <tr hlmTr>
                  <td hlmTd class="font-medium">{{ user.firstName }} {{ user.lastName }}</td>
                  <td hlmTd class="text-muted-foreground">{{ user.email }}</td>
                  <td hlmTd>
                    <span hlmBadge [variant]="user.role === 'Admin' ? 'default' : 'secondary'">
                      {{ user.role }}
                    </span>
                  </td>
                </tr>
              } @empty {
                <tr hlmTr>
                  <td hlmTd colspan="3" class="text-muted-foreground text-center">
                    Sin usuarios.
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
export class AdminUsers {
  private readonly usersService = inject(UsersService);
  protected readonly users = toSignal(this.usersService.list(), { initialValue: [] });
}
