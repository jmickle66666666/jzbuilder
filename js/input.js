// Probably defunct
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
    };
    Input.mousePos = new Vertex(0, 0);
    Input.mouseGridPos = new Vertex(0, 0);
    Input.viewDragging = false;
    Input.mode = InputMode.EDGE;
    return Input;
}());
//# sourceMappingURL=input.js.map