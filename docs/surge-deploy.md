# Deploy com Surge

Este projeto usa o Surge em dois domínios independentes:

- `catalogo.betor.top` para o site público
- `catalogo-data.betor.top` para os dados públicos em JSON

## Como publicar

O Surge publica uma pasta estática por vez. A forma básica é:

```bash
npx surge ./pasta exemplo.com
```

Na primeira publicação, o Surge grava o domínio em um arquivo `CNAME` dentro da pasta publicada. Depois disso, novas publicações podem reaproveitar o mesmo destino.

## Separação entre site e dados

Para evitar o limite de tamanho do Surge no site principal, o deploy foi dividido em dois artefatos:

1. `deploy/site` contém apenas o site do catálogo.
2. `deploy/data` contém os JSONs públicos consumidos pela página de download.

Isso permite publicar o catálogo sem carregar os arquivos grandes de dados junto com o site principal.

## Comandos usados na pipeline

```bash
npx surge deploy/site catalogo.betor.top --token "$SURGE_TOKEN"
npx surge deploy/data catalogo-data.betor.top --token "$SURGE_TOKEN"
```

## Observações

- O Surge suporta domínios customizados e subdomínios como projetos independentes.
- Se o domínio já estiver configurado no provedor DNS, basta publicar a pasta correta para o domínio correto.
- A documentação oficial do Surge descreve a publicação de um diretório estático e o uso de domínios customizados em `surge.sh/docs/getting-started` e `surge.sh/docs/platform/custom-domains`.
