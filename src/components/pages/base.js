export default (content, { title, q } = {}) => (`<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title || 'Catálogo Betor'}</title>
  <link rel="stylesheet" href="/static/styles.css">
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-DB54CJJ7SK"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-DB54CJJ7SK');
  </script>
</head>
<body>
  <header>
    <div class="content">
      <h1><a href="/">🎬 Catálogo Betor</a></h1>
    </div>
  </header>
  <div class="prowlarr-bar">
    <p>Utilize com o Prowlarr, baixe o nosso <a href="/static/catalogo-betor.yml" target="_black">Prowlarr Cardigann YML Definition</a></p>
  </div>
  <div class="search">
    <p>Buscar:</p>
    <form action="/search/">
      <div class="field"><input name="q" required ${q ? `value="${q}"` : ''} /></div>
      <div class="submit"><button type="submit">🔍</button></div>
    </form>
  </div>
  <main>${content}</main>
  <footer>
    <p><strong>Contato/Dúvidas:</strong> douglas@dgls.me</p>
    <p><a href="https://github.com/dougppaz/betor-catalog" target="_blank">Github</a></p>
  </footer>
</body>
</html>`)
