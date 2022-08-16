// api url
const api_url = "https://www.swapi.tech/api/";

const getLinks = (api_url) => {
  fetch(api_url)
    .then((data) => data.json())
    .then((data) => directory(data))
}


const directory = (data) => {
  let result = data.result
  let categories = Object.keys(result)
  let links = Object.values(result)
  
  categories.forEach(x => {
    console.log(x)
    document.body.innerHTML += `<a id="${x}" href="#">${x}</a><br>`
  })
  forwardLink()
}

getLinks(api_url)

const forwardGetLinks = (api_url) => {
  fetch(api_url)
    .then((data) => data.json())
    .then((data) => page(data))
}


const page = (data) => {
  let result_var = Object.keys(data)[Object.keys(data).length-1] // accounts for films, uses result vs results
  let result = data[result_var]

  let entityNames = Object.values(result)
  
  console.log('page',entityNames)
  document.body.innerHTML = ''

  result_var === 'results' 
  ? entityNames.forEach(x => { document.body.innerHTML += `<p id="${x.uid}">${x.name}</p>` }) 
  : entityNames.forEach(x => { document.body.innerHTML += `<p id="${x.uid}">${x.properties.title}</p>` }) 
  

  


}

// adds event listener to directory a tags, makes new get request based on user selection
function forwardLink() {
  const atags = document.querySelectorAll("a")

  atags.forEach(tag => {
    tag.addEventListener("click", () => {
      let forward_api_url = api_url+tag.id
      console.log('-- directory',tag.id)
      forwardGetLinks(forward_api_url)
    })
  })
}
