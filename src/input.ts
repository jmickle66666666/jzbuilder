enum InputState {
    NONE,
    DRAWING,
    EXTRUDING
}

class Input {
    static mousePos:Vertex = new Vertex(0, 0);
    static mouseGridPos:Vertex = new Vertex(0, 0);

    static viewDragging:boolean = false;
    static state:InputState = InputState.NONE;
}