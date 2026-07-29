# Handoff — SpaceIA landing (admin panel + portal cliente)

Data: 2026-07-29. Estado: **plano de 22 pontos fechado (14 audit original + 8 Fase 4) +
re-auditoria independente feita, 1 bug real achado e corrigido**. Sem tarefa pendente
explícita.

## Repos e HEAD atual

- `spaceai-landing-web-frontend`: HEAD `4e07066` — "fix: add missing error handler on list
  reload across 10 screens". Working tree limpo. Push OK.
- `spaceai-landing-api-core`: HEAD `6026976` — "feat: audit every create/update/delete
  automatically". Working tree limpo. Push OK.

## Re-auditoria independente (pós Fase 4)

Rodei 2 agentes Explore em paralelo (um backend, um frontend) pra verificar do zero, sem
confiar na minha própria memória de ter implementado certo. Backend: **8/8 sound**, nenhum
problema achado (build limpo, wiring completo, guards de null corretos, índice único em
`Sale.QuoteId`, auditoria não entra em loop infinito, `PasswordHash` fora do diff). Frontend:
**achou 1 bug real** — `reload()` em todas as 10 telas com skeleton só tinha callback
`next`, sem `error`. Se a listagem falhasse (rede, 401, 500), o skeleton ficava girando pra
sempre e nenhum toast avisava o admin. Corrigido em todas as 10 + `admin-sales`/
`admin-audit-log` (que nem tinham `loading` mas também engoliam erro em silêncio).

Backend rodando local via `nohup env DOTNET_ROOT=/home/danie/.dotnet dotnet run ... >
log 2>&1 < /dev/null & disown -a` (plain `&`/`disown` mata o processo quando a call do Bash
retorna — já foi debugado nessa sessão, não repetir o erro). Frontend via `ng serve`
(porta 4200), ambos costumam já estar de pé entre sessões — checar antes de assumir queda.

## Metodologia estabelecida (seguir sempre)

1. Investigar padrão real de mercado antes de desenhar o módulo/regra de negócio.
2. Backend: DTOs + controller com `search`/filtros server-side via
   `GetPagedAsync(pageNumber, pageSize, predicate)`, regras de integridade (não deletar o
   que tem histórico — desativar/cancelar/soft-delete), migração com backfill SQL quando
   muda schema.
3. Frontend: reescrever tela seguindo layout já aprovado (`admin-users.ts`/
   `admin-materials.ts` são as referências), `effect()` central de reload,
   `hlm-numbered-pagination`, bulk actions só quando é fluxo real (não forçar).
4. **Reusar componentes, não duplicar.** Ver `[[status-chip]]`/`[[table-skeleton]]` abaixo.
5. **Não forçar tabela** — só quando o dado é genuinamente tabular.
6. Verificar (`dotnet build`, `npx tsc --noEmit -p tsconfig.app.json`, `ng build
   --configuration development`, curl E2E direto no backend rodando), commit atômico por
   repo/área, sem co-author, push imediato sem perguntar.

## Componentes/padrões compartilhados já existentes (usar, não recriar)

- `src/app/shared/status-chip/status-chip.ts` — `<app-status-chip [label] [chip]>`, badge
  colorido via `color-mix(in oklch, var(--chip-X) N%, transparent)`. Cada tela mantém só seu
  próprio `statusChip(status): string | null`.
- `src/app/shared/table-skeleton/table-skeleton.ts` — `<app-table-skeleton [cols]="N">`,
  usa a diretiva `hlmSkeleton` já vendorizada. Wired em toda tela com `<tbody hlmTBody>`
  paginada (ver padrão `@if (loading()) {...} @else { @for(...) {} @empty {...} }`).
- `toast` de `@spartan-ng/brain/sonner` — `toast.error(msg)` / `toast.success(msg)`,
  substituiu os banners `actionError` inline em toda tela admin+portal. `<hlm-toaster
  richColors closeButton />` já está em `AdminLayout` e `PortalLayout`.
- `hlm-tabs`/`HlmTabsImports` — controle de "trocar de vista" (não hand-rolar botões).
- Tokens de cor em `src/styles.css`: `--chip-violet/amber/emerald/sky/rose` (light+dark).
- `@angular/cdk/drag-drop` — board Kanban de Compras.

## O que já está feito

**Audit original (14 pontos, sessão anterior)**: todos os 10 módulos admin + 4 telas portal
cliente com CRUD, filtros server-side, regras de integridade (bloqueio de delete
referenciado, soft-delete, aviso ao desativar com transação aberta), bulk actions onde faz
sentido, dashboard com agregação real (COUNT, não full-table load).

**Fase 4 (8 pontos "fora de alcance" cobertos nesta sessão)**:

| # | Item | Backend | Frontend |
|---|---|---|---|
| 4.1 | Margem configurável | `BusinessSettingsController` (GET/PUT) | Header de admin-recipes, diálogo de edição |
| 4.2 | Dados fiscais Proveedores | `Provider.TaxId/BankName/BankAccount/Certifications` | Seção "Datos fiscales" em crear/editar |
| 4.3 | Cotización → Venta | `Sale` entity, `POST /quotes/{id}/convert-to-sale`, `SalesController` | Botão no detalhe + `/admin/ventas` |
| 4.4 | Email mock | `IEmailService`/`LoggingEmailService`, `EmailLog`, wired em Quotes/Tickets/Purchases | — (sem UI, `GET /email-logs` só backend) |
| 4.5 | Elegibilidade de reseña | `ReviewsController.Create` exige Quote Approved com o módulo | `client-reviews.ts` usa `/reviews/eligible-modules` |
| 4.6 | Docs cliente escopados | `ClientDashboardController` via Quote→Module→Product | — (mesmo campo, só query mudou) |
| 4.7 | Auditoria automática | `SpaceIaDbContext.SaveChangesAsync` override, `AuditLog`, `AuditLogsController` | `/admin/auditoria` |
| 4.8 | Toast + skeleton | — | `toast`/`TableSkeleton` em 10 telas + 2 layouts |

Todos os 8 verificados via curl E2E direto no backend rodando (não só build) antes de
commit — ver histórico de commits pra detalhe de cada teste.

## Pendências conhecidas, não resolvidas, não pedidas de novo

- **13 vulnerabilidades Dependabot** no frontend (aparecem a cada push, nunca endereçadas).
- **Nunca testado visualmente no browser** — toda a Fase 4 (toast, skeleton, telas Ventas/
  Auditoría) foi verificada só via `tsc`/`ng build`/curl no backend, não clicando na UI real.
- `client-support.ts`/`client-reviews.ts` (card-list, não tabela) não ganharam skeleton —
  sem padrão estabelecido pra esse layout, decisão consciente de deixar fora do 4.8.
- Itens explicitamente fora de alcance mesmo dentro da Fase 4 (com motivo): margem por
  módulo individual (só global), UI de Documentos admin, `Sale` sem faturamento/pagamento
  real (é stub), auditoria sem UI de "revert"/rollback.

## Próximo passo

Nenhuma tarefa pendente explícita do usuário. Se retomar, checar primeiro se
backend/frontend locais ainda estão de pé (`ps aux | grep -E "dotnet run|ng serve"`) antes
de assumir que caíram.
