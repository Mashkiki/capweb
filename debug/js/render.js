let gameWindow = document.getElementById("gameWindow");
let ctx = gameWindow.getContext("2d");

function drawRect(x, y, width, height) {
  ctx.fillRect(x, y, width, height);
}
function drawText(text, x, y, size, font) {
  ctx.font = `${size}px ${font}`;
  ctx.fillText(text, x, y);
}

let currentArea = "Spawn"
const AREA_DIMENSIONS = {
  Spawn: {w: 1000, h: 1000},
  Meadow: {w: 1200, h: 900}
}
function renderArea() {
  let areaSurfaceImage = document.getElementById(currentArea.toLowerCase() + "SurfaceImage")
  let areaSurfacePattern = ctx.createPattern(areaSurfaceImage, "repeat");
  ctx.fillStyle = areaSurfacePattern;
  drawRect(0, 0, AREA_DIMENSIONS[currentArea].w, AREA_DIMENSIONS[currentArea].h)
}

let cobblestonePattern = ctx.createPattern(document.getElementById("cobblestoneImage"), "repeat",)
function renderAreaWalls() {
  let areaWalls = [
    [-100, -100, AREA_DIMENSIONS[currentArea].w + 200, 100],
    [AREA_DIMENSIONS[currentArea].w, 0, 100, AREA_DIMENSIONS[currentArea].h],
    [-100, AREA_DIMENSIONS[currentArea].h, AREA_DIMENSIONS[currentArea].w + 200, 100],
    [-100, 0, 100, AREA_DIMENSIONS[currentArea].h]
  ]

  ctx.fillStyle = cobblestonePattern;
  areaWalls.forEach((element) => {
    drawRect(element[0], element[1], element[2], element[3])
  })
}

function renderCrystals(area) {
  for (let currentCrystal in Areas[area][activeCrystals]) {

  }
}

let areaPanningBounds = {
  x: {min: 500, max: -AREA_DIMENSIONS[currentArea].w},
  y: {min: 1000, max: (-AREA_DIMENSIONS[currentArea].w + 500)}
}
