const fs = require('node:fs').promises

export async function onRequest(context) {
    const res = await fs.readFile('./strapi-data.json','utf8')
    return new Response(res)
  }