var mainCanvas;
var mapData;
// let sectors:Array<Sector>;
var dirty;
function init() {
    mapData = new MapData();
    mainCanvas = new BuilderCanvas(document.getElementById("maincanvas"));
    dirty = true;
}
function update() {
    Anim.update();
    if (dirty) {
        render();
        dirty = false;
    }
}
function render() {
    mainCanvas.redraw();
    if (activeTool.onRender) {
        activeTool.onRender();
    }
}
init();
window.setInterval(update, 1000 / 60);
// Probably all garbage
// let mapData : MapData = new MapData();
// mainCanvas.redraw();
// let tempTexture : HTMLImageElement = document.createElement("img");
// tempTexture.src = "JZCRATE2.png";
// let editMode = EditMode.LINE;
// let vertexDragStart = null;
// function newMap() {
//     undoStack.save("delete all");
//     mapData.sectors.length = 0;
//     mapData.lines.length = 0;
//     mainCanvas.redraw();
// }
// function undo() {
//     undoStack.restore();
//     clearSelection();
//     mainCanvas.redraw();
// }
// function makeSector() {
//     undoStack.save("make sector");
//     let nearestList = mapData.getNearestLine(Input.mousePos);
//     console.log(nearestList);
//     let points = traceShallowSector(nearestList);
//     if (points == null) {
//         clearSelection();
//         mainCanvas.redraw();
//         return;
//     }
//     console.log(points);
//     clearSelection();
//     let newSector:Sector = new Sector(tempTexture);
//     for (let i = 0; i < points.length-1; i++) {
//         newSector.lines.push(new Line(points[i], points[i+1]));
//     }
//     newSector.invalidate();
//     mapData.sectors.push(newSector);
//     mainCanvas.redraw();
// }
// function makeSectorHighlightLines() {
//     let nearestList = mapData.getNearestLine(Input.mousePos);
//     if (nearestList == null) return;
//     let points = traceShallowSector(nearestList);
//     if (points == null) {
//         return;
//     }
//     mainCanvas.highlightLines.length = 0;
//     for (let i = 0; i < points.length-1; i++) {
//         mainCanvas.highlightLines.push(new Line(points[i], points[i+1]));
//     }
// }
// function finishDrawingSector() {
//     undoStack.save("finish drawing sector");
//     Input.state = InputState.NONE;
//     let newSector = new Sector(tempTexture);
//     for (let i = 0; i < mainCanvas.drawingLines.length; i++) {
//         mainCanvas.drawingLines[i].sector = newSector;
//         newSector.lines.push(mainCanvas.drawingLines[i]);
//     }
//     for (let i = 0; i < newSector.lines.length; i++) {
//         mapData.addLine(newSector.lines[i]);
//     }
//     newSector.invalidate();
//     mapData.sectors.push(newSector);
//     mainCanvas.drawingLines.length = 0;
//     mainCanvas.redraw();
// }
// function finishDrawingLines() {
//     undoStack.save("finish drawing lines");
//     Input.state = InputState.NONE;
//     for (let i = 0; i < mainCanvas.drawingLines.length - 1; i++) {
//         mapData.addLine(mainCanvas.drawingLines[i]);
//         //mapData.lines.push(mainCanvas.drawingLines[i]);
//     }
//     mainCanvas.drawingLines.length = 0;
//     mainCanvas.redraw();
// }
// function clearSelection() {
//     mainCanvas.selectedLines.length = 0;
//     mainCanvas.redraw();
// }
// function cancelDrawing() {
//     if (Input.state == InputState.DRAWING) {
//         Input.state = InputState.NONE;
//         mainCanvas.drawingLines.length = 0;
//         mainCanvas.redraw();
//     }
// }
// let extrudeStart : Line = null;
// let extrudeEnd : Line = null;
// let extrudePointStart : Vertex = null;
// function beginExtrude() {
//     extrudeStart = mapData.getNearestLine(Input.mousePos);
//     if (extrudeStart == null) {
//         return;
//     }
//     Input.state = InputState.EXTRUDING;
//     extrudePointStart = Input.mouseGridPos;
//     extrudeEnd = new Line(extrudeStart.end, extrudeStart.start);
// }
// function updateExtrude() {
//     extrudeEnd.start.x = extrudeStart.end.x + (Input.mouseGridPos.x - extrudePointStart.x);
//     extrudeEnd.start.y = extrudeStart.end.y + (Input.mouseGridPos.y - extrudePointStart.y);
//     extrudeEnd.end.x = extrudeStart.start.x + (Input.mouseGridPos.x - extrudePointStart.x);
//     extrudeEnd.end.y = extrudeStart.start.y + (Input.mouseGridPos.y - extrudePointStart.y);
//     mainCanvas.redraw();
// }
// function cancelExtrude() {
//     if (Input.state == InputState.EXTRUDING) {
//         Input.state = InputState.NONE;
//         mainCanvas.redraw();
//     }
// }
// function finishExtrude() {
//     undoStack.save("finishextrude");
//     Input.state = InputState.NONE;
//     let l1 = extrudeStart;
//     let l2 = new Line(extrudeStart.end, extrudeEnd.start);
//     let l3 = extrudeEnd;
//     let l4 = new Line(extrudeEnd.end, extrudeStart.start);
//     let newSector = new Sector(tempTexture);
//     newSector.lines.push(l1);
//     newSector.lines.push(l2);
//     newSector.lines.push(l3);
//     newSector.lines.push(l4);
//     newSector.invalidate();
//     mapData.addLine(l1);
//     mapData.addLine(l2);
//     mapData.addLine(l3);
//     mapData.addLine(l4);
//     mapData.sectors.push(newSector);
//     mainCanvas.redraw();
// }
// function convexMerge() {
//     undoStack.save("convex merge");
//     let pts = [];
//     for (let i = 0; i < mainCanvas.selectedLines.length; i++) {
//         pts.push(mainCanvas.selectedLines[i].start);
//         pts.push(mainCanvas.selectedLines[i].end);
//     }
//     let newSector:Sector = Sector.fromConvexPoints(pts, tempTexture);
//     mapData.sectors.push(newSector);
//     clearSelection();
// }
function onKeyDown(e) {
    dirty = true;
    if (e.key == " ")
        Input.viewDragging = true;
    if (e.key == "1")
        Input.switchMode(InputMode.VERTEX);
    if (e.key == "2")
        Input.switchMode(InputMode.EDGE);
    if (e.key == "3")
        Input.switchMode(InputMode.SECTOR);
    for (var i = 0; i < tools.length; i++) {
        if (e.key == tools[i].selectKey) {
            changeTool(tools[i]);
        }
    }
    //     if (e.key == "e" && editMode == EditMode.LINE && Input.state == InputState.NONE) {
    //         beginExtrude();
    //     }
    //     if (e.key == "j") {
    //         convexMerge();
    //     }
    //     if ((e.key == "Backspace" && e.ctrlKey) || e.key == "Delete") {
    //         if (editMode == EditMode.LINE) {
    //             undoStack.save("delete line");
    //             if (mainCanvas.selectedLines.length == 0) {
    //                 for (let i = 0; i < mainCanvas.highlightLines.length; i++) {
    //                     mapData.deleteLine(mainCanvas.highlightLines[i]);
    //                 }
    //             } else {
    //                 for (let i = 0; i < mainCanvas.selectedLines.length; i++) {
    //                     mapData.deleteLine(mainCanvas.selectedLines[i]);
    //                 }
    //             }
    //         }
    //         if (editMode == EditMode.VERTEX) {
    //             undoStack.save("delete vertex");
    //             mapData.deleteVertex(Input.mouseGridPos);
    //         }
    //         if (editMode == EditMode.SECTOR) {
    //             undoStack.save("delete sector");
    //             mapData.deleteSectorAt(Input.mousePos);
    //         }
    //         clearSelection();
    //         mainCanvas.redraw();
    //     }
    //     if (e.key == "z" && e.ctrlKey) {
    //         undo();
    //     }
    //     if (e.key == "c") clearSelection();
    //     if (e.key == "v") editMode = EditMode.VERTEX;
    //     if (e.key == "s" && !e.ctrlKey) editMode = EditMode.SECTOR;
    //     if (e.key == "s" && e.ctrlKey) {
    //         e.preventDefault();
    //         saveMap();
    //     }
    //     if (e.key == "l" && !e.ctrlKey) editMode = EditMode.LINE;
    //     if (e.key == "t") editMode = EditMode.THING;
    //     if (e.key == "[") mainCanvas.gridSize /= 2;
    //     if (e.key == "]") mainCanvas.gridSize *= 2;
    //     if (e.key == "m") {
    //         editMode = EditMode.MAKESECTOR;
    //     } 
    //     if (e.key == "o") mainCanvas.randomColors();
    //     if (e.key == "p") mainCanvas.resetDefaultColors();
    //     if (e.key == "Enter" && editMode == EditMode.MAKESECTOR) {
    //         makeSector();
    //     } 
    //     if (e.key == "Escape") {
    //         cancelDrawing();
    //         cancelExtrude();
    //     }
    //     if (e.key == "Enter" && editMode == EditMode.LINE) {
    //         finishDrawingLines();
    //     }
    //     mainCanvas.redraw();
}
function onKeyUp(e) {
    dirty = true;
    if (e.key == " ")
        Input.viewDragging = false;
}
function onMouseMove(e) {
    dirty = true;
    Input.mousePos = mainCanvas.viewToPos(new Vertex(e.offsetX, e.offsetY));
    Input.mouseGridPos = mainCanvas.viewToGridPos(new Vertex(e.offsetX, e.offsetY));
    //     if (Input.state == InputState.DRAGGING) {
    //         if (editMode == EditMode.VERTEX) {
    //             if (!Input.mouseGridPos.equals(vertexDragStart)) {
    //                 mapData.moveVertex(vertexDragStart, Input.mouseGridPos);
    //                 mainCanvas.redraw();
    //                 vertexDragStart = Input.mouseGridPos;
    //             }
    //         }
    //     }
    if (Input.viewDragging) {
        mainCanvas.viewOffset.x -= e.movementX;
        mainCanvas.viewOffset.y -= e.movementY;
        // mainCanvas.redraw();
    }
    if (activeTool.onMouseMove) {
        activeTool.onMouseMove();
    }
    //     if (Input.state == InputState.DRAWING) {
    //         mainCanvas.drawingLines[mainCanvas.drawingLines.length-1].end = Input.mouseGridPos;
    //         mainCanvas.redraw();
    //     }
    //     if (Input.state == InputState.EXTRUDING) {
    //         updateExtrude();
    //     }
    //     if (editMode == EditMode.SECTOR) {
    //         mainCanvas.highlightSector = mapData.getSectorIndexAt(Input.mousePos);
    //         mainCanvas.redraw();
    //     } else {
    //         mainCanvas.highlightSector = -1;
    //     }
    //     if (editMode == EditMode.MAKESECTOR) {
    //         makeSectorHighlightLines();
    //         mainCanvas.redraw();
    //     }
    //     if (editMode == EditMode.LINE) {
    //         if (Input.state == InputState.NONE) {
    //             mainCanvas.highlightLines = [mapData.getNearestLine(Input.mousePos)];
    //             mainCanvas.redraw();
    //         } else {
    //             mainCanvas.highlightLines.length = 0;
    //         }
    //     } else {
    //         mainCanvas.highlightLines.length = 0;
    //     }
    //     if (editMode == EditMode.VERTEX) {
    //         mainCanvas.redraw();
    //     }
}
function onMouseWheel(e) {
    dirty = true;
    e.preventDefault();
    if (e.deltaY > 0) {
        mainCanvas.zoom *= mainCanvas.ZOOM_SPEED;
        mainCanvas.viewOffset.x -= (Input.mousePos.x) * ((mainCanvas.ZOOM_SPEED - 1.0) / mainCanvas.zoom);
        mainCanvas.viewOffset.y -= (Input.mousePos.y) * ((mainCanvas.ZOOM_SPEED - 1.0) / mainCanvas.zoom);
    }
    if (e.deltaY < 0) {
        mainCanvas.zoom /= mainCanvas.ZOOM_SPEED;
        mainCanvas.viewOffset.x += (Input.mousePos.x) * ((mainCanvas.ZOOM_SPEED - 1.0) / mainCanvas.zoom);
        mainCanvas.viewOffset.y += (Input.mousePos.y) * ((mainCanvas.ZOOM_SPEED - 1.0) / mainCanvas.zoom);
    }
    // if (e.deltaY != 0) mainCanvas.redraw();
}
function onMouseDown(e) {
    e.preventDefault();
    if (activeTool.onMouseDown) {
        activeTool.onMouseDown();
    }
    //     if (e.button == 2) {
    //         if (editMode == EditMode.LINE) {
    //             if (Input.state == InputState.NONE) {
    //                 Input.state = InputState.DRAWING;
    //                 clearSelection();
    //                 mainCanvas.drawingLines = new Array<Line>();
    //                 mainCanvas.drawingLines.push(new Line(Input.mouseGridPos, Input.mouseGridPos));
    //                 mainCanvas.redraw();
    //             }
    //         }
    //         if (editMode == EditMode.VERTEX) {
    //             undoStack.save("start vertex drag");
    //             vertexDragStart = Input.mouseGridPos;
    //             Input.state = InputState.DRAGGING;
    //         }
    //     }
    //     if (e.button == 0) {
    //         if (editMode == EditMode.LINE) {
    //             if (Input.state == InputState.DRAWING) {
    //                 if (mainCanvas.drawingLines[0].start.equals(Input.mouseGridPos)) {
    //                     mainCanvas.drawingLines[mainCanvas.drawingLines.length-1].end = Input.mouseGridPos;
    //                     finishDrawingSector();
    //                 } else {
    //                     mainCanvas.drawingLines.push(new Line(Input.mouseGridPos, Input.mouseGridPos));
    //                 }
    //             } else if (Input.state == InputState.EXTRUDING) {
    //                 finishExtrude();
    //             } else {
    //                 mainCanvas.selectedLines.push(mapData.getNearestLine(Input.mousePos));
    //             }
    //         }
    //     }
}
function onMouseUp(e) {
    if (activeTool.onMouseUp) {
        activeTool.onMouseUp();
    }
    // if (e.button == 2) {
    //     if (Input.state == InputState.DRAGGING) {
    //         Input.state = InputState.NONE;
    //     }
    // }
}
window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);
mainCanvas.canvas.addEventListener("mousemove", onMouseMove);
// I love standards
mainCanvas.canvas.addEventListener("mousewheel", onMouseWheel);
mainCanvas.canvas.addEventListener("wheel", onMouseWheel);
// 
mainCanvas.canvas.addEventListener("mousedown", onMouseDown);
mainCanvas.canvas.addEventListener("mouseup", onMouseUp);
// let undoStack:UndoStack = new UndoStack();
// undoStack.save();
//# sourceMappingURL=main.js.map