import renderPaginatedPage from './components/pages/paginated.js'

export default class TVs {
  data () {
    return {
      pagination: {
        data: 'tvs',
        size: 20,
        alias: 'item'
      },
      permalink: ({ pagination }) => {
        if (pagination.pageNumber > 0) {
          return `series/page/${pagination.pageNumber + 1}/index.html`
        }
        return 'series/index.html'
      }
    }
  }

  render ({ pagination }) {
    return renderPaginatedPage(pagination, 'Catálogo Betor Séries')
  }
}
