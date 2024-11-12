let gameWindow = document.getElementById("gameWindow")
let gameWindowContent = document.getElementById("gameWindowContent")

function setContentDimensions() {
  let contentElements = gameWindowContent.children
  let furthestHorizontal = 0;
  let furthestVertical = 0;
  for (i = 0; i < contentElements.length; i++) {
    let lastPixelHorizontal = contentElements[i].offsetLeft + contentElements[i].offsetWidth
    let lastPixelVertical = contentElements[i].offsetTop + contentElements[i].offsetHeight
    furthestHorizontal = Math.max(furthestHorizontal, lastPixelHorizontal)
    furthestVertical = Math.max(furthestVertical, lastPixelVertical)
  }

  gameWindowContent.style.width = furthestHorizontal + "px"
  gameWindowContent.style.height = furthestVertical + "px"
}

let fillStyle = "#fff"
function drawRect(x, y, width, height) {
  let newElement = document.createElement("div")
  newElement.style = `position: absolute; left: ${x}px; top: ${y}px; width: ${width}px; height: ${height}px; background: ${fillStyle};`
  gameWindowContent.appendChild(newElement)

  setContentDimensions()
}
function drawText(text, x, y, size, font) {
  ctx.font = `${size}px ${font}`;
  ctx.fillText(text, x, y);

  setContentDimensions()
}

let currentArea = "Spawn"
const AREA_DIMENSIONS = {
  Spawn: { w: 1000, h: 1000 },
  Meadow: { w: 1200, h: 900 }
}

// let areaGrid = [];
// for (x = 0; x < (AREA_DIMENSIONS[currentArea].w / 50); x++) {
//   areaGrid.push([]);
//   areaGrid[x].push([x*50, (x+1) * 50 - 1])
//   for (y = 0; y < (AREA_DIMENSIONS[currentArea].h / 50); y++) {
//     areaGrid[x].push([y*50, (y+1) * 50 - 1]);
//   }
// }
// function getStartingPoint(x, y) {
//   let realY = areaGrid[y][0][0]
//   let realX = areaGrid[y][x+1][0]
//   console.log(realX, realY)
// }
// function drawGridRect(x, y, width, height) {
//   ctx.fillStyle = "#000"
//   let realY = areaGrid[y][0][0]
//   let realX = areaGrid[y][x+1][0]
//   let realWidth = (width * 50)
//   let realHeight = (height * 50)

//   drawRect(realX, realY, realWidth, realHeight)
// }

function renderArea() {
  fillStyle = `url(${Areas[currentArea].surfaceImage})`;
  drawRect(100, 100, AREA_DIMENSIONS[currentArea].w, AREA_DIMENSIONS[currentArea].h)
}
function renderAreaWalls() {
  let areaWalls = [
    [0, 0, AREA_DIMENSIONS[currentArea].w + 200, 100],
    [AREA_DIMENSIONS[currentArea].w + 100, 100, 100, AREA_DIMENSIONS[currentArea].h],
    [0, AREA_DIMENSIONS[currentArea].h + 100, AREA_DIMENSIONS[currentArea].w + 200, 100],
    [0, 100, 100, AREA_DIMENSIONS[currentArea].h]
  ]

  fillStyle = "url(assets/resources/cobblestone.png)";
  areaWalls.forEach((element) => {
    drawRect(element[0], element[1], element[2], element[3])
  })
}

function renderCrystals(area) {
  for (let currentCrystal in Areas[area][activeCrystals]) {

  }
}
