let gameWindow = document.getElementById("gameWindow")
let gameWindowContent = document.getElementById("gameWindowContent")

let fillStyle = "#fff"
function getRandomColor() {
  return `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`
}
function drawRect(x, y, width, height) {
  let newElement = document.createElement("div")
  newElement.style = `position: absolute; left: ${x}px; top: ${y}px; width: ${width}px; height: ${height}px; background: ${fillStyle};`

  return newElement
}
function drawText(text, size) {
  let textElement = document.createElement("p")
  textElement.innerText = text
  textElement.style.fontSize = `${size}px`
  return textElement
}

let currentArea = "Spawn"
const AREA_DIMENSIONS = {
  Spawn: { w: 1000, h: 1000 },
  Meadow: { w: 1200, h: 900 }
}

let areaGrids = new Object();
for (let area in AREA_DIMENSIONS) {
  areaGrids[area] = new Array()
  for (x = 0; x < (AREA_DIMENSIONS[area].w / 50); x++) {
    areaGrids[area].push(new Array());
    for (y = 0; y < (AREA_DIMENSIONS[area].h / 50); y++) {
      areaGrids[area][x].push({occupied: false});
    }
  }
}

function createAreaElement() {
  let areaElement = document.createElement("div")
  areaElement.id = currentArea
  gameWindowContent.appendChild(areaElement)
  Areas[currentArea].loaded = true
}
function renderArea() {
  fillStyle = `url(${Areas[currentArea].surfaceImage})`;
  let areaSurface = drawRect(100, 100, AREA_DIMENSIONS[currentArea].w, AREA_DIMENSIONS[currentArea].h)
  areaSurface.id = currentArea.toLowerCase() + "Surface"
  areaSurface.style.display = "grid"
  areaSurface.style.gridTemplateRows = `repeat(${areaGrids[currentArea][0].length}, 50px)`
  areaSurface.style.gridTemplateColumns = `repeat(${areaGrids[currentArea].length}, 50px)`
  let areaElement = document.getElementById(currentArea)
  areaElement.appendChild(areaSurface)
}
function renderAreaWalls() {
  let areaWalls = [
    [0, 0, AREA_DIMENSIONS[currentArea].w + 200, 100],
    [AREA_DIMENSIONS[currentArea].w + 100, 100, 100, AREA_DIMENSIONS[currentArea].h],
    [0, AREA_DIMENSIONS[currentArea].h + 100, AREA_DIMENSIONS[currentArea].w + 200, 100],
    [0, 100, 100, AREA_DIMENSIONS[currentArea].h]
  ]
  let areaElement = document.getElementById(currentArea)

  fillStyle = "url(assets/resources/cobblestone.png)";
  areaWalls.forEach((element) => {
    let wall = drawRect(element[0], element[1], element[2], element[3])
    areaElement.appendChild(wall)
  })
}

function createCrystalElement(rowStart, columnStart, rowEnd, columnEnd) {
  let crystalElement = document.createElement("div")
  crystalElement.style.gridArea = `${rowStart} / ${columnStart} / ${rowEnd} / ${columnEnd}`
  crystalElement.style.background = fillStyle
  crystalElement.style.backgroundSize = "contain"
  crystalElement.style.backgroundRepeat = "no-repeat"
  return crystalElement
}
function createCrystalPetAmountElement(crystalObject) {
  // let petAmount = crystalObject["attackedBy"].length
  let petAmountText = drawText("", crystalSizes[crystalObject.size].height * 20)
  petAmountText.classList.add("fredoka")
  petAmountText.classList.add("white-text")
  petAmountText.classList.add("black-text-outline")
  let crystalElement = document.getElementById(`${crystalObject.area}x${crystalObject.gridCoordinates.x}y${crystalObject.gridCoordinates.y}`)
  crystalElement.appendChild(petAmountText)
}
function growAnimation(crystal, element) {
  let animationTime = crystalSizes[crystal.size].height * 0.5
  element.style.backgroundPosition = `0 ${crystalSizes[crystal.size].height * 50}px`
  element.style.transition = `background-position ${animationTime}s ease`
  setTimeout(() => {element.style.backgroundPosition = `0 0`}, 100)
}
function renderCrystal(crystal) {
  fillStyle = `url(${crystalImages[crystal.size]})`
  let rendered = false
  let maxAttempts = 6 * (Areas[crystal.area].activeCrystals.length + 1)

  let crystalWidth = crystalSizes[crystal.size].width
  let crystalHeight = crystalSizes[crystal.size].height
  if (Areas[crystal.area].activeCrystals.includes(crystal)) {
    console.error("Tried rendering a crystal that is already active (big no no).\nError code: 14");
    return rendered;
  }

  let randomColumn = 0
  let randomRow = 0
  renderLoop: while (rendered == false && maxAttempts >= 0) {
    randomColumn = Math.floor(Math.random() * (areaGrids[crystal.area].length)) + 1
    randomRow = Math.floor(Math.random() * areaGrids[crystal.area][0].length) + 1
    if ((randomColumn + crystalWidth > areaGrids[crystal.area].length + 1) || (randomRow + crystalHeight > areaGrids[crystal.area][0].length + 1)) {
      // Crystal tried rendering outside area bounds, retrying render.
      maxAttempts -= 1
      continue renderLoop
    }
    for (x = 0; x < crystalWidth; x++) {
      for (y = 0; y < crystalHeight; y++) {
        if (areaGrids[crystal.area][randomColumn - 1 + x][randomRow - 1 + y].occupied == true) {
          // Crystal tried rendering inside one of area's occupied parts, retrying render.
          maxAttempts -= 1
          continue renderLoop
        }
      }
    }
    rendered = true
  }
  if (!rendered) {
    console.log("Failed to find a valid place to render crystal. Finishing.")
    return rendered;
  }

  for (x = 0; x < crystalWidth; x++) {
    for (y = 0; y < crystalHeight; y++) {
      areaGrids[crystal.area][randomColumn - 1 + x][randomRow - 1 + y].occupied = true
    }
  }
  let crystalElement = createCrystalElement(randomRow, randomColumn, randomRow + crystalHeight, randomColumn + crystalWidth)
  crystalElement.id = `${crystal.area}x${randomColumn}y${randomRow}`
  crystalElement.className = "crystal"
  crystal.gridCoordinates.x = randomColumn
  crystal.gridCoordinates.y = randomRow
  crystalElement.style.filter = areaCrystalFilter[crystal.area]
  growAnimation(crystal, crystalElement)
  document.getElementById(crystal.area.toLowerCase() + "Surface").appendChild(crystalElement)
  createCrystalPetAmountElement(crystal)
  return rendered;
}
