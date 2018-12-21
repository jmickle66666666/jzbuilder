
let mainCanvas : BuilderCanvas;
let mapData : MapData;
let dirty:Boolean;

function init() {
    mapData = new MapData();
    mainCanvas = new BuilderCanvas(document.getElementById("maincanvas") as HTMLCanvasElement);
    dirty = true;

    tools.push(new Translate());
    tools.push(new Extrude());

    changeTool(tools[0]);
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
    Anim.render();
    if (activeTool.onRender) {
        activeTool.onRender();
    }
}

init();
window.setInterval(update, 1000/60);

function onKeyDown(e : KeyboardEvent):void {
    dirty = true;

    if (e.key == " ") Input.viewDragging = true;

    if (e.key == "1") Input.switchMode(InputMode.VERTEX);
    if (e.key == "2") Input.switchMode(InputMode.EDGE);
    if (e.key == "3") Input.switchMode(InputMode.SECTOR);

    for (let i = 0; i < tools.length; i++) {
        if (e.key == tools[i].selectKey) {
            changeTool(tools[i]);
        }
    }
}

function onKeyUp(e:KeyboardEvent):void {
    dirty = true;
    if (e.key == " ") Input.viewDragging = false;
}

function onMouseMove(e:MouseEvent) {
    dirty = true;
    Input.mousePos = mainCanvas.viewToPos(new Vertex(e.offsetX, e.offsetY));
    Input.mouseGridPos = mainCanvas.viewToGridPos(new Vertex(e.offsetX, e.offsetY));

    if (Input.viewDragging) {
        mainCanvas.viewOffset.x -= e.movementX;
        mainCanvas.viewOffset.y -= e.movementY;
    }

    if (activeTool.onMouseMove) {
        activeTool.onMouseMove();
    }
}

function onMouseWheel(e:MouseWheelEvent) {
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
}

function onMouseDown(e:MouseEvent) {
    e.preventDefault();

    if (activeTool.onMouseDown) {
        activeTool.onMouseDown();
    }
}

function onMouseUp(e:MouseEvent) {
    if (activeTool.onMouseUp) {
        activeTool.onMouseUp();
    }
}

window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);
mainCanvas.canvas.addEventListener("mousemove", onMouseMove);

// I love standards
mainCanvas.canvas.addEventListener("mousewheel", onMouseWheel);
mainCanvas.canvas.addEventListener("wheel", onMouseWheel);

mainCanvas.canvas.addEventListener("mousedown", onMouseDown);
mainCanvas.canvas.addEventListener("mouseup", onMouseUp);