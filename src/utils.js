import slugify from 'slugify'

export const itemUrl = item => {
  const idsValue = [item.imdb_id, item.tmdb_id].filter(v => (!!v)).join('-')
  const slug = slugify(item.info?.title || item.info?.name || '', { lower: true, trim: true, strict: true })
  return `/${item.item_type}/${idsValue}-${slug}/`
}

export const itemPosterURL = item => (item.info?.poster_path ? `https://image.tmdb.org/t/p/w300${item.info?.poster_path}` : 'https://placehold.co/300x450?text=Betor')

export const itemTitle = item => (item.info?.title || item.info?.name)
