function startGame() {
  currentArea = "Spawn"
  createAreaElement()
  renderArea()
  renderAreaWalls()
}

function createCrystal(area) {
  let newCrystal = generateCrystalObject(area)
  if (!newCrystal) {
    return
  }
  let crystalRender = renderCrystal(newCrystal)
  if (crystalRender) {
    Areas[area]["activeCrystals"].push(newCrystal);
    return crystalRender
  }
  console.error("Couldn't create crystal due to previous errors.\nError code: 15")
  return crystalRender
}
function createCrystalsForArea(chosenArea) {
  let result = createCrystal(chosenArea)
  if (result) {
    setTimeout(() => {createCrystalsForArea(chosenArea)}, 1500)
  }
}

let previousAreaButton = document.querySelector("#previousAreaButton")
let changeAreaButton = document.querySelector("#changeAreaButton")
let changeAreaButtonText = changeAreaButton.querySelector("h2")
console.log
let nextAreaButton = document.querySelector("#nextAreaButton")
function areaControlButtonStatusUpdate() {
  let currentChangeArea = changeAreaButton.getAttribute("data-area")
  if (currentChangeArea == 0) {
    previousAreaButton.className = "area-button-disabled"
    nextAreaButton.className = "area-button-enabled"
  } else if (currentChangeArea == areaArray.length - 1) {
    previousAreaButton.className = "area-button-enabled"
    nextAreaButton.className = "area-button-disabled"
  } else {
    previousAreaButton.className = "area-button-enabled"
    nextAreaButton.className = "area-button-enabled"
  }
  if (areaArray[currentChangeArea] == currentArea) {
    changeAreaButton.className = "area-button-disabled"
  } else {
    changeAreaButton.className = "area-button-enabled"
  }
  if (player.unlocked_areas.includes(areaArray[currentChangeArea])) {
    changeAreaButtonText.innerText = `${currentChangeArea}: ${areaArray[currentChangeArea]}`
  } else {
    changeAreaButtonText.innerText = `${currentChangeArea}: Locked`
    changeAreaButton.className = "area-button-disabled"
  }
}
function nextChangeArea() {
  if (nextAreaButton.className == "area-button-disabled") {
    // Can't go further with areas
    return
  }
  let currentChangeArea = changeAreaButton.getAttribute("data-area")
  changeAreaButton.setAttribute("data-area", parseInt(currentChangeArea) + 1)

  areaControlButtonStatusUpdate()
}
nextAreaButton.addEventListener("click", nextChangeArea)
function previousChangeArea() {
  if (previousAreaButton.className == "area-button-disabled") {
    // Can't go earlier with areas
    return
  }
  let currentChangeArea = changeAreaButton.getAttribute("data-area")
  changeAreaButton.setAttribute("data-area", parseInt(currentChangeArea) - 1)

  areaControlButtonStatusUpdate()
}
previousAreaButton.addEventListener("click", previousChangeArea)
function clickChangeArea() {
  if (changeAreaButton.className == "area-button-disabled") {
    // Can't change to current area
    return
  }
  let currentChangeArea = changeAreaButton.getAttribute("data-area")
  changeArea(areaArray[currentChangeArea])

  areaControlButtonStatusUpdate()
}
changeAreaButton.addEventListener("click", clickChangeArea)

function changeArea(newArea) {
  if (document.getElementById(newArea)) {
    document.getElementById(currentArea).style.display = "none"
    currentArea = newArea
    document.getElementById(newArea).style.display = "block"
    return
  }
  document.getElementById(currentArea).style.display = "none"
  currentArea = newArea
  createAreaElement()
  renderArea()
  renderAreaWalls()
  createCrystalsForArea(newArea)
}

startGame()
