const api_url = 'https://swapi.dev/api/'

// gets initial directory data
async function getDirectory(api_url) {
  const response = await fetch(api_url)
  const data = await response.json()
  createDirectory(data)
}
getDirectory(api_url)

// displays the directory response in the DOM
function createDirectory(data) {
  let directory = document.getElementById("directory")
  // displays category options from API data response wrapped in a tags
  Object.keys(data).map(data => directory.innerHTML += `<a href="#" id="${data}">${data}<br></a>`)
  categoryEventListeners()
}

// gives directory's <a> link categories an onclick event listener that triggers a data fetch from the SWAPI
function categoryEventListeners() {
  const atags = document.querySelectorAll("nav a")
  atags.forEach((tag) => {
    tag.addEventListener("click", () => {
      let category_api_url = api_url + tag.id
      getCategories(category_api_url,tag.id)
    })
  })
}

// fetches the initial set of selectable options belonging to the selected category from the directory
async function getCategories(api_url,categoryName) {
  const response = await fetch(api_url)
  const data = await response.json()
  displayCategoryOptions(data,categoryName)
}

// displays selectable options from the SWAPI fetched data
function displayCategoryOptions(data,category) {
  let categoryInfo = document.getElementById("categoryInfo")
  // Displays chosen category in a header 
  categoryInfo.innerHTML = `<hr><h3 id="displayHeader">${category}</h3><section></section>` // insert next and prev buttons here
  let dataDisplay = document.querySelector("main section")
  // add category options to HTML in <a> tags
  let options = data.results
  let optionName = ''
  options.forEach((option) => {
    // all but films use .name
    (category !== 'films') ? optionName = option.name : optionName = option.title 
    dataDisplay.innerHTML += `<a href="#" class="category_option" name="${option.url}">${optionName}</a><br>`
  })
  
  // gives event listeners
  displayCategoryTraversal(data,category)

  // give <a> tags on click function event listeners
  let elementOptions = document.querySelectorAll("a[class=\"category_option\"]")
  elementOptions.forEach(option => {
    option.addEventListener("click", () => { 
      getOption(option.name)
    })
  })
}

// displays next and previous buttons to traverse sets of a category's available options to choose from
function displayCategoryTraversal(data,category) {
  let page = 0
  if(data.previous === null) {page = 1} 
  else if (data.next === null) {page = Math.ceil(data.count/10)} 
  else {page = data.next[data.next.length-1] - 1}

  let dataDisplay = document.querySelector("main section")
  dataDisplay.innerHTML += 
  `<div id="categoryTraversal">
  <button name="${data.previous}">previous</button>
  <label id="page">page: ${page}</label>
  <button name="${data.next}">next</button>
  </div>`

  let categoryTraversalButtons = document.querySelectorAll("button")
  categoryTraversalButtons.forEach((button) => { 
    if (button.name === 'null') {
      button.disabled = true
    } else {
      button.addEventListener("click", () => { 
        getCategories(button.name,category)
      })
    }
  })
}

// gets option data when selected by user
async function getOption(option_url) {
  const response = await fetch(option_url)
  const data = await response.json()
  displayOptionData(data)
}

// displays option's data
function displayOptionData(data) {
  let optionAttributes = Object.keys(data)
  let attributeValues = Object.values(data)
  

  let dataHeader = document.getElementById("displayHeader")

  let dataDisplayWrapper = document.querySelector("main section")
  dataDisplayWrapper.innerHTML = `<ul id="optionData"></ul>`
  let baseDataDisplay = document.querySelector("main section ul")

  attributeValues.forEach((value,key) => {
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
          getOptionLinkedOptions(keyName,link)
        })      
      } else if (typeof value === 'string' && value.includes('https')) {
          getOptionLinkedOptions(keyName,value)
      } else {
          if (value.length != 0 && keyName !== 'created' && keyName !== 'edited') 
          baseDataDisplay.innerHTML += `<li>${keyName}: ${value}</li>`
      }
    }
  })
}

async function getOptionLinkedOptions(keyName,value) {
    const response = await fetch(value)
    const data = await response.json()

    // function to display option's single linked option 
    displayOptionLinkedOptions(keyName,data)
  }

function displayOptionLinkedOptions(keyName,data) {
  let displayArea = document.getElementById("categoryInfo")
  let categoryOptionsSection = document.querySelector(`main section ul#${keyName}`)
  let optionName = ''
  if (typeof data.name !== 'string') {optionName = data.title} else {optionName = data.name}
  
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
