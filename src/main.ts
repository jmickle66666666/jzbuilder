let mapData : MapData = new MapData();
let mainCanvas : BuilderCanvas = new BuilderCanvas(document.getElementById("maincanvas") as HTMLCanvasElement, mapData);
mainCanvas.redraw();

let tempTexture : HTMLImageElement = document.createElement("img");
tempTexture.src = "JZCRATE2.png";

let editMode = EditMode.LINE;

function finishDrawingSector() {
    Input.state = InputState.NONE;
    let newSector = new Sector(tempTexture);
    for (let i = 0; i < mainCanvas.drawingLines.length; i++) {
        newSector.lines.push(mainCanvas.drawingLines[i]);
    }
    newSector.invalidate();
    mapData.sectors.push(newSector);
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

let extrudeStart : Line = null;
let extrudeEnd : Line = null;
let extrudePointStart : Vertex = null;

function beginExtrude() {
    Input.state = InputState.EXTRUDING;
    extrudeStart = mapData.getNearestLine(Input.mousePos);
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

    let l1 = extrudeStart;
    let l2 = new Line(extrudeStart.end, extrudeEnd.start);
    let l3 = extrudeEnd;
    let l4 = new Line(extrudeEnd.end, extrudeStart.start);

    let newSector = new Sector(tempTexture);
    newSector.lines.push(l1);
    newSector.lines.push(l2);
    newSector.lines.push(l3);
    newSector.lines.push(l4);
    newSector.invalidate();
    mapData.sectors.push(newSector);
    mainCanvas.redraw();
}

function convexMerge() {
    let pts = [];
    for (let i = 0; i < mainCanvas.selectedLines.length; i++) {
        pts.push(mainCanvas.selectedLines[i].start);
        pts.push(mainCanvas.selectedLines[i].end);
    }
    let newSector:Sector = Sector.fromConvexPoints(pts, tempTexture);
    mapData.sectors.push(newSector);
    clearSelection();
}

function onKeyDown(e : KeyboardEvent):void {
    if (e.key == " ") Input.viewDragging = true;

    if (e.key == "e" && editMode == EditMode.LINE && Input.state == InputState.NONE) {
        beginExtrude();
    }

    if (e.key == "j") {
        convexMerge();
    }

    if (e.key == "c") clearSelection();
    if (e.key == "v") editMode = EditMode.VERTEX;
    if (e.key == "s") editMode = EditMode.SECTOR;
    if (e.key == "l") editMode = EditMode.LINE;
    if (e.key == "t") editMode = EditMode.THING;

    if (e.key == "Escape") {
        cancelDrawing();
        cancelExtrude();
    }

    mainCanvas.redraw();
}

function onKeyUp(e:KeyboardEvent):void {
    if (e.key == " ") Input.viewDragging = false;
}

function onMouseMove(e:MouseEvent) {
    Input.mousePos = mainCanvas.viewToPos(new Vertex(e.offsetX, e.offsetY));
    Input.mouseGridPos = mainCanvas.viewToGridPos(new Vertex(e.offsetX, e.offsetY));

    if (Input.viewDragging) {
        mainCanvas.viewOffset.x -= e.movementX;
        mainCanvas.viewOffset.y -= e.movementY;
        mainCanvas.redraw();
    }

    if (Input.state == InputState.DRAWING) {
        mainCanvas.drawingLines[mainCanvas.drawingLines.length-1].end = Input.mouseGridPos;
        mainCanvas.redraw();
    }

    if (Input.state == InputState.EXTRUDING) {
        updateExtrude();
    }

    if (editMode == EditMode.SECTOR) {
        mainCanvas.highlightSector = mapData.getSectorIndexAt(Input.mousePos);
        mainCanvas.redraw();
    } else {
        mainCanvas.highlightSector = -1;
    }

    if (editMode == EditMode.LINE) {
        if (Input.state == InputState.NONE) {
            mainCanvas.highlightLine = mapData.getNearestLine(Input.mousePos);
            mainCanvas.redraw();
        } else {
            mainCanvas.highlightLine = null;
        }
    } else {
        mainCanvas.highlightLine = null;
    }

    if (editMode == EditMode.VERTEX) {
        mainCanvas.redraw();
    }
}

function onMouseWheel(e:MouseWheelEvent) {
    e.preventDefault();

    if (e.deltaY > 0) mainCanvas.zoom *= mainCanvas.ZOOM_SPEED;
    if (e.deltaY < 0) mainCanvas.zoom /= mainCanvas.ZOOM_SPEED;
    if (e.deltaY != 0) mainCanvas.redraw();
}

function onMouseDown(e:MouseEvent) {
    e.preventDefault();

    if (e.button == 2) {
        if (editMode == EditMode.LINE) {
            if (Input.state == InputState.NONE) {
                Input.state = InputState.DRAWING;
                mainCanvas.drawingLines = new Array<Line>();
                mainCanvas.drawingLines.push(new Line(Input.mouseGridPos, Input.mouseGridPos));
                mainCanvas.redraw();
            }
        }
    }

    if (e.button == 0) {
        if (editMode == EditMode.LINE) {
            if (Input.state == InputState.DRAWING) {

                if (mainCanvas.drawingLines[0].start.equals(Input.mouseGridPos)) {
                    mainCanvas.drawingLines[mainCanvas.drawingLines.length-1].end = Input.mouseGridPos;
                    finishDrawingSector();
                } else {
                    mainCanvas.drawingLines.push(new Line(Input.mouseGridPos, Input.mouseGridPos));
                }

            } else if (Input.state == InputState.EXTRUDING) {

                finishExtrude();

            } else {

                mainCanvas.selectedLines.push(mapData.getNearestLine(Input.mousePos));

            }
        }
    }
}

window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);
window.addEventListener("mousemove", onMouseMove);
window.addEventListener("mousewheel", onMouseWheel);
window.addEventListener("mousedown", onMouseDown);