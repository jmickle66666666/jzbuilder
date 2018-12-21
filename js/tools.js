var activeTool;
var tools = new Array();
function changeTool(tool) {
    if (activeTool != null && activeTool.onUnswitch) {
        activeTool.onUnswitch();
    }
    activeTool = tool;
    if (activeTool.onSwitch) {
        activeTool.onSwitch();
    }
}
//# sourceMappingURL=tools.js.map