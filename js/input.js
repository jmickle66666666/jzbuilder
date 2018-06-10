var InputState;
(function (InputState) {
    InputState["NONE"] = "none";
    InputState["DRAWING"] = "drawing";
    InputState["EXTRUDING"] = "extruding";
})(InputState || (InputState = {}));
var Input = /** @class */ (function () {
    function Input() {
    }
    Input.mousePos = new Vertex(0, 0);
    Input.mouseGridPos = new Vertex(0, 0);
    Input.viewDragging = false;
    Input.state = InputState.NONE;
    return Input;
}());
//# sourceMappingURL=input.js.map