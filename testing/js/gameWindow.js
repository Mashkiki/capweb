renderArea()
renderAreaWalls()

let cameraOffset = {
  x: gameWindow.scrollLeftMax,
  y: gameWindow.scrollTopMax,
};
let cameraZoom = 1;
const MAX_ZOOM = 5;
const MIN_ZOOM = 0.1;
const SCROLL_SENSITIVITY = 0.0005;

function windowLoop() {
  gameWindowContent.style.transform = `scale(${cameraZoom})`
  gameWindow.scrollLeft = gameWindow.scrollLeftMax - cameraOffset.x
  gameWindow.scrollTop = gameWindow.scrollTopMax - cameraOffset.y

  requestAnimationFrame(windowLoop)
}

function getEventLocation(e) {
  return { x: e.clientX, y: e.clientY };
}

let isDragging = false;
let dragStart = { x: 0, y: 0 };

function onPointerDown(e) {
  isDragging = true;
  dragStart.x = getEventLocation(e).x - cameraOffset.x;
  dragStart.y = getEventLocation(e).y - cameraOffset.y;
}
function onPointerUp(e) {
  isDragging = false;
}
function onPointerMove(e) {
  if (isDragging) {
    cameraOffset.x = getEventLocation(e).x - dragStart.x;
    cameraOffset.x = Math.min(Math.max(cameraOffset.x, Math.max(gameWindowContent.offsetWidth - gameWindowContent.offsetWidth * cameraZoom, 0)), gameWindow.scrollLeftMax);

    cameraOffset.y = getEventLocation(e).y - dragStart.y;
    cameraOffset.y = Math.min(Math.max(cameraOffset.y, Math.max(gameWindowContent.offsetHeight - gameWindowContent.offsetHeight * cameraZoom, 0)), gameWindow.scrollTopMax);
  }
}
function adjustZoom(zoomAmount, zoomFactor) {
  if (!isDragging) {
    if (zoomAmount) {
      cameraZoom -= zoomAmount;
    } else if (zoomFactor) {
      cameraZoom = zoomFactor * lastZoom;
    }

    cameraZoom = Math.min(cameraZoom, MAX_ZOOM);
    cameraZoom = Math.max(cameraZoom, MIN_ZOOM);
  }
}

gameWindow.addEventListener("mousedown", onPointerDown);
gameWindow.addEventListener("mouseup", onPointerUp);
gameWindow.addEventListener("mousemove", onPointerMove);
gameWindow.addEventListener("wheel", (e) =>
  adjustZoom(e.deltaY * SCROLL_SENSITIVITY),
);

windowLoop()
