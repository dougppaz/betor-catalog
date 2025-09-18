const { simpleHash } = require('./src/utils')
const slugify = require('slugify')

module.exports = eleventyConfig => {
  eleventyConfig.addPassthroughCopy('src/static')

  eleventyConfig.addFilter('itemUrl', item => {
    const idsValue = `${item.imdb_id}-${item.tmdb_id}`
    const idsHash = simpleHash(idsValue)
    const slug = slugify(item.info?.title || item.info?.name || '', {lower: true, trim: true, strict: true})
    return `/${item.item_type}/${idsHash}-${slug}/`
  })

  eleventyConfig.addFilter('itemTitle', item => (item.info?.title || item.info?.name))

  eleventyConfig.addFilter('providerName', slug => {
    if (slug === "comando-torrents") return "Comando"
    if (slug === "bludv") return "BLUDV"
    if (slug === "torrent-dos-filmes") return "Torrent dos Filmes"
    return slug
  })

  return {
    dir: { input: 'src', output: 'dist' }
  }
}
