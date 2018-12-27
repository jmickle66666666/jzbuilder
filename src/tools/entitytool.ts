class EntityTool implements ITool {
    name:string = "Entities";
    selectKey:string = "r";

    onMouseDown() {
        mapData.entities.push({position:Input.mousePos.clone()});
    }
}