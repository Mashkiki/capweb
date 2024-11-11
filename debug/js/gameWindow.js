let gameWindow = document.getElementById("gameWindow");
let ctx = gameWindow.getContext("2d");

let cameraOffset = {
  x: gameWindow.offsetWidth / 2,
  y: gameWindow.offsetHeight / 2,
};
let cameraZoom = 1;
const MAX_ZOOM = 5;
const MIN_ZOOM = 0.1;
const SCROLL_SENSITIVITY = 0.0005;

let cobblestonePattern = ctx.createPattern(
  document.getElementById("cobblestoneImage"),
  "repeat",
);
let spawnGrassPattern = ctx.createPattern(
  document.getElementById("spawnGrassImage"),
  "repeat",
);

function draw() {
  gameWindow.width = gameWindow.offsetWidth;
  gameWindow.height = gameWindow.offsetHeight;

  ctx.translate(gameWindow.offsetWidth / 2, gameWindow.offsetHeight / 2);
  ctx.scale(cameraZoom, cameraZoom);
  ctx.translate(
    -gameWindow.offsetWidth / 2 + cameraOffset.x,
    -gameWindow.offsetHeight + cameraOffset.y,
  );
  ctx.clearRect(0, 0, gameWindow.offsetWidth, gameWindow.offsetHeight);

  ctx.fillStyle = cobblestonePattern;
  drawRect(-100500, 0, 100000, 1000);
  drawRect(500, 0, 100000, 1000);
  drawRect(-100500, -100000, 201000, 100000);
  drawRect(-100500, 1000, 201000, 100000);
  ctx.fillStyle = spawnGrassPattern;
  drawRect(-500, 0, 1000, 1000);

  requestAnimationFrame(draw);
}
function drawRect(x, y, width, height) {
  ctx.fillRect(x, y, width, height);
}
function drawText(text, x, y, size, font) {
  ctx.font = `${size}px ${font}`;
  ctx.fillText(text, x, y);
}

function getEventLocation(e) {
  if (e.touches && e.touches.length == 1) {
    return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  } else if (e.clientX && e.clientY) {
    return { x: e.clientX, y: e.clientY };
  }
}

let isDragging = false;
let dragStart = { x: 0, y: 0 };

function onPointerDown(e) {
  isDragging = true;
  dragStart.x = getEventLocation(e).x / cameraZoom - cameraOffset.x;
  dragStart.y = getEventLocation(e).y / cameraZoom - cameraOffset.y;
}
function onPointerUp(e) {
  isDragging = false;
  initialPinchDistance = null;
  lastZoom = cameraZoom;
}
function onPointerMove(e) {
  if (isDragging) {
    cameraOffset.x = getEventLocation(e).x / cameraZoom - dragStart.x;
    cameraOffset.y = getEventLocation(e).y / cameraZoom - dragStart.y;
  }
}
function handleTouch(e, singleTouchHandler) {
  if (e.touches.length == 1) {
    singleTouchHandler(e);
  } else if (e.type == "touchmove" && e.touches.length == 2) {
    isDragging = false;
    handlePinch(e);
  }
}

let initialPinchDistance = null;
let lastZoom = cameraZoom;

function handlePinch(e) {
  e.preventDefault();

  let touch1 = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  let touch2 = { x: e.touches[1].clientX, y: e.touches[1].clientY };

  // This is distance squared, but no need for an expensive sqrt as it's only used in ratio
  let currentDistance = (touch1.x - touch2.x) ** 2 + (touch1.y - touch2.y) ** 2;

  if (initialPinchDistance == null) {
    initialPinchDistance = currentDistance;
  } else {
    adjustZoom(null, currentDistance / initialPinchDistance);
  }
}

function adjustZoom(zoomAmount, zoomFactor) {
  if (!isDragging) {
    if (zoomAmount) {
      cameraZoom -= zoomAmount;
    } else if (zoomFactor) {
      console.log(zoomFactor);
      cameraZoom = zoomFactor * lastZoom;
    }

    cameraZoom = Math.min(cameraZoom, MAX_ZOOM);
    cameraZoom = Math.max(cameraZoom, MIN_ZOOM);

    console.log(zoomAmount);
  }
}

gameWindow.addEventListener("mousedown", onPointerDown);
gameWindow.addEventListener("touchstart", (e) => handleTouch(e, onPointerDown));
gameWindow.addEventListener("mouseup", onPointerUp);
gameWindow.addEventListener("touchend", (e) => handleTouch(e, onPointerUp));
gameWindow.addEventListener("mousemove", onPointerMove);
gameWindow.addEventListener("touchmove", (e) => handleTouch(e, onPointerMove));
gameWindow.addEventListener("wheel", (e) =>
  adjustZoom(e.deltaY * SCROLL_SENSITIVITY),
);

// Ready, set, go
draw();
