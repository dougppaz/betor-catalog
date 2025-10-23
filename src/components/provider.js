import { providerName } from '../fns.js'

export default (item, provider) => (`
  <div class="provider">
    <div class="header">
      <div class="name">${providerName(provider.slug)} <span class="languages">[${provider.languages.join('/')}]</span></div>
      <div class="actions">
        <a href="${provider.url}" target="_blank" class="url">🔗</a>
        <span class="collapse">➕</span>
      </div>
    </div>
  </div>
`)
