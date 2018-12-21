enum InputMode {
    VERTEX = "vertex",
    EDGE = "edge",
    SECTOR = "sector"
}

class Input {
    static mousePos:Vertex = new Vertex(0, 0);
    static mouseGridPos:Vertex = new Vertex(0, 0);

    static viewDragging:boolean = false;
    static mode:InputMode = InputMode.VERTEX;

    static lockModes:Boolean = false;

    static switchMode(mode:InputMode) {
        if (Input.lockModes == false) {
            Input.mode = mode;

            let off = 10;
            if (mode != InputMode.VERTEX) off += 74;
            if (mode == InputMode.SECTOR) off += 74;

            new Anim(mainCanvas.modeSelectionOffset, "x", off, 0.3);
        }
    }
}