import renderBase from '../base.js'

const dataDomain = (process.env.DATA_DOMAIN || 'catalogo-data.betor.top').replace(/^https?:\/\//, '').replace(/\/$/, '')
const dataBaseUrl = `https://${dataDomain}`

export default () => renderBase({
  title: 'Baixar Dados - Catálogo BeTor',
  content: `
    <section>
      <h1>Baixar Dados</h1>
      <p>BeTor tem como um dos objetivos democratizar e simplificar o acesso aos dados, inclusive, incentiva a criação de novas soluções baseado neles. Por isso, fica disponível nessa página os dados estruturados utilizados para renderizar todo o catálogo.</p>
      <ul>
        <li><a href="${dataBaseUrl}/items.json" target="_blank">items.json</a> - todos os torrents disponíveis, conteúdo bruto do BeTor.</li>
        <li><a href="${dataBaseUrl}/catalog.json" target="_blank">catalog.json</a> - todos os filmes e séries disponíveis, enriquecidos com TMDb.</li>
      </ul>
    </section>
  `
})
