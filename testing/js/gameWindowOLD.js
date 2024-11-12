let cameraOffset = {
  x: gameWindow.offsetWidth / 2 - 500,
  y: gameWindow.offsetHeight / 2 - 150,
};
let cameraZoom = 0.75;
const MAX_ZOOM = 5;
const MIN_ZOOM = 0.1;
const SCROLL_SENSITIVITY = 0.0005;

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

  renderAreaWalls()
  renderArea()

  requestAnimationFrame(draw);
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
    cameraOffset.x = Math.min(cameraOffset.x, areaPanningBounds.x.min);
    cameraOffset.x = Math.max(cameraOffset.x, areaPanningBounds.x.max);

    cameraOffset.y = getEventLocation(e).y / cameraZoom - dragStart.y;
    cameraOffset.y = Math.min(cameraOffset.y, areaPanningBounds.y.min);
    cameraOffset.y = Math.max(cameraOffset.y, areaPanningBounds.y.max);
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
