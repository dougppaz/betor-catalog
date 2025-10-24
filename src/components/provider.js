import { providerName } from '../fns.js'
import renderTorrent from './torrent.js'

export default (item, provider) => {
  const languagesTag = provider.languages.length > 0
    ? `<span class="languages">[${provider.languages.join('/')}]</span>`
    : ''
  return `
    <div class="provider">
      <div class="header">
        <div class="name">${providerName(provider.slug)} ${languagesTag}</div>
        <div class="actions">
          <a href="${provider.url}" target="_blank" class="url">🔗</a>
        </div>
      </div>
      <div class="torrents">
        ${provider.torrents.map(renderTorrent.bind(null, item, provider)).join('')}
      </div>
    </div>
  `
}
