const api_url = 'https://swapi.dev/api/'

// gets initial directory data
async function getDirectory(api_url) {
  const response = await fetch(api_url)
  const data = await response.json()
  createDirectory(data)
}
getDirectory(api_url)

// creates the directory response in the DOM
function createDirectory(data) {
  let directory = document.getElementById("directory")
  // displays category options from API data response wrapped in a tags
  Object.keys(data).map(data => directory.innerHTML += `<a href="#" id="${data}">${data}<br></a>`)
  categoryEventListeners()
}

function categoryEventListeners() {
  const atags = document.querySelectorAll("a")
  atags.forEach((tag) => {
    tag.addEventListener("click", () => {
      let category_api_url = api_url + tag.id
      getCategories(category_api_url,tag.id)
    })
  })
}



async function getCategories(api_url,categoryName) {
  const response = await fetch(api_url)
  const data = await response.json()
  displayCategoryOptions(data,categoryName)
}

function buttonsEventListeners(data,category) {
  let page = 0
  if(data.previous===null) {
    page = 1
  } else if (data.next === null) {
    page = Math.ceil(data.count/10)
  } else {
    page = data.next[data.next.length-1] - 1
  }
  let categoryInfo = document.getElementById("categoryInfo")
  categoryInfo.innerHTML += 
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


function displayCategoryOptions(data,category) {
  let categoryInfo = document.getElementById("categoryInfo")
  categoryInfo.innerHTML = `<hr><header><strong>${category}</strong></header>` // insert next and prev buttons here
  let options = data.results
  


  

  // display initial page options in <a> tags
  let optionName = ''
  options.forEach((option) => {
    (category !== 'films') ? optionName = option.name : optionName = option.title // all but films use .name
    categoryInfo.innerHTML += `<a href="#" class="category_option" name="${option.url}">${optionName}</a><br>`
  })
  
  // give <a> tags on click function event listeners
  const atags = document.querySelectorAll("a[class=\"category_option\"]")
  atags.forEach((tag) => {
    tag.addEventListener("click", () => {
    })
  })


  // give event listeners
  buttonsEventListeners(data,category)
}

// async function getCategory(api_url,categoryName) {
//   const response = await fetch(api_url)
//   const data = await response.json()
//   createCategory(data,categoryName)
// }

// function createCategory(categoryData, categoryName) {
//   const next = categoryData.next
//   const prev = categoryData.previous
//   let category = Object.values(categoryData.results)

//   let categoryHost = document.getElementById("categoryInfo")
//   categoryHost.innerHTML = ''

//   category.forEach((item,categoryNum) => {
//     let objectElement = categoryName+'-'+categoryNum
//     categoryHost.innerHTML += `<section id=${objectElement}></section>`
//     let sectionHost = document.querySelector(`section[id="${objectElement}"]`)

//     sectionHost.innerHTML += `<hr><ul id=${objectElement}-base>`
//     let itemUL = document.querySelector(`ul[id="${objectElement}-base"]`)
//       for(let key in item) {
//         if(categoryName != 'films') {
//           if (typeof item[key] === 'object' || item[key].includes('https')) {
//             getCategoryObject(objectElement,key,item[key])
//           } else if (key !== 'created' && key !== 'edited' && key !== 'url') {
//             itemUL.innerHTML += `<li id="${categoryName}" class="${key}">${key}: ${item[key]}</li>`
//           }
//         } else {
//           if (typeof item[key] === 'object') {
//             getCategoryObject(objectElement,key,item[key])
//           } else if (key !== 'created' && key !== 'edited' && key !== 'url') {
//             itemUL.innerHTML += `<li id="${categoryName}" class="${key}">${key}: ${item[key]}</li>`
//           }
//         }
//       }
//   })

  
// }

// function getCategoryObject(element_target,categoryPull,urls) {
//   let sectionHost = document.querySelector(`section[id="${element_target}"]`)
//   sectionHost.innerHTML +=  `<ul id=${element_target}-${categoryPull}>`
  
//   if (typeof urls === 'object') {
//     let urlTarget = `${element_target}-${categoryPull}`
//     let categorySection = document.querySelector(`ul[id="${urlTarget}"]`)
//     categorySection.innerHTML = `<strong>${categoryPull}</strong>`
//     try{
//       if (urls.length != 0) {
//         urls.forEach(url => {
//           getCategoryObjectSingle(urlTarget,categoryPull,url)
//         })
//       }
//     } catch (e) {
//       // .length produces error 'TypeError: Cannot read properties of null (reading 'length') for the null objects
//     }
//   } else if (categoryPull != 'url') {
//     let urlTarget = `${element_target}-${categoryPull}`
//     let categorySection = document.querySelector(`ul[id="${urlTarget}"]`)
//     categorySection.innerHTML = `<strong>${categoryPull}</strong>`
//     getCategoryObjectSingle(urlTarget,categoryPull,urls)
//   }
// }

// async function getCategoryObjectSingle(element_target,categoryPull,urls) {
//   const response = await fetch(urls)
//   const data = await response.json()
//   createCategoryObjectSingle(element_target,categoryPull,data)
// } 

// function createCategoryObjectSingle(element_target,categoryPull,data) {
//   if (categoryPull === 'films') {
//     let categoryHost = document.getElementById(`${element_target}`)
//     categoryHost.innerHTML += `<li><a href="#">${data.title}</a></li>`
//   }else {
//     let categoryHost = document.getElementById(`${element_target}`)
//     categoryHost.innerHTML += `<li><a href="#">${data.name}</a></li>`
//   }
// }