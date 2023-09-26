const fs = require('node:fs').promises
const axios = require('axios')

compatibility_flags = [ "nodejs_compat" ]


module.exports = async function () {

  console.log('env',typeof env,process.env.API_HOST)
  const BASE_URL = process.env.API_HOST ?? 'http://127.0.0.1:1337'
  const response = await axios.get(`${BASE_URL}/api/all-pages`);
  const allPages = response.data
  const res =  allPages.flatMap(p=>{
    return p.pages.map(sp=>({...sp,path:`${p.slug}/${sp.id}`}))
  })

  // remove html from response to make file size smaller
  const pages_without_html = allPages.map(p=>{
    return {
      id:p.id,
      slug:p.slug,
      name:p.name,
      sub_pages:p.pages.map(sp=>({id:sp.id,path:`${p.slug}/${sp.id}`}))
    }
  })

  // save file so we can read it from middleware instead of fetching data from strapi
  await fs.writeFile('./strapi-data.json',JSON.stringify(pages_without_html))

  return res
};