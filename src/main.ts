
let mainCanvas : BuilderCanvas;
let mapData : MapData;
let dirty : Boolean;

function init() {
    window.setInterval(update, 1000/60);

    window.addEventListener("resize", function() {
        mainCanvas = new BuilderCanvas(document.getElementById("maincanvas") as HTMLCanvasElement);
        render();
    });

    mapData = new MapData();
    mainCanvas = new BuilderCanvas(document.getElementById("maincanvas") as HTMLCanvasElement);
    dirty = true;

    Tool.tools.push(new BaseTool());
    Tool.tools.push(new Extrude());
    Tool.tools.push(new Split());
    // Tool.tools.push(new EntityTool());

    Tool.changeTool(Tool.tools[0]);

    Input.Initialise()
}

function update() {
    Anim.update();
    if (dirty) {
        render();
        dirty = false;
    }
}

function render() {
    mainCanvas.redraw();
    Anim.render();
    if (Tool.activeTool.onRender) {
        Tool.activeTool.onRender();
    }
}

window.addEventListener("load", init);

