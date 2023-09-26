const axios = require('axios')

module.exports = async function () {
  const BASE_URL = process.env.API_HOST ?? 'http://127.0.0.1:1337'
  const response = await axios.get(`${BASE_URL}/api/all-pages`);
  
  // remove html from response to make file size smaller
  const pages_without_html = response.data.map(p=>{
    return {
      id:p.id,
      slug:p.slug,
      name:p.name,
      pages:p.pages.map(sp=>({id:sp.id,path:`${p.slug}/${sp.id}`}))
    }
  })

  return pages_without_html
};