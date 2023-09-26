import fs from 'node:fs'

export async function onRequest(context) {
    const res = await fs.readFile('./strapi-data.json','utf8')
    return new Response(res)
  }