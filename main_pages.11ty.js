// njk template
/* 
---
pagination:
  data: main_pages
  size: 1
  alias: detail
permalink: '{{ detail.path }}/index.html'
---
<h1>{{ detail.html }}</h1> */


class BuildStaticPages {
  data() {
    return {
      pagination:{
        data: 'main_pages',
        size: 1,
        alias: 'detail'
      },
      permalink: ({detail}) => {
        return `${detail.path}/index.html`
      }
    };
  }

  render(data) { 
    console.log(data.detail)
    return data.detail.html
  }
}

module.exports = BuildStaticPages;