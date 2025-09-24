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

  eleventyConfig.addFilter('itemPosterURL', item => (item.info?.poster_path ? `https://image.tmdb.org/t/p/w300${item.info?.poster_path}` : 'https://placehold.co/300x450?text=Betor'))

  eleventyConfig.addFilter('formatBytes', (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  })

  return {
    dir: { input: 'src', output: 'dist' }
  }
}
