import parse from '../parse.js'

export async function onRequest({request,env,next}) {
    const BASE_URL = env.API_HOST
    const STRAPI_PAGE_REQUEST_URL =`${BASE_URL}/api/pages`

    const url = new URL(request.url);
    const pathname = url.pathname.slice(1) // note that path starts with: /
    
    console.log('url',url,'path',pathname)

    if(pathname === 'data.json') return await next()

    const sub_pages = await fetchSubPages(env.CF_PAGES_URL,pathname)
    // check if page not found
    if(!sub_pages || sub_pages.error) return new Response('Not found',{status:404})

    // Determine which group this requester is in.
    const cookie = parse(request.headers.get("Cookie") || "");
    const sub_page_id_cookie = cookie[pathname] // id of sub page || null
    if(sub_page_id_cookie){
      const user_previous_visited_page = sub_pages.find(
            (sub_page) => sub_page.id == sub_page_id_cookie
      )
      // check if page is still exist in the database
      if(user_previous_visited_page) 
      return new Response(user_previous_visited_page.html,{
        headers:{
          'content-type':'text/html'
        }
      }) 
      
    //   return Response.redirect(getCFPageUrl(pathname,user_previous_visited_page.id), 301);

    }

    const random_page_index = Math.floor(Math.random() * sub_pages.length);
    const random_page = sub_pages[random_page_index]
    return new Response(random_page.html,{
      headers:{
        'content-type':'text/html',
        "Set-Cookie":`${pathname}=${random_page.id}; path=/`
      }
    }) 
    // return Response.redirect(getCFPageUrl(pathname,random_page.id), 301);

  }


  async function fetchSubPages(requestUrl,pathname){
    const response = await fetch(`${requestUrl}/data.json`)
    const pages_json = await response.json()
    console.log('pages',pages_json)
    return pages_json?.find(p=>p.slug === pathname)

    //// old code to fetch from strapi
    // const sub_pages = await fetch(`${requestUrl}/${pathname}`)
    // return sub_pages.json()
  }
  function getCFPageUrl(main_page_slug,sub_page_id){
    return `https://direct-upload-demo-10q.pages.dev/${main_page_slug}/${sub_page_id}`
  }