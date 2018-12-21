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
        Input.mode = mode;
        var off = 10;
        if (mode != InputMode.VERTEX)
            off += 74;
        if (mode == InputMode.SECTOR)
            off += 74;
        new Anim(mainCanvas.modeSelectionOffset, "x", off, 0.3);
    };
    Input.mousePos = new Vertex(0, 0);
    Input.mouseGridPos = new Vertex(0, 0);
    Input.viewDragging = false;
    Input.mode = InputMode.EDGE;
    return Input;
}());
//# sourceMappingURL=input.js.map