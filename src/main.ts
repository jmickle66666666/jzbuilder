
let mainCanvas : BuilderCanvas;
let mapData : MapData;
let dirty:Boolean;

function init() {
    mapData = new MapData();
    mainCanvas = new BuilderCanvas(document.getElementById("maincanvas") as HTMLCanvasElement);
    dirty = true;

    tools.push(new Translate());
    tools.push(new Extrude());

    changeTool(tools[0]);

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
    if (activeTool.onRender) {
        activeTool.onRender();
    }
}

init();
window.setInterval(update, 1000/60);

window.addEventListener("resize", function() {
    mainCanvas = new BuilderCanvas(document.getElementById("maincanvas") as HTMLCanvasElement);
    render();
});
