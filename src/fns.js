import slugify from 'slugify'

export const itemUrl = item => {
  const idsValue = [item.imdb_id, item.tmdb_id].filter(v => (!!v)).join('-')
  const slug = slugify(item.info?.title || item.info?.name || '', { lower: true, trim: true, strict: true })
  return `/${item.item_type}/${idsValue}-${slug}/`
}

export const itemPosterURL = item => (item.info?.poster_path ? `https://image.tmdb.org/t/p/w300${item.info?.poster_path}` : 'https://placehold.co/300x450?text=Betor')

export const itemTitle = item => (item.info?.title || item.info?.name)

export const providerName = slug => {
  if (slug === 'comando-torrents') return 'Comando'
  if (slug === 'bludv') return 'BLUDV'
  if (slug === 'torrent-dos-filmes') return 'Torrent dos Filmes'
  if (slug === 'starck-filmes') return 'Starck Filmes'
  return slug
}

export const formatBytes = (bytes, decimals = 2) => {
  if (!+bytes) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export const toLocaleString = value => {
  const date = new Date(value)
  return date.toLocaleString('pt-br', { timeZone: 'America/Sao_Paulo' })
}
