---
title: 'Suportar novos campos de saúde do torrent no catálogo'
type: 'feature'
created: '2026-09-07'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** O endpoint `/items` passou a disponibilizar `torrent_is_dying`, `torrent_is_dead` e `torrent_failure_days`, mas o catálogo ainda não usa esses sinais de forma útil para experiência e filtragem.

**Approach:** Exibir indicador visual de risco no item quando `torrent_is_dying` for `true`, adicionar uma flag de CLI para excluir torrents mortos durante a catalogação e remover `torrent_failure_days` dos artefatos estáticos gerados.

</frozen-after-approval>

## Implementation Notes

- Decisão: a flag `--exclude-dead-torrents` foi aplicada no comando `data-catalog-items`, pois o impacto esperado é na construção dos artefatos de catálogo, não na etapa de download bruto.
- Alterado `src/cli.js`: adicionada a opção global `--exclude-dead-torrents`.
- Alterado `src/index.js`: criado `sanitizeItemFields(item)` para remover `torrent_failure_days` dos dados gerados; aplicado durante `dataFetchItems()` para refletir em `items.json`, `movies.json` e `tvs.json`.
- Alterado `src/index.js`: em `dataCatalogItems()`, aplicado filtro opcional para excluir itens com `torrent_is_dead === true` quando a flag estiver ativa, com log de quantos itens mortos foram removidos.
- Alterado `src/index.js` e `src/search.js`: adicionados campos compactados/expandidos para `torrent_is_dying` e `torrent_is_dead` no fluxo de busca (`td` e `tx`).
- Alterado `src/render/components/item.js`: renderização do emoji `💀` quando `torrent_is_dying` for `true`.

## Review Triage Log

- medium — verdadeiro: README não documentava a nova flag; corrigido com seção `--exclude-dead-torrents` para descoberta de uso.
- low — verdadeiro: texto de ajuda de ações no CLI estava inconsistente com ações suportadas; corrigido para `data-fetch-items|data-catalog-items|serve|build`.
- medium — verdadeiro: remoção de `torrent_failure_days` só ocorria em `dataFetchItems`; corrigido ao sanitizar também a entrada de `dataCatalogItems`.
- low — verdadeiro: log de exclusão de torrents mortos podia divergir do universo realmente elegível; corrigido com contagem sobre `baseValidItems`.
- false — rejeitado: ausência de indicador visual para `torrent_is_dead` não é defeito desta entrega, pois o pedido solicitado foi apenas sinalizar `torrent_is_dying` com emoji.
- low — verdadeiro: indicador com emoji sem semântica assistiva suficiente; corrigido com `role="img"` e `aria-label`.
- false — rejeitado: presença de artefato em `_bmad-output` faz parte do workflow BMAD desta execução e não caracteriza bug funcional do código.
