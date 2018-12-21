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
    Input.mousePos = new Vertex(0, 0);
    Input.mouseGridPos = new Vertex(0, 0);
    Input.viewDragging = false;
    Input.mode = InputMode.VERTEX;
    Input.lockModes = false;
    return Input;
}());
//# sourceMappingURL=input.js.map