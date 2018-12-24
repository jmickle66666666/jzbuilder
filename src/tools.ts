interface ITool {
    name:string;
    selectKey:string;
    cursor?:string;
    onMouseDown?(e:MouseEvent);
    onMouseUp?(e:MouseEvent);
    onMouseMove?(e:MouseEvent);
    onRender?();
    onSwitch?();
    onUnswitch?();
    onModeChange?(mode:InputMode);
}

class Tool {
    static activeTool:ITool;

    static tools:Array<ITool> = new Array<ITool>();

    static changeTool(tool:ITool) {
        if (Tool.activeTool != null && Tool.activeTool.onUnswitch) {
            Tool.activeTool.onUnswitch();
        }
    
        Tool.activeTool = tool;

        if (Tool.activeTool.cursor) {
            document.body.style.cursor = Tool.activeTool.cursor;
        } else {
            document.body.style.cursor = "";
        }
    
        if (Tool.activeTool.onSwitch) {
            Tool.activeTool.onSwitch();
        }
    }

    static defaultTool() {
        Tool.changeTool(Tool.tools[0]);
    }
}