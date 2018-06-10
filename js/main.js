var mapData = new MapData();
var mainCanvas = new BuilderCanvas(document.getElementById("maincanvas"), mapData);
mainCanvas.redraw();
function onKeyDown(e) {
    if (e.key == " ")
        Input.viewDragging = true;
}
function onKeyUp(e) {
    if (e.key == " ")
        Input.viewDragging = false;
}
function onMouseMove(e) {
    Input.mousePos = mainCanvas.viewToPos(new Vertex(e.offsetX, e.offsetY));
    Input.mouseGridPos = mainCanvas.viewToGridPos(new Vertex(e.offsetX, e.offsetY));
    if (Input.viewDragging) {
        mainCanvas.viewOffset.x -= e.movementX;
        mainCanvas.viewOffset.y -= e.movementY;
        mainCanvas.redraw();
    }
}
function onMouseWheel(e) {
}
function onMouseDown(e) {
}
window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);
window.addEventListener("mousemove", onMouseMove);
window.addEventListener("mousewheel", onMouseWheel);
window.addEventListener("mousedown", onMouseDown);
//# sourceMappingURL=main.js.map