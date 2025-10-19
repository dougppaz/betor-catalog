const utils = require('./src/utils.js')

module.exports = eleventyConfig => {
  eleventyConfig.addPassthroughCopy('src/static')

  eleventyConfig.addFilter('itemUrl', utils.itemUrl)

  eleventyConfig.addFilter('itemTitle', utils.itemTitle)

  eleventyConfig.addFilter('providerName', slug => {
    if (slug === "comando-torrents") return "Comando"
    if (slug === "bludv") return "BLUDV"
    if (slug === "torrent-dos-filmes") return "Torrent dos Filmes"
    if (slug === "starck-filmes") return "Starck Filmes"
    return slug
  })

  eleventyConfig.addFilter('itemPosterURL', utils.itemPosterURL)

  eleventyConfig.addFilter('formatBytes', (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  })

  eleventyConfig.addFilter('toLocaleString', (value) => {
    const date = new Date(value)
    return date.toLocaleString('pt-br', { timeZone: 'America/Sao_Paulo' })
  })

  return {
    dir: { input: 'src', output: 'dist' }
  }
}
