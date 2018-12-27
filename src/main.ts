
let mainCanvas : BuilderCanvas;
let mapData : MapData;
let dirty : Boolean;
let threescene;
let threecam;
let threerenderer;
let threeDView:Boolean = false;

declare var THREE;

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

    Input.Initialise();
    init3dCam();
}

function update() {
    Anim.update();
    if (threeDView) {
        Input3D.update();
    }
    if (dirty || threeDView) {
        render();
        dirty = false;
    }
}

function init3dCam() {
    let el = document.getElementById("canvasholder");
    threecam = new THREE.PerspectiveCamera(60, mainCanvas.canvas.width / mainCanvas.canvas.height, 0.1, 1000);
    threerenderer = new THREE.WebGLRenderer();
    threerenderer.setSize(mainCanvas.canvas.width, mainCanvas.canvas.height);
    el.appendChild(threerenderer.domElement);
    threerenderer.domElement.style.display = "none";
}

function build3dScene() {

    threescene = new THREE.Scene();
    var material = new THREE.MeshBasicMaterial();
    let tex = new THREE.TextureLoader().load('test.png');
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1 / 128, 1 / 128);
    tex.magFilter = THREE.NearestFilter;
    material.map = tex;

    mapData.sectors.forEach(s => {
        s.buildMesh(material);
    })

    threecam.position.y = 64;
}

function switchView() {
    if (threeDView) {
        threeDView = false;
        Input.Initialise();
        Input3D.Uninitialise();
        threerenderer.domElement.style.display = "none";
        document.getElementById("maincanvas").style.display = "flex";
    } else {
        threeDView = true;
        build3dScene();
        Input.Uninitialise();
        Input3D.Initialise();
        threerenderer.domElement.style.display = "flex";
        document.getElementById("maincanvas").style.display = "none";
    }
}

function render() {
    if (threeDView) {
        threerenderer.render( threescene, threecam );
    } else {
        mainCanvas.redraw();
        Anim.render();
        if (Tool.activeTool.onRender) {
            Tool.activeTool.onRender();
        }
    }
}

window.addEventListener("load", init);

