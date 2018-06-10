let mapData : MapData = new MapData();
let mainCanvas : BuilderCanvas = new BuilderCanvas(document.getElementById("maincanvas") as HTMLCanvasElement, mapData);
mainCanvas.redraw();

function onKeyDown(e : KeyboardEvent):void {
    if (e.key == " ") Input.viewDragging = true;
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
}

function onMouseWheel(e:MouseWheelEvent) {

}

function onMouseDown(e:MouseEvent) {

}

window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);
window.addEventListener("mousemove", onMouseMove);
window.addEventListener("mousewheel", onMouseWheel);
window.addEventListener("mousedown", onMouseDown);