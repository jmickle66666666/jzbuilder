class Split implements ITool {
    name:string = "Split";
    selectKey:string = "e";

    onMouseDown(e:MouseEvent):void {
        Undo.addState();
        if (mapData.splitLinesAt(Input.mouseGridPos)) {
            let ov = {
                v:Input.mouseGridPos.clone(),
                a:2
            };
            new Anim(ov, "a", 0, 0.2, null, function() {
                mainCanvas.highlightVertex(ov.v, Color.rgbaToHex(1,0.5,0.95, ov.a), 2 + Math.max(0, (1.0 - ov.a) * 10));
            });
        }
    }

    onSwitch():void {
        Input.switchMode(InputMode.EDGE);
        Input.lockModes = true;
    }

    onUnswitch():void {
        Input.lockModes = false;
    }

    onRender():void {
        mainCanvas.highlightVertex(Input.mouseGridPos);
        // mainCanvas.highlightEdge(mapData.getNearestEdge(Input.mouseGridPos));
    }
}