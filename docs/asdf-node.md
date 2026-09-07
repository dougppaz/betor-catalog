# Node.js com asdf-vm

Este projeto foi validado com Node.js 22.19.0, que é a mesma versão usada pela GitHub Actions deste repositório.

## Instalação do asdf

Se ainda não estiver instalado:

```bash
# macOS (Homebrew)
brew install asdf
```

Em seguida, adicione ao shell:

```bash
echo -e '\n. $(brew --prefix asdf)/libexec/asdf.sh' >> ~/.zshrc
source ~/.zshrc
```

> A documentação oficial do asdf recomenda verificar a configuração do shell e reiniciar o terminal após a instalação.

## Instalar e configurar o plugin do Node.js

```bash
asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git
asdf install nodejs 22.19.0
asdf set nodejs 22.19.0
```

Isso cria ou atualiza o arquivo `.tool-versions` no diretório do projeto com o conteúdo:

```text
nodejs 22.19.0
```

Se quiser fixar globalmente em seu ambiente:

```bash
asdf set -u nodejs 22.19.0
```

## Verificar

```bash
node -v
npm -v
```

Saída esperada:

```text
v22.19.0
```

## Observações importantes

- A versão do asdf neste ambiente atual teve um bug de shim em um terminal específico, então o build de validação foi executado com o runtime Node 22.19.0 diretamente quando necessário.
- O arquivo `.tool-versions` deve ser versionado no repositório para manter a versão do Node reproduzível em todas as máquinas.
- Para uso em CI, a GitHub Actions usa `actions/setup-node` com `node-version: 22`, equivalente ao ambiente alvo do projeto.
