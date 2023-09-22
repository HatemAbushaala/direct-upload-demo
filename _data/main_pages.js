

module.exports = async function () {

  // return [
  //   { "name": "Bulbasaur" },
  //   { "name": "Ivysaur" },
  //   { "name": "Venusaur" }
  // ]
    // TODO change it to strapi server
  const result = await fetch('https://7f32-78-163-170-147.ngrok-free.app/api/all-pages');
  const allPages = await result.json()
  return allPages.flatMap(p=>{
    return p.pages.map(sp=>({...sp,path:`${p.slug}/${sp.id}`}))
  })
};