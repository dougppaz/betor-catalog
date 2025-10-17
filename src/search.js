import Fuse from 'fuse.js'
import { itemUrl, itemPosterURL, itemTitle } from './utils.js'
import items from './_data/items.json'

const fuse = new Fuse(items, {
  keys: [
    'info.title',
    'info.original_title'
  ],
  threshold: 0.2
})

const torrentTags = item => (item.providers.map(provider => provider.torrents.map(torrent => `<span
  class="hidden"
  data-item
  data-item-type="${item.item_type}"
  data-item-imdb-id="${item.imdb_id}"
  data-item-tmdb-id="${item.tmdb_id}"
  data-item-last-updated="${item.last_updated}"
  data-provider
  data-provider-url="${provider.url}"
  data-torrent
  data-torrent-name="${torrent.torrent_name}"
  data-torrent-magnet-uri="${torrent.magnet_uri}"
  data-torrent-languages="${torrent.languages.join(',')}"
  data-torrent-size="${torrent.torrent_size}"
  data-torrent-num-peers="${torrent.torrent_num_peers}"
  data-torrent-num-seeds="${torrent.torrent_num_seeds}"
  data-torrent-inserted-at="${torrent.inserted_at}" />`)).flat().join('\n'))

const fetch = async (request, env, ctx) => {
  const url = new URL(request.url)
  const q = url.searchParams.get('q')
  if (!q) {
    return new Response(null, { status: 404 })
  }
  const results = fuse.search(q)
  const items = results.map(({ item, ...data }) => (`<div class="item">
    <a href="${itemUrl(item)}">
      <div class="poster"><img src="${itemPosterURL(item)}" /></div>
      <p class="title">${itemTitle(item)}</p>
      ${torrentTags(item)}
    </a>
  </div>`)).join('\n')
  return new Response(`<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Busca "${q}" - Catálogo Betor</title>
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
  <main>
    <div class="items">
      ${items}
    </div>
  </main>
  <footer>
    <p><strong>Contato/Dúvidas:</strong> douglas@dgls.me</p>
    <p><a href="https://github.com/dougppaz/betor-catalog" target="_blank">Github</a></p>
  </footer>
</body>
</html>`, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
}

export default { fetch }
