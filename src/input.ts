enum InputMode {
    VERTEX = "vertex",
    EDGE = "edge",
    SECTOR = "sector"
}

class Input {
    static mousePos:Vertex = new Vertex(0, 0);
    static mouseGridPos:Vertex = new Vertex(0, 0);

    static viewDragging:boolean = false;
    static mode:InputMode = InputMode.EDGE;

    static switchMode(mode:InputMode) {
        Input.mode = mode;

    }
}