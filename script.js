const api_url = 'https://swapi.dev/api/'

// gets initial directory data
async function getDirectory(api_url) {
  let loader = document.getElementById("loader")
  loader.style.display = "block"

  const response = await fetch(api_url)
  const data = await response.json()

  loader.style.display = "none"

  await createDirectory(data)
  await categoryEventListeners()
}
getDirectory(api_url)

// displays the directory response in the DOM
function createDirectory(data) {
  let directory = document.getElementById("directory")
  // displays category options from API data response wrapped in a tags
  Object.keys(data).map(data => directory.innerHTML += `<a href="#" id="${data}">${data}<br></a>`)
  let directoryGrid = document.getElementById("directory")
  directoryGrid.classList.add("nav_as_directory")
}

// gives directory's <a> link categories an onclick event listener that triggers a data fetch from the SWAPI
function categoryEventListeners() {
  const atags = document.querySelectorAll("nav a")
  atags.forEach((tag) => {
    tag.addEventListener("click", () => {
      let category_api_url = api_url + tag.id
      getCategories(category_api_url, tag.id)
      let categoryInfo = document.getElementById("categoryInfo")
      categoryInfo.classList.remove("optionDisplay")
      categoryInfo.classList.add("categoryDisplay")
    })
  })
}

// fetches the initial set of selectable options belonging to the selected category from the directory
async function getCategories(api_url, categoryName) {


  let directoryGrid = document.getElementById("directory")
  directoryGrid.classList.remove("nav_as_directory")
  directoryGrid.classList.add("nav_as_nav")

  let loader = document.getElementById("loader")
  loader.style.display = "block"
  const response = await fetch(api_url)
  const data = await response.json()

  loader.style.display = "none"
  displayCategoryOptions(data, categoryName)

  let linkedOptionsDiv = document.getElementById("linkedOptions")
  linkedOptionsDiv.style.display = "none"
}

// displays selectable options from the SWAPI fetched data
function displayCategoryOptions(data, category) {
  let categoryInfo = document.getElementById("categoryInfo")
  // Displays chosen category in a header 
  categoryInfo.innerHTML = `
  <div id="basicCategoryData">  
  <h3 id="displayHeader">${category}</h3>
  <section></section>
  </div>
  <div id="linkedOptions"></div>` // insert next and prev buttons here
  let dataDisplay = document.querySelector("main div section")
  // add category options to HTML in <a> tags
  let options = data.results
  let optionName = ''
  options.forEach((option) => {
    // all but films use .name
    (category !== 'films') ? optionName = option.name : optionName = option.title
    dataDisplay.innerHTML += `<a href="#" class="category_option" name="${option.url}">${optionName}</a><br>`
  })
  
  
  // gives event listeners
  displayCategoryTraversal(data, category)
  
  // give <a> tags on click function event listeners
  let elementOptions = document.querySelectorAll("a[class=\"category_option\"]")
  elementOptions.innerHTML = ''
  elementOptions.forEach(option => {
    option.addEventListener("click", () => {
      getOption(option.name)
    })
  
  })
}

// displays next and previous buttons to traverse sets of a category's available options to choose from
function displayCategoryTraversal(data, category) {
  let page = 0
  if (data.previous === null) { page = 1 }
  else if (data.next === null) { page = Math.ceil(data.count / 10) }
  else { page = data.next[data.next.length - 1] - 1 }

  let dataDisplay = document.querySelector("main")
  dataDisplay.innerHTML +=
    `<div id="categoryTraversal">
  <button name="${data.previous}">🢀 previous</button>
  <label id="page">page: ${page}</label>
  <button name="${data.next}">next 🢂</button>
  </div>`

  let categoryTraversalButtons = document.querySelectorAll("button")
  categoryTraversalButtons.forEach((button) => {
    if (button.name === 'null') {
      button.disabled = true
    } else {
      button.addEventListener("click", () => {
        getCategories(button.name, category)
      })
    }
  })
}

// gets option data when selected by user
async function getOption(option_url) {
  const response = await fetch(option_url)
  const data = await response.json()
  displayOptionData(data)
  let linkedOptionsDiv = document.getElementById("linkedOptions")
  linkedOptionsDiv.style.display = "grid"
}

// displays option's data // remove css class
function displayOptionData(data) {
  let categoryInfo = document.getElementById("categoryInfo")
  categoryInfo.classList.remove("categoryDisplay")
  categoryInfo.classList.add("optionDisplay")


  let traversalNav = document.getElementById("categoryTraversal")
  traversalNav.style.display = "none"

  let linkedOptionsClear = document.getElementById("linkedOptions")
  linkedOptionsClear.innerHTML = ''
  
  let optionAttributes = Object.keys(data)
  let attributeValues = Object.values(data)


  let dataHeader = document.getElementById("displayHeader")
  let dataDisplayWrapper = document.querySelector("main section")
  dataDisplayWrapper.innerHTML = `<ul id="optionData"></ul>`
  let baseDataDisplay = document.querySelector("main section ul")
  attributeValues.forEach((value, key) => {
    let keyName = optionAttributes[key]

    if (keyName === 'name') {
      dataHeader.innerHTML = `<strong>${data.name}</strong>`
    }
    else if (keyName === 'title') {
      dataHeader.innerHTML = `<strong>${data.title}</strong>`
    }
    else if (keyName != 'url') {
      if (typeof value === 'object' && value.length != 0) {
        value.forEach((link) => {
          getOptionLinkedOptions(keyName, link)
        })
      } else if (typeof value === 'string' && value.includes('https')) {
        getOptionLinkedOptions(keyName, value)
        // loader.style.display = "none"
      } else {
        if (value.length != 0 && keyName !== 'created' && keyName !== 'edited')
          baseDataDisplay.innerHTML += `<li><strong>${keyName.replace("_"," ")}</strong>: ${value}</li>`
      }
    }
  })
}

async function getOptionLinkedOptions(keyName, value) {
  let loader = document.getElementById("loader")
  loader.style.display = "block"
  const response = await fetch(value)
  const data = await response.json()
  await displayOptionLinkedOptions(keyName, data)
  await getLinkedOption(data.url)

}

function displayOptionLinkedOptions(keyName, data) {
  let displayArea = document.getElementById("linkedOptions")
  let categoryOptionsSection = document.querySelector(`main section ul#${keyName}`)
  if (typeof data.name !== 'string') { optionName = data.title } else { optionName = data.name }
  // if categoryOptionsSection is null, create categoryOptionsSection, append to if exists
  if (categoryOptionsSection === null) {
    displayArea.innerHTML += `
    <section>
      <h4>${keyName}</h4>
      <ul id="${keyName}">
        <li><a href="#" name="${data.url}">${optionName}</a></li>
      </ul>
    </section>`
  } else {
    categoryOptionsSection.innerHTML += `<li><a href="#" name="${data.url}">${optionName}</a></li>`
  }
}


// gets option data when selected by user
async function getLinkedOption(option_url) {
  const response = await fetch(option_url)
  const data = await response.json()
  // let displayArea = document.getElementById("linkedOptions")
  await displayLinkedOptionData(data, option_url)


}

function displayLinkedOptionData(data, url) {
  let linkedObject = document.querySelectorAll(`a[name="${url}"]`)
  let target = linkedObject[0]
  target.addEventListener("click", () => { displayOptionData(data) 
  })
  let loader = document.getElementById("loader")
  loader.style.display = "none"
}