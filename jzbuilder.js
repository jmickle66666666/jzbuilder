// Constants
CANVAS_BG_COLOR = "#434043";
GRID_COLOR = "#000000";
GRID_CENTER_COLOR = "#888888";
DRAWLINE_COLOR = "#998811";
MAPLINE_COLOR = "#cccccc";
HIGHLIGHTLINE_COLOR = "#FFFFFF";
VERTEX_COLOR = "#FF8811";
DRAWVERTEX_COLOR = "#FFFFFF";
SECTOR_COLOR = "#22441144";
LINE_SELECT_DISTANCE = 5;
VERTEX_SIZE = 2;
ZOOM_SPEED = 1.05;

var EditMode = {
    VERTEX : "vertex",
    LINE : "line",
    SECTOR : "sector",
    THING : "thing"
}

editMode = EditMode.LINE;

// View Control Values
offsetX = -400;
offsetY = -300;
zoom = 1.0;
gridSize = 32;

highlightedSector = -1;
highlightedLine = { x1:0, y2:0, x2:0, y1:0 };

drawingLinesList = [];
mapLines = [];
sectors = [];
mpos = {};
freepos = {x:0, y:0};
gridpos = {x:0, y:0};

// test
sector_img = document.createElement('img');
sector_img.src = "JZCRATE2.png";

// Classes
var DrawLine = {
    x1 : 0,
    y1 : 0,
    x2 : 0,
    y2 : 0
};

var MapLine = {
    x1 : 0,
    y1 : 0,
    x2 : 0,
    y2 : 0,
    inView : function() {
        return (this.x1 > offsetX && this.x1 < offsetX + canvas.width && 
                this.y1 > offsetY && this.y1 < offsetY + canvas.height) ||
               (this.x2 > offsetX && this.x2 < offsetX + canvas.width && 
                this.y2 > offsetY && this.y2 < offsetY + canvas.height);
    },
    frontSector : null,
    backSector : null,
    shapeDefining : false,
    invalidate : function() {
        if (this.shapeDefining) {
            if (this.frontSector != null) this.frontSector.invalidate();
            if (this.backSector != null) this.frontSector.invalidate();
        }
    }
}

var Sector = {
    bounds : null,
    lines : null,
    preview : null,
    inView : function() {
        return (this.bounds.x1 > offsetX && this.bounds.x1 < offsetX + canvas.width && 
                this.bounds.y1 > offsetY && this.bounds.y1 < offsetY + canvas.height) ||
               (this.bounds.x2 > offsetX && this.bounds.x2 < offsetX + canvas.width && 
                this.bounds.y2 > offsetY && this.bounds.y2 < offsetY + canvas.height);
    },
    pointInBounds : function(x, y) {
        return (x > this.bounds.x1 && x < this.bounds.x2 && y > this.bounds.y1 && y < this.bounds.y2);
    },
    invalidate : function() {
        if (this.lines.length != 0) {
            console.log("lines: ", this.lines.length);

            this.bounds = { x1 : 0, y1 : 0, x2 : 0, y2 : 0, width : 0, height : 0, mpx : 0, mpy : 0 };

            for (i = 0; i < this.lines.length; i++) {
                this.bounds.x1 = Math.min(this.bounds.x1, this.lines[i].x1, this.lines[i].x2);
                this.bounds.x2 = Math.max(this.bounds.x2, this.lines[i].x1, this.lines[i].x2);
                this.bounds.y1 = Math.min(this.bounds.y1, this.lines[i].y1, this.lines[i].y2);
                this.bounds.y2 = Math.max(this.bounds.y2, this.lines[i].y1, this.lines[i].y2);
            }
            this.bounds.width = this.bounds.x2 - this.bounds.x1;
            this.bounds.height = this.bounds.y2 - this.bounds.y1;
            this.bounds.mpx = this.bounds.x1 + this.bounds.width/2;
            this.bounds.mpy = this.bounds.y1 + this.bounds.height/2;

            this.preview = document.createElement("canvas");
            this.preview.width = this.bounds.width;
            this.preview.height = this.bounds.height;
            _ctx = this.preview.getContext('2d');
            _ctx.fillStyle = SECTOR_COLOR;
            //_ctx.strokeStyle = MAPLINE_COLOR;
            _ctx.beginPath();
            _ctx.moveTo(this.lines[0].x1 - this.bounds.x1, this.lines[0].y1 - this.bounds.y1);
            for (i = 0; i < this.lines.length; i++) {
                _ctx.lineTo(this.lines[i].x2 - this.bounds.x1, this.lines[i].y2 - this.bounds.y1);
            }
            _ctx.imageSmoothingEnabled = false;
            _ctx.clip();

            var ox = this.bounds.x1 % 64;
            var oy = this.bounds.y1 % 64;

            for (i = -ox - 64; i < this.bounds.width; i += 64) {
                for (j = -oy - 64; j < this.bounds.height; j += 64) {
                    _ctx.drawImage(sector_img, i, j);
                }
            }

            //_ctx.drawImage(document.getElementById("logo"), 0, 0);
            //_ctx.fill();
            //_ctx.stroke();
        }
    }
}

function sqrDist(x1, y1, x2, y2) {
    a = x2 - x1;
    b = y2 - y1;
    return a**2 + b**2;
}

function distToSegmentMidpoint(x, y, x1, y1, x2 ,y2) {
    return sqrDist(x, y, (x1 + x2)/2, (y1 + y2)/2);
}

function distToSegmentSquared(x, y, x1, y1, x2, y2) {
    var p = {x, y};
    var v = {x1, y1};
    var w = {x2, y2};
    var l2 = sqrDist(v, w);
      
    if (l2 == 0) return sqrDist(p, v);
      
    var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
      
    if (t < 0) return sqrDist(p, v);
    if (t > 1) return sqrDist(p, w);
      
    return sqrDist(p, { x: v.x + t * (w.x - v.x), y: v.y + t * (w.y - v.y) });
}

function getHighlightSector(x, y) {
    if (sectors.length == 0) return -1;

    var s = [];
    for (i = 0; i < sectors.length; i++) {
        if (sectors[i].pointInBounds(x, y)) s.push(i);
    }

    if (s.length == 0) return -1;
    if (s.length == 1) return s[0];

    var nIndex = s[0];
    var nDist = sqrDist(x, y, sectors[s[0]].bounds.mpx, sectors[s[0]].bounds.mpy);
    for (i = 1; i < s.length; i++) {
        var sDist = sqrDist(x, y, sectors[s[i]].bounds.mpx, sectors[s[i]].bounds.mpy);
        if (sDist < nDist) {
            nDist = sDist;
            nIndex = s[i];
        }
    }

    return nIndex;
}

function getAllLines() {
    var output = [];
    for (var i = 0; i < mapLines.length; i++) {
        output.push(mapLines[i]);
    }
    for (i = 0; i < sectors.length; i++) {
        for (var j = 0; j < sectors[i].lines.length; j++) {
            output.push(sectors[i].lines[j]);
        }
    }
    //console.log(output);
    return output;
}

function getHighlightLine(x, y) {

    var allLines = getAllLines();

    if (allLines.length == 0) {
        //highlightedLine = null;
        return;
    }
    if (allLines.length == 1) {
        if (distToSegmentMidpoint(x, y, allLines[0].x1, allLines[0].y1, allLines[0].x2, allLines[0].y2 ) < LINE_SELECT_DISTANCE) {
            highlightedLine.x1 = allLines[0].x1;
            highlightedLine.x2 = allLines[0].x2;
            highlightedLine.y1 = allLines[0].y1;
            highlightedLine.y2 = allLines[0].y2;
            return;
        } else {
            //highlightedLine = null;
            return;
        }
    }

    var lIndex = 0;
    lDist = distToSegmentMidpoint(x, y, allLines[0].x1, allLines[0].y1, allLines[0].x2, allLines[0].y2 );
    for (i = 0; i < allLines.length; i++) {
        nDist = distToSegmentMidpoint(x, y, allLines[i].x1, allLines[i].y1, allLines[i].x2, allLines[i].y2 );
        if (nDist < lDist) {
            lDist = nDist;
            lIndex = i;
        }
    }
    highlightedLine.x1 = allLines[lIndex].x1;
    highlightedLine.x2 = allLines[lIndex].x2;
    highlightedLine.y1 = allLines[lIndex].y1;
    highlightedLine.y2 = allLines[lIndex].y2;
}

// Good Variables
canvas = document.getElementById("maincanvas");
ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

function posToView(x, y) {
    x = (x / zoom) - offsetX;
    y = (y / zoom) - offsetY;
    return {x, y};
}

function viewToPos(x, y) {
    x = (x + offsetX) * zoom;
    y = (y + offsetY) * zoom;
    return {x, y};
}

function updateCanvas() {

    ctx = canvas.getContext('2d');

    // Draw Grid 
    ctx.fillStyle = CANVAS_BG_COLOR;
    ctx.fillRect(0, 0, 800, 600);

    ctx.lineWidth = 0.5;
    ctx.strokeStyle = GRID_COLOR;
    for (i = 0; i < canvas.width; i++) {
        if ( (i + offsetX) % Math.round(gridSize/zoom) == 0 ) {
            if (i + offsetX == 0) ctx.strokeStyle = GRID_CENTER_COLOR;
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
            if (i + offsetX == 0) ctx.strokeStyle = GRID_COLOR;
        }
    }

    for (i = 0; i < canvas.height; i++) {
        if ( (i + offsetY) % Math.round(gridSize/zoom) == 0 ) {
            if (i + offsetY == 0) ctx.strokeStyle = GRID_CENTER_COLOR;
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
            ctx.stroke();
            if (i + offsetY == 0) ctx.strokeStyle = GRID_COLOR;
        }
    }

    // Draw Sectors
    if (sectors.length != 0) {
        for (i = 0; i < sectors.length; i++) {
            if (sectors[i].inView()) {
                p = posToView(sectors[i].bounds.x1, sectors[i].bounds.y1);
                ctx.drawImage(sectors[i].preview, p.x, p.y, sectors[i].bounds.width / zoom, sectors[i].bounds.height / zoom);

                if (highlightedSector == i) {
                    ctx.strokeStyle = HIGHLIGHTLINE_COLOR;
                    ctx.lineWidth = 2.0;
                } else {
                    ctx.strokeStyle = MAPLINE_COLOR;
                    ctx.lineWidth = 1.0;
                }
                ctx.beginPath();
                for (j = 0; j < sectors[i].lines.length; j++) {
                    p = posToView(sectors[i].lines[j].x1, sectors[i].lines[j].y1);
                    ctx.moveTo(p.x, p.y);
                    p = posToView(sectors[i].lines[j].x2, sectors[i].lines[j].y2);
                    ctx.lineTo(p.x, p.y);
                }
                ctx.stroke();
            }
        }
    }

    // Draw Map Lines
    if (mapLines.length != 0) {
        ctx.lineWidth = 1.0;
        ctx.strokeStyle = MAPLINE_COLOR;
        
        ctx.beginPath();
        for (i = 0; i < mapLines.length; i++) {
            if (mapLines[i].inView()) {
                p = posToView(mapLines[i].x1, mapLines[i].y1);
                ctx.moveTo(p.x, p.y);
                p = posToView(mapLines[i].x2, mapLines[i].y2);
                ctx.lineTo(p.x, p.y);
            }
        }
        ctx.stroke();   
    }

    // Draw DrawLines
    if (drawingLinesList.length != 0) {
        ctx.lineWidth = 2.0;
        ctx.strokeStyle = DRAWLINE_COLOR;
        ctx.beginPath();
        for (i = 0; i < drawingLinesList.length; i++) {
            p = posToView(drawingLinesList[i].x1, drawingLinesList[i].y1);
            ctx.moveTo(p.x, p.y);
            p = posToView(drawingLinesList[i].x2, drawingLinesList[i].y2);
            ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
    }

    // Draw Vertexes
    if (editMode == EditMode.VERTEX) {
        ctx.fillStyle = VERTEX_COLOR;
        for (i = 0; i < mapLines.length; i++) {
            p = posToView(mapLines[i].x1, mapLines[i].y1);
            ctx.fillRect(p.x - VERTEX_SIZE, p.y - VERTEX_SIZE, VERTEX_SIZE * 2, VERTEX_SIZE * 2);
        }

        ctx.fillStyle = DRAWVERTEX_COLOR;
        p = posToView(mpos.x, mpos.y);
        ctx.fillRect(p.x - VERTEX_SIZE, p.y - VERTEX_SIZE, VERTEX_SIZE * 2, VERTEX_SIZE * 2);
    }

    // Draw highlighted line
    if (highlightedLine != null && editMode == EditMode.LINE) {
        ctx.strokeStyle = HIGHLIGHTLINE_COLOR;
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        p = posToView(highlightedLine.x1, highlightedLine.y1);
        ctx.moveTo(p.x, p.y);
        p = posToView(highlightedLine.x2, highlightedLine.y2);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
    }

    // Extruding Line
    if (extrudingLines) {
        ctx.lineWidth = 2.0;
        ctx.strokeStyle = DRAWLINE_COLOR;

        ctx.beginPath();
        p = posToView(extrudeLineStart.x1, extrudeLineStart.y1);
        ctx.moveTo(p.x, p.y);
        p = posToView(extrudeLineEnd.x2, extrudeLineEnd.y2);
        ctx.lineTo(p.x, p.y);
        p = posToView(extrudeLineStart.x2, extrudeLineStart.y2);
        ctx.moveTo(p.x, p.y);
        p = posToView(extrudeLineEnd.x1, extrudeLineEnd.y1);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();

        ctx.lineWidth = 2.0;

        ctx.strokeStyle = HIGHLIGHTLINE_COLOR;
        ctx.beginPath();
        p = posToView(extrudeLineEnd.x1, extrudeLineEnd.y1);
        ctx.moveTo(p.x, p.y);
        p = posToView(extrudeLineEnd.x2, extrudeLineEnd.y2);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();

    }
}

// Input Handler
dragging = false;
drawingLines = false;
extrudingLines = false;
extrudeLineEnd = null;
extrudeLineStart = null;
extrudePointStart = {x:0, y:0};

function getMouseGridPosition(e) {
    p = viewToPos(e.offsetX, e.offsetY);
    p.x = Math.round(p.x / gridSize) * gridSize;
    p.y = Math.round(p.y / gridSize) * gridSize;
    return p;
}

function getMouseFreePosition(e) {
    p = viewToPos(e.offsetX, e.offsetY);
    gridpos.x = Math.round(p.x / gridSize) * gridSize;
    gridpos.y = Math.round(p.y / gridSize) * gridSize;
    return p;
}

function onKeyDown(e) {

    //console.log(e.key);

    if (e.key == " ") {
        dragging = true;
    }

    if (e.key == "e" && editMode == EditMode.LINE && !drawingLines) {
        extrudingLines = true;
        extrudePointStart.x = gridpos.x;
        extrudePointStart.y = gridpos.y;
        startExtrude();
    }

    if (e.key == "v") editMode = EditMode.VERTEX;
    if (e.key == "s") editMode = EditMode.SECTOR;
    if (e.key == "l") editMode = EditMode.LINE;
    if (e.key == "t") editMode = EditMode.THING;

    if (e.key == "Escape") {
        if (drawingLines) cancelDrawing();
        if (extrudingLines) cancelExtrude();
    }
    

    updateCanvas();
}

function onKeyUp(e) {
    if (e.key == " ") {
        dragging = false;
    }   
}

function onMouseMove(e) {
    //console.log(dragging);
    var p = getMouseFreePosition(e);
    freepos.x = p.x;
    freepos.y = p.y;

    if (dragging) {
        offsetX -= e.movementX;
        offsetY -= e.movementY;
        updateCanvas();
    }

    if (drawingLines) {
        pos = getMouseGridPosition(e);
        //console.log(e);
        drawingLinesList[drawingLinesList.length - 1].x2 = pos.x;
        drawingLinesList[drawingLinesList.length - 1].y2 = pos.y;
        //console.log(drawingLinesList[drawingLinesList.length - 1]);
        updateCanvas();
    }

    if (editMode == EditMode.SECTOR) {
        highlightedSector = getHighlightSector(freepos.x, freepos.y);
        updateCanvas();
    } else {
        highlightedSector = -1;
    }

    if (editMode == EditMode.LINE) {

        if (extrudingLines) {
            updateExtrude(e);
            updateCanvas();
        } else {
            getHighlightLine(freepos.x, freepos.y);
            //console.log(highlightedLine);
            updateCanvas();
        }
        
    } else {
        highlightedLine = null;
    }

    mpos = getMouseGridPosition(e);
    if (editMode == EditMode.VERTEX) updateCanvas();
}

function onMouseWheel(e) {
    e.preventDefault();
    //console.log(e);

    if (e.deltaY > 0) {
        zoom *= ZOOM_SPEED;
    }
    if (e.deltaY < 0) {
        zoom /= ZOOM_SPEED;
    }
    if (e.deltaY != 0) updateCanvas();
}

function onMouseDown(e) {
    e.preventDefault();
    pos = getMouseGridPosition(e);

    if (extrudingLines) {

        if (e.button == 0) {
            finishExtrude();
        }

        return;
    }

    if (!drawingLines) {
        if (e.button == 2) {
            drawingLines = true;
            drawingLinesList.push(Object.create(DrawLine));
            drawingLinesList[0].x1 = pos.x;
            drawingLinesList[0].y1 = pos.y;
        }
    } else {
        if (e.button == 0) {
            if (pos.x == drawingLinesList[0].x1 && pos.y == drawingLinesList[0].y1) {
                drawingLinesList[drawingLinesList.length - 1].x2 = pos.x;
                drawingLinesList[drawingLinesList.length - 1].y2 = pos.y;
                finishDrawingSector();
            } else {
                drawingLinesList.push(Object.create(DrawLine));
                drawingLinesList[drawingLinesList.length - 1].x1 = pos.x;
                drawingLinesList[drawingLinesList.length - 1].y1 = pos.y;
            }
        }
    }
}

function cancelExtrude() {
    extrudingLines = false;
    updateCanvas();
}

function startExtrude() {
    extrudeLineStart = Object.create(DrawLine);
    extrudeLineStart.x1 = highlightedLine.x1;
    extrudeLineStart.y1 = highlightedLine.y1;
    extrudeLineStart.x2 = highlightedLine.x2;
    extrudeLineStart.y2 = highlightedLine.y2;

    extrudeLineEnd = Object.create(DrawLine);
    // extrudeLineEnd.x2 = highlightedLine.x1;
    // extrudeLineEnd.y2 = highlightedLine.y1;
    // extrudeLineEnd.x1 = highlightedLine.x2;
    // extrudeLineEnd.y1 = highlightedLine.y2;
}

function updateExtrude() {
    var p = {x:gridpos.x-extrudePointStart.x, y:gridpos.y-extrudePointStart.y};

    extrudeLineEnd.x2 = highlightedLine.x1 + p.x;
    extrudeLineEnd.y2 = highlightedLine.y1 + p.y;
    extrudeLineEnd.x1 = highlightedLine.x2 + p.x;
    extrudeLineEnd.y1 = highlightedLine.y2 + p.y;
}

function finishExtrude() {
    extrudingLines = false;

    var l1 = Object.create(MapLine);
    l1.x1 = extrudeLineStart.x1;
    l1.y1 = extrudeLineStart.y1;
    l1.x2 = extrudeLineStart.x2;
    l1.y2 = extrudeLineStart.y2;
    
    var l2 = Object.create(MapLine);
    l2.x1 = extrudeLineStart.x2;
    l2.y1 = extrudeLineStart.y2;
    l2.x2 = extrudeLineEnd.x1;
    l2.y2 = extrudeLineEnd.y1;

    var l3 = Object.create(MapLine);
    l3.x1 = extrudeLineEnd.x1;
    l3.y1 = extrudeLineEnd.y1;
    l3.x2 = extrudeLineEnd.x2;
    l3.y2 = extrudeLineEnd.y2;

    var l4 = Object.create(MapLine);
    l4.x1 = extrudeLineEnd.x2;
    l4.y1 = extrudeLineEnd.y2;
    l4.x2 = extrudeLineStart.x1;
    l4.y2 = extrudeLineStart.y1;

    var newSect = Object.create(Sector);
    newSect.lines = [];
    newSect.lines.push(l1);
    newSect.lines.push(l2);
    newSect.lines.push(l3);
    newSect.lines.push(l4);
    //console.log(newSect.lines);
    newSect.invalidate();
    sectors.push(newSect);
    updateCanvas();
}

function cancelDrawing() {
    drawingLines = false;
    drawingLinesList = [];
    updateCanvas();
}

function finishDrawingSector() {
    drawingLines = false;

    var newSector = Object.create(Sector);
    newSector.lines = [];
    for (i = 0; i < drawingLinesList.length; i++) {
        newLine = Object.create(MapLine);
        newLine.x1 = drawingLinesList[i].x1;
        newLine.x2 = drawingLinesList[i].x2;
        newLine.y1 = drawingLinesList[i].y1;
        newLine.y2 = drawingLinesList[i].y2;
        newSector.lines.push(newLine);
    }

    newSector.invalidate();
    sectors.push(newSector);
    drawingLinesList = [];
    updateCanvas();
}

function finishDrawingLine() {
    drawingLines = false;

    for (i = 0; i < drawingLinesList.length; i++) {
        newLine = Object.create(MapLine);
        newLine.x1 = drawingLinesList[i].x1;
        newLine.x2 = drawingLinesList[i].x2;
        newLine.y1 = drawingLinesList[i].y1;
        newLine.y2 = drawingLinesList[i].y2;
        mapLines.push(newLine);
    }
    drawingLinesList = [];
    updateCanvas();
}

// function tick() {
//     offsetX += 1;
//     drawGrid();
// }

updateCanvas();
//window.setInterval(tick, 1);

window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);
window.addEventListener("mousemove", onMouseMove);
window.addEventListener("mousewheel", onMouseWheel);
window.addEventListener("mousedown", onMouseDown);