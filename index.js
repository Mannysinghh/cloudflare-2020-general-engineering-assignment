addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Respond to the request
 * @param {Request} request
 */


let links = [
      {
         "name":"Linkedin",
         "url":"https://www.linkedin.com/in/maninder8855"
      },
      {
         "name":"Github",
         "url":"https://www.github.com/mannysinghh"
      },
      {
         "name":"CloudFlare",
         "url":"https://www.cloudflare.com"
      }
   ]


let socialLinks = [
      {
         "href":"https://linkedin.com/in/maninder8855",
         "src":"https://simpleicons.org/icons/linkedin.svg"
      },
      {
         "href":"https://github.com/mannysinghh",
         "src":"https://simpleicons.org/icons/github.svg"
      },
      {
         "href":"https://cloudflare.com",
         "src":"https://simpleicons.org/icons/cloudflare.svg"
      }
]
class LinksTransformer {
  constructor(links) {
    this.links = links
  }
  
  async element(element) {
    // Your code
    for (let i = 0; i < this.links.length; i ++) {
      element.append(
        '<a href="' + this.links[i].url + '">' + this.links[i].name + '</a>',
        new Object({ html: true })
      )
    }
  }
}

class setInnerContentTransformer {
  constructor(title) {
    this.title = title
  }
  async element(element) {
    // Your code
    element.setInnerContent(this.title)
  }
}

class setAttributeTransformer {
  constructor(attribute, value) {
    this.attribute = attribute
    this.value = value
  }
  async element(element) {
    // Your code
    element.setAttribute(this.attribute, this.value)
  }
}

class RemoveAttributeTransformer {
  constructor(attribute) {
    this.attribute = attribute
  }

  async element(element) {
    // Your code
    element.removeAttribute(this.attribute)
  }
}

class SocialLinkTransformer {
    constructor(socialLinks) {
    this.socialLinks = socialLinks
  }
  
  async element(element) {
    // Your code
    for (let i = 0; i < this.socialLinks.length; i ++) {
      element.append(
        '<a href="' + this.socialLinks[i].href + '"> <img src="' + this.socialLinks[i].src + '"></a>',
        new Object({ html: true })
      )
    }
  }
}


const rewriter = new HTMLRewriter()
  .on('h1#name', new setInnerContentTransformer('Maninder Singh'))
  .on('h2#welcome', new setInnerContentTransformer('welcome'))
  .on('title', new setInnerContentTransformer('Lots of Links'))
  .on('div#profile', new RemoveAttributeTransformer('style'))
  .on('div#links', new LinksTransformer(links))
  .on('img#avatar', new setAttributeTransformer('src', 'https://avatars0.githubusercontent.com/u/551550?s=460&u=1456bfbb7151d8443e7e77981700ce36d9fa8ed4&v=4'))
  .on('body', new setAttributeTransformer("class", "h-24 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500"))
  .on('div#social', new RemoveAttributeTransformer('style'))
  .on('div#social', new SocialLinkTransformer(socialLinks))


async function handleRequest(request) {
  
  if (request.url.endsWith('/links')) {
    const json = JSON.stringify(links)

    return new Response(json, {
      headers: { 'content-type': 'application/json;charset=UTF-8' },
    })
  } 
  else {
    const staticLink = 'https://static-links-page.signalnerve.workers.dev'
    const staticResp = await fetch(staticLink, {
      headers: { 'content-type': 'text/html' },
    })

    return rewriter.transform(staticResp)
  }
}


