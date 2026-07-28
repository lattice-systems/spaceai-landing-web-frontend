import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideDownload, lucideFileText } from '@ng-icons/lucide';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { DocumentsService } from '../../../core/services/documents.service';

@Component({
  selector: 'app-client-documents',
  imports: [NgIcon, DatePipe, HlmButtonImports, HlmCardImports, HlmBadgeImports],
  providers: [provideIcons({ lucideDownload, lucideFileText })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div class="flex items-center gap-3">
        <span
          class="flex size-10 shrink-0 items-center justify-center rounded-full"
          style="background: color-mix(in oklch, var(--chip-emerald) 14%, transparent); color: var(--chip-emerald)"
        >
          <ng-icon name="lucideFileText" class="text-lg" />
        </span>
        <div>
          <h1 class="text-foreground text-xl font-semibold tracking-tight">Documentación</h1>
          <p class="text-muted-foreground text-sm">Guías y manuales técnicos disponibles para tu cuenta.</p>
        </div>
      </div>

      <div class="grid gap-3 sm:grid-cols-2">
        @for (doc of documents(); track doc.id) {
          <div hlmCard>
            <div hlmCardContent class="flex items-start gap-3">
              <ng-icon name="lucideFileText" class="text-muted-foreground mt-0.5 text-xl" />
              <div class="min-w-0 flex-1">
                <p class="text-foreground text-sm font-medium">{{ doc.title }}</p>
                @if (doc.description) {
                  <p class="text-muted-foreground mt-1 text-xs">{{ doc.description }}</p>
                }
                <div class="mt-2 flex items-center gap-2">
                  <span hlmBadge variant="outline" class="font-normal">{{ doc.documentType }}</span>
                  <span class="text-muted-foreground text-xs">{{ doc.createdAt | date: 'mediumDate' }}</span>
                </div>
              </div>
              <a hlmBtn variant="outline" size="sm" [href]="doc.fileUrl" target="_blank" rel="noopener">
                <ng-icon name="lucideDownload" class="mr-1" />
                Descargar
              </a>
            </div>
          </div>
        } @empty {
          <p class="text-muted-foreground text-sm">Aún no hay documentos disponibles.</p>
        }
      </div>
    </section>
  `,
})
export class ClientDocuments {
  private readonly documentsService = inject(DocumentsService);

  protected readonly documents = toSignal(this.documentsService.list(), { initialValue: [] });
}
