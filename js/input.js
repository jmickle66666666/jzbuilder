var InputMode;
(function (InputMode) {
    InputMode["VERTEX"] = "vertex";
    InputMode["EDGE"] = "edge";
    InputMode["SECTOR"] = "sector";
})(InputMode || (InputMode = {}));
var Input = /** @class */ (function () {
    function Input() {
    }
    Input.switchMode = function (mode) {
        if (Input.lockModes == false) {
            Input.mode = mode;
            var off = 10;
            if (mode != InputMode.VERTEX)
                off += 74;
            if (mode == InputMode.SECTOR)
                off += 74;
            if (this.lastAnim != null) {
                this.lastAnim.cancel();
            }
            this.lastAnim = new Anim(mainCanvas.modeSelectionOffset, "x", off, 0.3);
        }
    };
    Input.Initialise = function () {
        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);
        mainCanvas.canvas.addEventListener("mousemove", onMouseMove);
        mainCanvas.canvas.addEventListener("mousedown", onMouseDown);
        mainCanvas.canvas.addEventListener("mouseup", onMouseUp);
        // I love standards
        mainCanvas.canvas.addEventListener("mousewheel", onMouseWheel);
        mainCanvas.canvas.addEventListener("wheel", onMouseWheel);
    };
    Input.mousePos = new Vertex(0, 0);
    Input.mouseGridPos = new Vertex(0, 0);
    Input.viewDragging = false;
    Input.mode = InputMode.VERTEX;
    Input.lockModes = false;
    return Input;
}());
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
    if (e.key == "]") {
        mainCanvas.gridSize *= 2;
    }
    if (e.key == "[") {
        mainCanvas.gridSize /= 2;
    }
    if (e.key == "Escape") {
        changeTool(tools[0]);
    }
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
    if (Input.viewDragging) {
        mainCanvas.viewOffset.x -= e.movementX;
        mainCanvas.viewOffset.y -= e.movementY;
    }
    if (activeTool.onMouseMove) {
        activeTool.onMouseMove(e);
    }
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
}
function onMouseDown(e) {
    e.preventDefault();
    if (activeTool.onMouseDown) {
        activeTool.onMouseDown(e);
    }
}
function onMouseUp(e) {
    if (activeTool.onMouseUp) {
        activeTool.onMouseUp(e);
    }
}
//# sourceMappingURL=input.js.map