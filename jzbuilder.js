// Constants
CANVAS_BG_COLOR = "#434043";
GRID_COLOR = "#000000";
GRID_CENTER_COLOR = "#888888";
DRAWLINE_COLOR = "#998811";
MAPLINE_COLOR = "#cccccc";
ZOOM_SPEED = 1.05;

// View Control Values
offsetX = -400;
offsetY = -300;
zoom = 1.0;
gridSize = 32;

drawingLinesList = [];
mapLines = [];

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
    y2 : 0
}

// Good Variables
canvas = document.getElementById("maincanvas");
ctx = canvas.getContext('2d');

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

    // Draw Map Lines
    if (mapLines.length != 0) {
        ctx.lineWidth = 1.0;
        ctx.strokeStyle = MAPLINE_COLOR;
        ctx.beginPath();
        for (i = 0; i < mapLines.length; i++) {
            p = posToView(mapLines[i].x1, mapLines[i].y1);
            ctx.moveTo(p.x, p.y);
            p = posToView(mapLines[i].x2, mapLines[i].y2);
            ctx.lineTo(p.x, p.y);
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
}

// Input Handler
dragging = false;
drawingLines = false;

function getMouseGridPosition(e) {
    p = viewToPos(e.offsetX, e.offsetY);
    p.x = Math.round(p.x / gridSize) * gridSize;
    p.y = Math.round(p.y / gridSize) * gridSize;
    return p;
}

function onKeyDown(e) {
    if (e.key == " ") {
        dragging = true;
    }   
}

function onKeyUp(e) {
    if (e.key == " ") {
        dragging = false;
    }   
}

function onMouseMove(e) {
    //console.log(dragging);
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
}

function onMouseWheel(e) {
    e.preventDefault();
    //console.log(e);

    if (e.deltaY > 0) zoom *= ZOOM_SPEED;
    if (e.deltaY < 0) zoom /= ZOOM_SPEED;
    if (e.deltaY != 0) updateCanvas();
}

function onMouseDown(e) {
    pos = getMouseGridPosition(e);
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
                finishDrawing();
            } else {
                drawingLinesList.push(Object.create(DrawLine));
                drawingLinesList[drawingLinesList.length - 1].x1 = pos.x;
                drawingLinesList[drawingLinesList.length - 1].y1 = pos.y;
            }
        }
    }
}

function cancelDrawing() {
    drawingLines = false;
    drawingLinesList = [];
    updateCanvas();
}

function finishDrawing() {
    drawingLines = false;
    for (i = 0; i < drawingLinesList.length; i++) {
        newLine = Object.create(MapLine);
        newLine.x1 = drawingLinesList[i].x1;
        newLine.x2 = drawingLinesList[i].x2;
        newLine.y1 = drawingLinesList[i].y1;
        newLine.y2 = drawingLinesList[i].y2;
        mapLines.push(newLine);
    }

    console.log(mapLines);

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