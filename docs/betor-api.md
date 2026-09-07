# API BeTor

Este repositório usa a OpenAPI em [betor-openapi.json](betor-openapi.json) como fonte de verdade do contrato da API BeTor.

## O que este projeto consome

Hoje o fluxo de ingestão do catálogo usa o endpoint `GET /v1/admin/download-items/` para obter o dump bruto de itens antes de consolidar os dados locais.

## Arquivos importantes para contexto

- [README.md](../README.md) explica como usar o CLI e onde a API entra no fluxo do catálogo.
- [src/cli.js](../src/cli.js) define as flags `--betor-api-url` e `--betor-api-authorization`.
- [src/index.js](../src/index.js) contém a implementação de `dataFetchItems()` que chama `/v1/admin/download-items/`.
- [docs/betor-openapi.json](betor-openapi.json) descreve o contrato completo da API.

## Observações

- Se a API mudar, atualize primeiro a OpenAPI neste diretório.
- Este projeto não mantém uma segunda cópia do contrato em outro lugar; a documentação viva é esta OpenAPI.
