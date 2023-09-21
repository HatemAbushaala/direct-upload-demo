

module.exports = async function () {

  // return [
  //   { "name": "Bulbasaur" },
  //   { "name": "Ivysaur" },
  //   { "name": "Venusaur" }
  // ]
    // TODO change it to strapi server
  const result = await fetch('https://d257-85-108-196-38.ngrok.io/api/all-pages');
  const allPages = await result.json()
  return allPages.flatMap(p=>{
    return p.pages.map(sp=>({...sp,path:`${p.slug}/${sp.id}`}))
  })
};