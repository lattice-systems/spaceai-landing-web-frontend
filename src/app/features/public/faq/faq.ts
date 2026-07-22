import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmAccordionImports } from '@spartan-ng/helm/accordion';
import { HlmButtonImports } from '@spartan-ng/helm/button';

const FAQS = [
  {
    question: '¿SpaceIA reemplaza los sistemas actuales de la universidad?',
    answer:
      'No necesariamente. La implementación puede integrarse con sistemas existentes y arrancar por módulos según la prioridad operativa.',
  },
  {
    question: '¿Se puede implementar solo una parte del ecosistema?',
    answer:
      'Sí. La app móvil, control de acceso, kiosco y robot pueden cotizarse como módulos separados o como ecosistema completo.',
  },
  {
    question: '¿Qué información necesitan para cotizar?',
    answer:
      'Tamaño de la institución, productos de interés, nivel de urgencia y datos de contacto de la persona responsable.',
  },
  {
    question: '¿La plataforma contempla soporte posterior?',
    answer:
      'Sí. El proyecto completo considera portal de cliente, documentación, tickets y seguimiento de implementación.',
  },
] as const;

@Component({
  selector: 'app-faq',
  imports: [RouterLink, HlmButtonImports, HlmAccordionImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="mx-auto max-w-4xl px-6 py-24 lg:px-8">
      <section>
        <p class="text-primary mb-3 text-sm font-semibold tracking-widest uppercase">FAQ</p>
        <h1 class="text-foreground text-4xl font-extrabold tracking-tight sm:text-6xl">
          Preguntas frecuentes.
        </h1>
        <p class="text-muted-foreground mt-5 max-w-2xl text-base leading-relaxed sm:text-lg">
          Respuestas rápidas para evaluar si SpaceIA encaja con tu institución.
        </p>
      </section>

      <section hlmAccordion type="single" class="mt-12">
        @for (item of faqs; track item.question) {
          <div hlmAccordionItem>
            <hlm-accordion-trigger class="px-6">
              {{ item.question }}
            </hlm-accordion-trigger>
            <hlm-accordion-content class="px-6">
              <p class="text-muted-foreground text-sm leading-relaxed">{{ item.answer }}</p>
            </hlm-accordion-content>
          </div>
        }
      </section>

      <section class="border-border bg-muted mt-12 rounded-lg border p-6">
        <h2 class="text-foreground text-xl font-bold tracking-tight">¿No ves tu pregunta?</h2>
        <p class="text-muted-foreground mt-2 text-sm leading-relaxed">
          Comparte tu contexto y responderemos con una recomendación concreta.
        </p>
        <div class="mt-5 flex flex-wrap gap-3">
          <a hlmBtn routerLink="/contacto">Contactar</a>
          <a hlmBtn variant="outline" routerLink="/cotizador">Cotizar</a>
        </div>
      </section>
    </main>
  `,
})
export class Faq {
  protected readonly faqs = FAQS;
}
