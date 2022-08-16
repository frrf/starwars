const api_url = "https://www.swapi.tech/api/";

const getLinks = (api_url) => {
  fetch(api_url)
    .then((data) => data.json())
    .then((data) => directory(data))
}

const directory = (data) => {
  let result = data.result
  let categories = Object.keys(result)
  
  categories.forEach(category => {
    // console.log(x)
    document.body.innerHTML += `<a id="${category}" href="#">${category}</a><br>`
  })
  forwardLink()
}

getLinks(api_url)

const forwardGetLinks = (api_url) => {
  fetch(api_url)
    .then((data) => data.json())
    .then((data) => selectCategory(data))
}

// const getObject = (object_url) => { 
//   fetch(object_url).then((data) => data.json()).then((data) => console.log(data))
// }

// const getName = (object_url) => {
//   fetch(object_url).then((data) => data.json()).then((data) => {return data})
//   let result = x.result
//   console.log('getname', x)
//   let entityName = result.properties
  
//   console.log('-- entityName values',entityName)
//   return `<p>${entityName}</p>`
// }

const selectCategory = (data) => {
  let result_var = Object.keys(data)[Object.keys(data).length-1] // accounts for films, uses result vs results
  let result = data[result_var] // grabs 'results' or 'result' for films
  let entityNames = Object.values(result)
  
  console.log('-- chosen category values',entityNames)

  document.body.innerHTML = ''

  result_var === 'results' 
  ? entityNames.forEach(x => { 
    document.body.innerHTML += `<p id="${x.uid}">${x.name}</p>`}) 
  : entityNames.forEach(x => { 
    document.body.innerHTML += `<h4 id="${x.uid}">${x.properties.title}</h4>`
    // document.body.innerHTML += `<p>${getName(x.properties.characters[0])}</p>`//x.properties.characters
  }) 
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
