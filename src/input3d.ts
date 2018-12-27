class Input3D {

    static rotX:number = 0;
    static rotY:number = 0;
    static left:boolean = false;
    static right:boolean = false;
    static forward:boolean = false;
    static backward:boolean = false;

    static forwardAxis = new THREE.Vector3(0, 0, -1);
    static backwardAxis = new THREE.Vector3(0, 0, 1);
    static leftAxis = new THREE.Vector3(-1, 0, 0);
    static rightAxis = new THREE.Vector3(1, 0, 0);

    static flySpeed = 4;

    static Initialise() {

        window.addEventListener("keydown", Input3D.onKeyDown);
        window.addEventListener("keyup", Input3D.onKeyUp);
        threerenderer.domElement.addEventListener("mousemove", Input3D.onMouseMove);
        threerenderer.domElement.addEventListener("mousedown", Input3D.onMouseDown);
        threerenderer.domElement.addEventListener("mouseup", Input3D.onMouseUp);

        // I love standards
        // mainCanvas.canvas.addEventListener("mousewheel", Input3D.onMouseWheel);
        // mainCanvas.canvas.addEventListener("wheel", Input3D.onMouseWheel);
    }

    static Uninitialise() {
        window.removeEventListener("keydown", Input3D.onKeyDown);
        window.removeEventListener("keyup", Input3D.onKeyUp);
        threerenderer.domElement.removeEventListener("mousemove", Input3D.onMouseMove);
        threerenderer.domElement.removeEventListener("mousedown", Input3D.onMouseDown);
        threerenderer.domElement.removeEventListener("mouseup", Input3D.onMouseUp);
        // mainCanvas.canvas.removeEventListener("mousewheel", Input3D.onMouseWheel);
        // mainCanvas.canvas.removeEventListener("wheel", Input3D.onMouseWheel);
    }

    static dragging = false;

    static onKeyUp(e:KeyboardEvent) {
        if (e.key == "w") Input3D.forward = false;
        if (e.key == "a") Input3D.left = false;
        if (e.key == "s") Input3D.backward = false;
        if (e.key == "d") Input3D.right = false;
    }

    static onKeyDown(e:KeyboardEvent) {
        if (e.key == "Tab") {
            switchView();
        }

        if (e.key == "w") Input3D.forward = true;
        if (e.key == "a") Input3D.left = true;
        if (e.key == "s") Input3D.backward = true;
        if (e.key == "d") Input3D.right = true;
    }

    static onMouseMove(e:MouseEvent) {
        if (Input3D.dragging) {

            Input3D.rotY += e.movementX * -0.008;
            Input3D.rotX += e.movementY * -0.008;

            threecam.lookAt (
                threecam.position.x + Math.sin(Input3D.rotY) * Math.cos(Input3D.rotX),
                threecam.position.y + Math.sin(Input3D.rotX),
                threecam.position.z + Math.cos(Input3D.rotY) * Math.cos(Input3D.rotX)
            );
        }
    }

    static onMouseDown(e:MouseEvent) {
        e.preventDefault();
        if (e.button == 2) {
            Input3D.dragging = true;
        }
    }

    static onMouseUp(e:MouseEvent) {
        e.preventDefault();
        if (e.button == 2) {
            Input3D.dragging = false;
        }
    }

    static update() {
        if (Input3D.forward) {
            threecam.translateOnAxis(Input3D.forwardAxis, Input3D.flySpeed);
        }

        if (Input3D.backward) {
            threecam.translateOnAxis(Input3D.backwardAxis, Input3D.flySpeed);
        }

        if (Input3D.left) {
            threecam.translateOnAxis(Input3D.leftAxis, Input3D.flySpeed);
        }

        if (Input3D.right) {
            threecam.translateOnAxis(Input3D.rightAxis, Input3D.flySpeed);
        }
    }
}