import parse from '../parse.js'

export async function onRequest({request,env,next}) {
    const start = performance.now()
    const BASE_URL = env.API_HOST
    const STRAPI_PAGE_REQUEST_URL =`${BASE_URL}/api/pages`

    const url = new URL(request.url);
    const pathname = url.pathname.slice(1) // note that path starts with: /
    
    // workaround to skip nested path
    if(pathname === 'data.json' || pathname.includes('/')) return await next()

    const main_page = await fetchSubPages(env,pathname)

    // check if page not found
    if(!main_page || main_page.error) return new Response('Not found',{status:404})

    const sub_pages = main_page.pages
    // Determine which group this requester is in.
    const cookie = parse(request.headers.get("Cookie") || "");
    const sub_page_id_cookie = cookie[pathname] // id of sub page || null
    if(sub_page_id_cookie){
      const user_previous_visited_page = sub_pages.find(
            (sub_page) => sub_page.id == sub_page_id_cookie
      )
      // check if page is still exist in the database
      if(user_previous_visited_page) {
        return env.ASSETS.fetch(`${env.CF_PAGES_URL}/${main_page.slug}/${user_previous_visited_page.id}`)
        // const response = await fetch(`${env.CF_PAGES_URL}/${main_page.slug}/${user_previous_visited_page.id}/index.html`)
        // console.log('time after finish fetch static page',performance.now() - start)
        // return response
      }
      // return new Response(user_previous_visited_page.html,{
      //   headers:{
      //     'content-type':'text/html'
      //   }
      // }) 
      
    //   return Response.redirect(getCFPageUrl(pathname,user_previous_visited_page.id), 301);

    }

    const random_page_index = Math.floor(Math.random() * sub_pages.length);
    const random_page = sub_pages[random_page_index]
    // const response = await fetch(`${env.CF_PAGES_URL}/${main_page.slug}/${random_page.id}/index.html`)

       // get the static file from ASSETS, and attach a cookie
    const asset = await env.ASSETS.fetch(`${env.CF_PAGES_URL}/${main_page.slug}/${random_page.id}`)
    let response = new Response(asset.body, asset)
    response.headers.append("Set-Cookie", `${pathname}=${random_page.id}; path=/`)
    return response

    // return new Response(response.body,{
    //   headers:{
    //     // 'content-type':'text/html',
    //     "Set-Cookie":`${pathname}=${random_page.id}; path=/`
    //   }
    // }) 
    // return Response.redirect(getCFPageUrl(pathname,random_page.id), 301);

  }


  async function fetchSubPages(env,pathname){
    const response = await env.ASSETS.fetch(`${env.CF_PAGES_URL}/data.json`)
    const pages_json = await response.json()
    return pages_json?.find(p=>p.slug === pathname)
    //// old code to fetch from strapi
    // const sub_pages = await fetch(`${requestUrl}/${pathname}`)
    // return sub_pages.json()
  }
  function getCFPageUrl(main_page_slug,sub_page_id){
    return `https://direct-upload-demo-10q.pages.dev/${main_page_slug}/${sub_page_id}`
  }