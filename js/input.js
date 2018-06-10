var InputState;
(function (InputState) {
    InputState[InputState["NONE"] = 0] = "NONE";
    InputState[InputState["DRAWING"] = 1] = "DRAWING";
    InputState[InputState["EXTRUDING"] = 2] = "EXTRUDING";
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