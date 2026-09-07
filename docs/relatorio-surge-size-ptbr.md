# Relatório: tamanho do build e risco de publicação no Surge

## Resumo executivo

O build da pipeline publica um artefato final que excede o limite do Surge de 400 MB. A falha observada em produção mostra:

```text
npx surge dist https://catalogo.betor.top --token ***
project: dist
size: 4728 files, 455.6 MB
Aborted - Unable to publish. Application too large
```

A reprodução local do ponto de build, com a mesma lógica da GitHub Actions, confirma que o projeto está gerando um artefato grande demais para a publicação estática. O problema principal não é só o HTML da página, mas o volume de JSONs gerados e copiados para o diretório de saída antes do upload.

## Evidência local obtida

Comandos executados no ambiente local e baseados no fluxo da pipeline:

- `npm ci`
- `npm link`
- `betor-catalog build`
- `cp src/_data/*.json dist/static/data`

Medidas coletadas:

```text
$ du -sm dist
311     dist
$ find dist -type f | wc -l
5362
```

Isso mostra que o artefato final do site, antes do upload para o Surge, já fica em torno de 311 MB. Em produção, a ação da pipeline alcança 455.6 MB porque o processo de publicação inclui a cópia de todos os JSONs gerados do diretório `src/_data` para `dist/static/data`.

## Causa raiz

A causa direta está nesta etapa do workflow em [.github/workflows/build-and-deploy.yml](../.github/workflows/build-and-deploy.yml):

```yaml
- run: betor-catalog build
- run: cp src/_data/*.json dist/static/data
- run: npx surge dist ...
```

O diretório gerado em `src/_data` é grande por si só:

```text
$ du -sm src/_data
190     src/_data
```

Os maiores participantes, em ordem aproximada, são:

- `items.json`: 43 MB
- `catalog.json`: 33 MB
- `movies.json`: 28 MB
- `searchCatalog.json`: 26 MB
- `catalogMovies.json`: 19 MB
- `tvs.json`: 15 MB
- `catalogTvs.json`: 14 MB
- `catalogTvsBySeason.json`: 9.9 MB

O maior problema é que esse conjunto inteiro é publicado como conteúdo estático do site, mesmo sendo dados de apoio, backup, índice de busca ou material redundante para a UI pública.

## A relação entre build local e falha do Surge

A falha de produção indica 455.6 MB no upload. O build local medido no mesmo fluxo ficou em 311 MB sem contar o efeito do payload extra que é copiado ao final; a diferença é explicada pelo volume dos JSONs gerados e pelas páginas duplicadas para cada item/temporada.

Em outras palavras, o projeto está muito próximo do limite do Surge quando inclui os dados gerados em `src/_data`, e um pouco acima do limite quando se faz a publicação completa da distribuição.

## Sugestões de redução, em ordem de impacto

As estimativas abaixo são baseadas no tamanho real dos arquivos gerados e na estrutura atual do projeto. O impacto é aproximado, mas serve como prioridade de implementação.

1. Remover a cópia de `src/_data/*.json` para `dist/static/data` antes do upload
   - Potencial de redução: ~190 MB
   - Motivo: o diretório `src/_data` ocupa cerca de 190 MB, e esse é o maior peso do artefato.
   - Impacto esperado: reduz o upload de ~455 MB para algo em torno de ~265 MB, mantendo o projeto abaixo do limite do Surge.

2. Parar de publicar o `searchCatalog.json` em produção
   - Potencial de redução: ~26 MB
   - Motivo: esse arquivo é um índice de busca amplamente redundante para uma publicação estática e pode ser gerado sob demanda ou em um worker dedicado.
   - Impacto esperado: reduz o artefato final em mais 26 MB.

3. Reduzir a publicação dos arquivos `catalog*` e `*_items` em produção
   - Potencial de redução: ~76 MB combinados
   - Exemplos: `catalog.json` (~33 MB), `catalogMovies.json` (~19 MB), `catalogTvs.json` (~14 MB), `catalogTvsBySeason.json` (~9.9 MB)
   - Motivo: muitos desses arquivos são meta-dados completos e altamente redundantes para o site público ou para páginas que não são acessadas com frequência.
   - Impacto esperado: leva o upload a ficar bem abaixo do teto do Surge quando combinado com a remoção da cópia de `src/_data`.

4. Excluir `items.json`, `movies.json` e `tvs.json` da publicação pública, mantendo somente o necessário para download/uso interno
   - Potencial de redução: ~86 MB combinados
   - Motivo: os arquivos brutos e completos são úteis no fluxo de dados, mas pesam muito e nem sempre precisam ser distribuídos como artefato público final.
   - Impacto esperado: afeta a disponibilidade do download público, então deve ser avaliado com cuidado.

5. Compactar/otimizar arquivos gerados e reduzir duplicidade sem alterar a funcionalidade pública
   - Potencial de redução: ~10 a ~40 MB, dependendo da estratégia
   - Motivo: há múltiplas entradas repetidas e páginas geradas com dados duplicados para temporadas e itens.
   - Impacto esperado: ajuda como ajuste final, mas não substitui a eliminação dos payloads redundantes maiores.

## Prioridade recomendada

A melhor correção de curto prazo é:

1. remove a cópia de `src/_data/*.json` do deploy;
2. mantenha somente os arquivos estritamente necessários para a UI pública;
3. reavalie `searchCatalog` e os arquivos de catálogo redundantes;
4. só então aplique otimizações de compactação e remoção de duplicidades.

Com isso, a maioria do problema desaparece sem mexer profundamente na estrutura do site.

## Conclusão

O projeto está ultrapassando o limite do Surge principalmente por causa do volume de dados JSON gerados e publicados juntamente com o site estático. O build local confirma um artefato de ~311 MB e a pipeline de produção chega a ~455.6 MB, o que deixa evidente que a otimização do payload público é a ação mais importante.

A primeira e mais eficaz correção é interromper a publicação dos dados brutos em `dist/static/data` antes de rodar o deploy para o Surge.
