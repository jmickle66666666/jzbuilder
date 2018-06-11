var mapData = new MapData();
var mainCanvas = new BuilderCanvas(document.getElementById("maincanvas"), mapData);
mainCanvas.redraw();
var tempTexture = document.createElement("img");
tempTexture.src = "JZCRATE2.png";
var editMode = EditMode.LINE;
var vertexDragStart = null;
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
function finishDrawingLines() {
    Input.state = InputState.NONE;
    for (var i = 0; i < mainCanvas.drawingLines.length - 1; i++) {
        mapData.lines.push(mainCanvas.drawingLines[i]);
    }
    mainCanvas.drawingLines.length = 0;
    mainCanvas.redraw();
}
function clearSelection() {
    mainCanvas.selectedLines.length = 0;
    mainCanvas.redraw();
}
function cancelDrawing() {
    if (Input.state == InputState.DRAWING) {
        Input.state = InputState.NONE;
        mainCanvas.drawingLines.length = 0;
        mainCanvas.redraw();
    }
}
var extrudeStart = null;
var extrudeEnd = null;
var extrudePointStart = null;
function beginExtrude() {
    extrudeStart = mapData.getNearestLine(Input.mousePos);
    if (extrudeStart == null) {
        return;
    }
    Input.state = InputState.EXTRUDING;
    extrudePointStart = Input.mouseGridPos;
    extrudeEnd = new Line(extrudeStart.start, extrudeStart.end);
}
function updateExtrude() {
    extrudeEnd.start.x = extrudeStart.end.x + (Input.mouseGridPos.x - extrudePointStart.x);
    extrudeEnd.start.y = extrudeStart.end.y + (Input.mouseGridPos.y - extrudePointStart.y);
    extrudeEnd.end.x = extrudeStart.start.x + (Input.mouseGridPos.x - extrudePointStart.x);
    extrudeEnd.end.y = extrudeStart.start.y + (Input.mouseGridPos.y - extrudePointStart.y);
    mainCanvas.redraw();
}
function cancelExtrude() {
    if (Input.state == InputState.EXTRUDING) {
        Input.state = InputState.NONE;
        mainCanvas.redraw();
    }
}
function finishExtrude() {
    Input.state = InputState.NONE;
    var l1 = extrudeStart;
    var l2 = new Line(extrudeStart.end, extrudeEnd.start);
    var l3 = extrudeEnd;
    var l4 = new Line(extrudeEnd.end, extrudeStart.start);
    var newSector = new Sector(tempTexture);
    newSector.lines.push(l1);
    newSector.lines.push(l2);
    newSector.lines.push(l3);
    newSector.lines.push(l4);
    newSector.invalidate();
    mapData.sectors.push(newSector);
    mainCanvas.redraw();
}
function convexMerge() {
    var pts = [];
    for (var i = 0; i < mainCanvas.selectedLines.length; i++) {
        pts.push(mainCanvas.selectedLines[i].start);
        pts.push(mainCanvas.selectedLines[i].end);
    }
    var newSector = Sector.fromConvexPoints(pts, tempTexture);
    mapData.sectors.push(newSector);
    clearSelection();
}
function onKeyDown(e) {
    if (e.key == " ")
        Input.viewDragging = true;
    if (e.key == "e" && editMode == EditMode.LINE && Input.state == InputState.NONE) {
        beginExtrude();
    }
    if (e.key == "j") {
        convexMerge();
    }
    if (e.key == "Backspace" && e.ctrlKey) {
        if (editMode == EditMode.LINE) {
            if (mainCanvas.selectedLines.length == 0) {
                mapData.deleteLine(mainCanvas.highlightLine);
            }
            else {
                for (var i = 0; i < mainCanvas.selectedLines.length; i++) {
                    mapData.deleteLine(mainCanvas.selectedLines[i]);
                }
            }
        }
        if (editMode == EditMode.VERTEX) {
            mapData.deleteVertex(Input.mouseGridPos);
        }
        if (editMode == EditMode.SECTOR) {
            mapData.deleteSectorAt(Input.mousePos);
        }
        clearSelection();
        mainCanvas.redraw();
    }
    if (e.key == "c")
        clearSelection();
    if (e.key == "v")
        editMode = EditMode.VERTEX;
    if (e.key == "s")
        editMode = EditMode.SECTOR;
    if (e.key == "l")
        editMode = EditMode.LINE;
    if (e.key == "t")
        editMode = EditMode.THING;
    if (e.key == "[")
        mainCanvas.gridSize /= 2;
    if (e.key == "]")
        mainCanvas.gridSize *= 2;
    if (e.key == "Escape") {
        cancelDrawing();
        cancelExtrude();
    }
    if (e.key == "Enter") {
        finishDrawingLines();
    }
    mainCanvas.redraw();
}
function onKeyUp(e) {
    if (e.key == " ")
        Input.viewDragging = false;
}
function onMouseMove(e) {
    Input.mousePos = mainCanvas.viewToPos(new Vertex(e.offsetX, e.offsetY));
    Input.mouseGridPos = mainCanvas.viewToGridPos(new Vertex(e.offsetX, e.offsetY));
    if (Input.state == InputState.DRAGGING) {
        if (editMode == EditMode.VERTEX) {
            if (!Input.mouseGridPos.equals(vertexDragStart)) {
                mapData.moveVertex(vertexDragStart, Input.mouseGridPos);
                mainCanvas.redraw();
                vertexDragStart = Input.mouseGridPos;
            }
        }
    }
    if (Input.viewDragging) {
        mainCanvas.viewOffset.x -= e.movementX;
        mainCanvas.viewOffset.y -= e.movementY;
        mainCanvas.redraw();
    }
    if (Input.state == InputState.DRAWING) {
        mainCanvas.drawingLines[mainCanvas.drawingLines.length - 1].end = Input.mouseGridPos;
        mainCanvas.redraw();
    }
    if (Input.state == InputState.EXTRUDING) {
        updateExtrude();
    }
    if (editMode == EditMode.SECTOR) {
        mainCanvas.highlightSector = mapData.getSectorIndexAt(Input.mousePos);
        mainCanvas.redraw();
    }
    else {
        mainCanvas.highlightSector = -1;
    }
    if (editMode == EditMode.LINE) {
        if (Input.state == InputState.NONE) {
            mainCanvas.highlightLine = mapData.getNearestLine(Input.mousePos);
            mainCanvas.redraw();
        }
        else {
            mainCanvas.highlightLine = null;
        }
    }
    else {
        mainCanvas.highlightLine = null;
    }
    if (editMode == EditMode.VERTEX) {
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
                clearSelection();
                mainCanvas.drawingLines = new Array();
                mainCanvas.drawingLines.push(new Line(Input.mouseGridPos, Input.mouseGridPos));
                mainCanvas.redraw();
            }
        }
        if (editMode == EditMode.VERTEX) {
            vertexDragStart = Input.mouseGridPos;
            Input.state = InputState.DRAGGING;
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
            else if (Input.state == InputState.EXTRUDING) {
                finishExtrude();
            }
            else {
                mainCanvas.selectedLines.push(mapData.getNearestLine(Input.mousePos));
            }
        }
    }
}
function onMouseUp(e) {
    if (e.button == 2) {
        if (Input.state == InputState.DRAGGING) {
            Input.state = InputState.NONE;
        }
    }
}
window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);
mainCanvas.canvas.addEventListener("mousemove", onMouseMove);
mainCanvas.canvas.addEventListener("mousewheel", onMouseWheel);
mainCanvas.canvas.addEventListener("mousedown", onMouseDown);
mainCanvas.canvas.addEventListener("mouseup", onMouseUp);
//# sourceMappingURL=main.js.map