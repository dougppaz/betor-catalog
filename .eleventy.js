const { simpleHash } = require('./src/utils')

module.exports = eleventyConfig => {
  eleventyConfig.addPassthroughCopy('src/static')

  eleventyConfig.addFilter('itemUrl', item => {
    const idsValue = `${item.imdb_id}-${item.tmdb_id}`
    const idsHash = simpleHash(idsValue)
    return `/${item.item_type}/${idsHash}/`
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
