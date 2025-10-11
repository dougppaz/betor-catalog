import items from './_data/items.json'

const fetch = async (request, env, ctx) => {
  return new Response(JSON.stringify(items, null, 2))
}

export default { fetch }
