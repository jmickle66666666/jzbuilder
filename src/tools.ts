interface ITool {
    name:string;
    selectKey:string;
    onMouseDown?(e:MouseEvent);
    onMouseUp?(e:MouseEvent);
    onMouseMove?(e:MouseEvent);
    onRender?();
    onSwitch?();
    onUnswitch?();
}

class Tool {
    static activeTool:ITool;

    static tools:Array<ITool> = new Array<ITool>();

    static changeTool(tool:ITool) {
        if (Tool.activeTool != null && Tool.activeTool.onUnswitch) {
            Tool.activeTool.onUnswitch();
        }
    
        Tool.activeTool = tool;
    
        if (Tool.activeTool.onSwitch) {
            Tool.activeTool.onSwitch();
        }
    }
}