async function start() {
  const response = await fetch("https://swapi.dev/api/")
  const data = await response.json()
  createDirectory(data)
}

start()

function createDirectory(data) {
  let directory = document.getElementById("directory")

  console.log('create dir function called from start')
  console.log('data', Object.keys(data))
  Object.keys(data).map((data) => {
    directory.innerHTML += `
      <a href="#" id="${data}">
      ${data}<br>
      </a>
      `
  })
}

