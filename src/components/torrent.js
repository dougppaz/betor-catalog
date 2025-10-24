import { formatBytes } from '../fns.js'

export default (item, provider, torrent) => (`
  <div
    class="torrent"
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
    ${torrent.torrent_files ? `data-torrent-files="${torrent.torrent_files.join(',')}"` : ''}
    data-torrent-num-peers="${torrent.torrent_num_peers}"
    data-torrent-num-seeds="${torrent.torrent_num_seeds}"
    data-torrent-inserted-at="${torrent.inserted_at}">
      <div class="name">🧲&emsp;${torrent.torrent_name}</div>
      <div class="size">${formatBytes(torrent.torrent_size)}</div>
    </div>
`)
