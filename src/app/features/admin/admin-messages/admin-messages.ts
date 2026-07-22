import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { ContactMessagesService } from '../../../core/services/contact-messages.service';

@Component({
  selector: 'app-admin-messages',
  imports: [HlmTableImports, HlmBadgeImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div class="bg-muted/50 rounded-xl p-5">
        <p class="text-muted-foreground text-sm">Portal admin</p>
        <h1 class="text-foreground mt-2 text-2xl font-semibold tracking-normal">
          Mensajes de contacto
        </h1>
        <p class="text-muted-foreground mt-3 max-w-2xl text-sm leading-6">
          Mensajes enviados desde el formulario público de contacto.
        </p>
      </div>

      <section class="bg-muted/50 rounded-xl p-5">
        <div hlmTableContainer>
          <table hlmTable>
            <thead hlmTHead>
              <tr hlmTr>
                <th hlmTh>Nombre</th>
                <th hlmTh>Correo</th>
                <th hlmTh>Institución</th>
                <th hlmTh>Cargo</th>
                <th hlmTh>Mensaje</th>
                <th hlmTh>Estado</th>
              </tr>
            </thead>
            <tbody hlmTBody>
              @for (msg of messages(); track msg.id) {
                <tr hlmTr class="align-top">
                  <td hlmTd class="font-medium whitespace-nowrap">{{ msg.name }}</td>
                  <td hlmTd class="text-muted-foreground whitespace-nowrap">{{ msg.email }}</td>
                  <td hlmTd class="text-muted-foreground whitespace-nowrap">
                    {{ msg.institutionName }}
                  </td>
                  <td hlmTd class="text-muted-foreground whitespace-nowrap">{{ msg.jobTitle }}</td>
                  <td hlmTd class="text-muted-foreground max-w-md">{{ msg.message }}</td>
                  <td hlmTd class="whitespace-nowrap">
                    <span hlmBadge variant="secondary">{{ msg.status }}</span>
                  </td>
                </tr>
              } @empty {
                <tr hlmTr>
                  <td hlmTd colspan="6" class="text-muted-foreground text-center">
                    Sin mensajes recibidos.
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
export class AdminMessages {
  private readonly contactMessagesService = inject(ContactMessagesService);
  protected readonly messages = toSignal(this.contactMessagesService.list(), { initialValue: [] });
}
