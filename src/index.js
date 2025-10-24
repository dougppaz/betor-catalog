import fs from 'fs'
import { Eleventy } from '@11ty/eleventy'
import PQueue from 'p-queue'

const ITEMS_PATH = 'src/_data/items.json'
const MOVIES_PATH = 'src/_data/movies.json'
const TVS_PATH = 'src/_data/tvs.json'
const ITEMS_GROUP_BY_IMDB_ID_PATH = 'src/_data/itemsByImdbId.json'
const ITEMS_GROUP_BY_IMDB_ID_AND_SEASON_PATH = 'src/_data/itemsByImdbIdAndSeason.json'
const ITEMS_GROUP_BY_TMDB_ID_PATH = 'src/_data/itemsByTmdbId.json'

class BetorCatalog {
  constructor (options) {
    this.options = options
    this.env = {
      tmdbApiKey: process.env.TMDB_API_KEY
    }
    this.enrichQueue = new PQueue({ intervalCap: 2, interval: 1000 })
  }

  async buildItems () {
    console.log('building items data...')
    const items = await this.fetchCatalogItems()
    console.log(`${items.length} catalog items found`)
    const uniqueItems = this.removeDuplicateItems(items)
    const enrichedItems = await this.enrichItems(uniqueItems)
    this.write(ITEMS_PATH, enrichedItems)
    this.write(MOVIES_PATH, enrichedItems.filter(({ item_type: itemType }) => (itemType === 'movie')))
    this.write(TVS_PATH, enrichedItems.filter(({ item_type: itemType }) => (itemType === 'tv')))
    const itemsByImdb = await this.groupBy(enrichedItems, 'imdb_id')
    this.write(ITEMS_GROUP_BY_IMDB_ID_PATH, itemsByImdb)
    const itemsByImdbAndSeason = await this.groupBySeason(enrichedItems, 'imdb_id')
    this.write(ITEMS_GROUP_BY_IMDB_ID_AND_SEASON_PATH, itemsByImdbAndSeason)
    const itemsByTmdb = await this.groupBy(enrichedItems, 'tmdb_id')
    this.write(ITEMS_GROUP_BY_TMDB_ID_PATH, itemsByTmdb)
  }

  async fetchCatalogItems (page = 1, items = []) {
    const url = `${this.options.betorApiUrl}/v1/catalog/?size=100&page=${page}`
    console.log(`fetching catalog page ${page}: ${url}`)
    const res = await fetch(url, {
      headers: this.options.betorApiAuthorization ? { Authorization: `Basic ${this.options.betorApiAuthorization}` } : {}
    })
    if (!res.ok) {
      throw new Error(`Error to fetch page ${page}: ${res.status}`)
    }
    const data = await res.json()
    if (!data.items || !Array.isArray(data.items)) {
      throw new Error('Unexpected body!')
    }
    const newItems = [...items, ...data.items]
    if (page >= data.pages) {
      return newItems
    }
    return this.fetchCatalogItems(page + 1, newItems)
  }

  async enrichItems (items) {
    let i = 0
    return Promise.all(items.map(item => this.enrichQueue.add(() => {
      i++
      console.log(`[${i}/${items.length}]`)
      return this.enrichItem(item)
    })))
  }

  async enrichItem (item) {
    if (item.imdb_id) {
      return await this.enrichItemFromImdb(item)
    }
    if (item.tmdb_id) {
      return await this.enrichItemFromTmdb(item)
    }
    return item
  }

  async enrichItemFromImdb (item) {
    const url = `https://api.themoviedb.org/3/find/${item.imdb_id}?external_source=imdb_id&language=pt-BR`
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${this.env.tmdbApiKey}`
      }
    }
    console.log(`fetching from tmdb imdb_id:${item.imdb_id} data: ${url}`)
    const res = await fetch(url, options)
    if (!res.ok) {
      throw new Error(`Error to fetch ${url}: ${res.status}`)
    }
    const findData = await res.json()
    if (item.item_type === 'movie' && !findData.movie_results) {
      throw new Error(`Movie not found at TMDB with imdb_id ${item.imdb_id}`)
    }
    if (item.item_type === 'tv' && !findData.tv_results) {
      throw new Error(`TV Show not found at TMDB with imdb_id ${item.imdb_id}`)
    }
    const itemInfo = (item.item_type === 'movie' && findData.movie_results[0]) || (item.item_type === 'tv' && findData.tv_results[0])
    return {
      info: itemInfo,
      ...item
    }
  }

  async enrichItemFromTmdb (item) {
    const url = `https://api.themoviedb.org/3/${item.item_type}/${item.tmdb_id}?language=pt-BR`
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${this.env.tmdbApiKey}`
      }
    }
    console.log(`fetching from tmdb tmdb_id:${item.tmdb_id} data: ${url}`)
    const res = await this.tmdbApiQueue.add(() => fetch(url, options))
    if (!res.ok) {
      throw new Error(`Error to fetch ${url}: ${res.status}`)
    }
    const itemInfo = await res.json()
    return {
      info: itemInfo,
      ...item
    }
  }

  removeDuplicateItems (items) {
    const ks = []
    return items.filter(item => {
      const k = `${item.imdb_id}-${item.tmdb_id}-${item.item_type}`
      if (ks.includes(k)) {
        return false
      }
      ks.push(k)
      return true
    })
  }

  groupBy (items, attr) {
    const groups = {}
    items.forEach(item => {
      if (!Object.keys(groups).includes(item[attr])) {
        groups[item[attr]] = []
      }
      groups[item[attr]].push(item)
    })
    return Object.keys(groups).map(k => ({ key: k, items: groups[k] }))
  }

  itemSeason (item, season) {
    const newItem = structuredClone(item)
    newItem.providers = newItem.providers
      .map(provider => ({
        ...provider,
        torrents: provider.torrents.filter(t => t.seasons.includes(season))
      }))
      .filter(provider => provider.torrents.length > 0)
    return newItem
  }

  groupBySeason (items, attr) {
    const groups = {}
    items.forEach(item => {
      const seasons = [
        ...new Set(item.providers.flatMap(p => p.torrents).flatMap(t => t.seasons))
      ]
      seasons.forEach(season => {
        const key = [item[attr], season].join('|')
        if (!Object.keys(groups).includes(key)) {
          groups[key] = []
        }
        groups[key].push(this.itemSeason(item, season))
      })
    })
    return Object.keys(groups).map(v => {
      const [k, season] = v.split('|', 2)
      return { key: k, season, items: groups[v] }
    })
  }

  write (path, items) {
    fs.writeFileSync(path, JSON.stringify(items, null, 2))
  }

  async serve () {
    const elev = new Eleventy()
    await elev.init()
    await elev.watch()
    await elev.serve()
  }

  async build () {
    const elev = new Eleventy()
    await elev.init()
    await elev.write()
  }
}

export default BetorCatalog
