let activeTool:Tool;
let tools:Array<Tool> = new Array<Tool>();

interface Tool {
    name:string;
    selectKey:string;
    onMouseDown?(e:MouseEvent);
    onMouseUp?(e:MouseEvent);
    onMouseMove?(e:MouseEvent);
    onRender?();
    onSwitch?();
    onUnswitch?();
}

function changeTool(tool:Tool) {
    if (activeTool!= null && activeTool.onUnswitch) {
        activeTool.onUnswitch();
    }

    activeTool = tool;

    if (activeTool.onSwitch) {
        activeTool.onSwitch();
    }
}