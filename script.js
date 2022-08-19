const api_url = 'https://swapi.dev/api/'

async function start(api_url) {
  const response = await fetch(api_url)
  const data = await response.json()
  createDirectory(data)
}

start(api_url)

function createDirectory(data) {
  let directory = document.getElementById("directory")

  // console.log('create dir function called from start')
  // console.log('data', Object.keys(data))
  Object.keys(data).map((data) => {
    directory.innerHTML += `
      <a href="#" id="${data}">
      ${data}<br>
      </a>
      `
  })
  
  const atags = document.querySelectorAll("a")
  atags.forEach((tag) => {
    tag.addEventListener("click", () => {
      // console.log('-- directory',tag.id)
      let category_api_url = api_url+tag.id
       getCategory(category_api_url)
    })
  })

}

async function getCategory(api_url) {
  // console.log(api_url)
  const response = await fetch(api_url)
  const data = await response.json()
  // console.log('get cat',data)
  createCategory(data)
}

function createCategory(categoryData) {
  console.log(categoryData)
}