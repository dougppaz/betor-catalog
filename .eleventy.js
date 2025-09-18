const { simpleHash } = require('./src/utils')

module.exports = eleventyConfig => {
  eleventyConfig.addPassthroughCopy('src/static')

  eleventyConfig.addFilter("itemUrl", item => {
    const idsValue = `${item.imdb_id}-${item.tmdb_id}`
    const idsHash = simpleHash(idsValue)
    return `/${item.item_type}/${idsHash}/`
  })

  return {
    dir: { input: 'src', output: 'dist' }
  }
}
