
let mainCanvas : BuilderCanvas;
let mapData : MapData;
let dirty : Boolean;
let threescene;
let threecam;
let threerenderer;
let threeDView:Boolean = false;

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
    if (dirty || threeDView) {
        render();
        dirty = false;
    }
}

function init3dCam() {
    threescene = new THREE.Scene();
    let el = document.getElementById("canvasholder");
    threecam = new THREE.PerspectiveCamera(60, mainCanvas.canvas.width / mainCanvas.canvas.height, 0.1, 1000);
    threerenderer = new THREE.WebGLRenderer();
    threerenderer.setSize(mainCanvas.canvas.width, mainCanvas.canvas.height);
    el.appendChild(threerenderer.domElement);
    threerenderer.domElement.style.display = "none";

    var material = new THREE.MeshDepthMaterial();

    // let meshes = [];

    mapData.sectors.forEach(s => {
        s.edges.forEach(e => {

            if (!e.edgeLink) {
    
            let g = new THREE.Geometry();
            g.vertices.push(new THREE.Vector3(e.start.x / 32, 0, e.start.y / 32));
            g.vertices.push(new THREE.Vector3(e.end.x / 32, 0, e.end.y / 32));
            g.vertices.push(new THREE.Vector3(e.start.x / 32, 1, e.start.y / 32));
            g.vertices.push(new THREE.Vector3(e.end.x / 32, 1, e.end.y / 32));
    
            g.faces.push(new THREE.Face3(0, 2, 3));
            g.faces.push(new THREE.Face3(0, 3, 1));
    
            let m = new THREE.Mesh(g, material);
            threescene.add(m);
            }
        })
    })
    

    // let geometry = new THREE.BoxGeometry(1,1,1);
    // let cube = new THREE.Mesh( geometry, material );
    // threescene.add( cube );

    threecam.position.y = 0.5;
}

// let cube;

function switchView() {
    if (threeDView) {
        threeDView = false;

        threerenderer.domElement.style.display = "none";
        document.getElementById("maincanvas").style.display = "flex";
    } else {
        threeDView = true;
        init3dCam();
        threerenderer.domElement.style.display = "flex";
        document.getElementById("maincanvas").style.display = "none";
    }
}

function render() {
    if (threeDView) {
        // cube.rotation.x += 0.01;
        // cube.rotation.y += 0.01;
        threecam.rotation.y += 0.01;
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

