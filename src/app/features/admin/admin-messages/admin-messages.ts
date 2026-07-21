import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ContactMessagesService } from '../../../core/services/contact-messages.service';

@Component({
  selector: 'app-admin-messages',
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

      <section class="bg-muted/50 overflow-x-auto rounded-xl p-5">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="text-muted-foreground border-border border-b">
              <th class="pb-3 font-medium">Nombre</th>
              <th class="pb-3 font-medium">Correo</th>
              <th class="pb-3 font-medium">Institución</th>
              <th class="pb-3 font-medium">Cargo</th>
              <th class="pb-3 font-medium">Mensaje</th>
              <th class="pb-3 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            @for (msg of messages(); track msg.id) {
              <tr class="border-border/60 border-b last:border-0 align-top">
                <td class="text-foreground py-3 font-medium whitespace-nowrap">{{ msg.name }}</td>
                <td class="text-muted-foreground py-3 whitespace-nowrap">{{ msg.email }}</td>
                <td class="text-muted-foreground py-3 whitespace-nowrap">{{ msg.institutionName }}</td>
                <td class="text-muted-foreground py-3 whitespace-nowrap">{{ msg.jobTitle }}</td>
                <td class="text-muted-foreground py-3 max-w-md">{{ msg.message }}</td>
                <td class="text-muted-foreground py-3 whitespace-nowrap">{{ msg.status }}</td>
              </tr>
            } @empty {
              <tr>
                <td colspan="6" class="text-muted-foreground py-6 text-center">
                  Sin mensajes recibidos.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </section>
    </section>
  `,
})
export class AdminMessages {
  private readonly contactMessagesService = inject(ContactMessagesService);
  protected readonly messages = toSignal(this.contactMessagesService.list(), { initialValue: [] });
}
