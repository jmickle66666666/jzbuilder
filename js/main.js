var mapData = new MapData();
var mainCanvas = new BuilderCanvas(document.getElementById("maincanvas"), mapData);
mainCanvas.redraw();
var tempTexture = document.createElement("img");
tempTexture.src = "JZCRATE2.png";
var editMode = EditMode.LINE;
function finishDrawingSector() {
    Input.state = InputState.NONE;
    var newSector = new Sector(tempTexture);
    for (var i = 0; i < mainCanvas.drawingLines.length; i++) {
        newSector.lines.push(mainCanvas.drawingLines[i]);
    }
    newSector.invalidate();
    mapData.sectors.push(newSector);
    mainCanvas.drawingLines.length = 0;
    mainCanvas.redraw();
}
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
    if (Input.state == InputState.DRAWING) {
        mainCanvas.drawingLines[mainCanvas.drawingLines.length - 1].end = Input.mouseGridPos;
        mainCanvas.redraw();
    }
}
function onMouseWheel(e) {
    e.preventDefault();
    if (e.deltaY > 0)
        mainCanvas.zoom *= mainCanvas.ZOOM_SPEED;
    if (e.deltaY < 0)
        mainCanvas.zoom /= mainCanvas.ZOOM_SPEED;
    if (e.deltaY != 0)
        mainCanvas.redraw();
}
function onMouseDown(e) {
    e.preventDefault();
    if (e.button == 2) {
        if (editMode == EditMode.LINE) {
            if (Input.state == InputState.NONE) {
                Input.state = InputState.DRAWING;
                mainCanvas.drawingLines = new Array();
                mainCanvas.drawingLines.push(new Line(Input.mouseGridPos, Input.mouseGridPos));
                mainCanvas.redraw();
            }
        }
    }
    if (e.button == 0) {
        if (editMode == EditMode.LINE) {
            if (Input.state == InputState.DRAWING) {
                if (mainCanvas.drawingLines[0].start.equals(Input.mouseGridPos)) {
                    mainCanvas.drawingLines[mainCanvas.drawingLines.length - 1].end = Input.mouseGridPos;
                    finishDrawingSector();
                }
                else {
                    mainCanvas.drawingLines.push(new Line(Input.mouseGridPos, Input.mouseGridPos));
                }
            }
        }
    }
}
window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);
window.addEventListener("mousemove", onMouseMove);
window.addEventListener("mousewheel", onMouseWheel);
window.addEventListener("mousedown", onMouseDown);
//# sourceMappingURL=main.js.map