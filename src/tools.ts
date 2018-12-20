
let activeTool:Tool;
let tools:Array<Tool> = new Array<Tool>();

interface Tool {
    name:string;
    selectKey:string;
    onMouseDown?();
    onMouseUp?();
    onMouseMove?();
    onRender?();
}

class Translate implements Tool {
    name:string = "translate tool";
    selectKey:string = "t";
    lastPos:Vertex;
    dragging:Boolean = false;

    public constructor () {
        this.lastPos = Input.mouseGridPos;
    }
    
    public onMouseDown():void {
        this.dragging = true;
    }

    public onMouseUp():void {
        this.dragging = false
    }

    public onMouseMove():void {
        if (this.lastPos != Input.mouseGridPos) {
            if (this.dragging && Input.mode == InputMode.VERTEX) {
                mapData.moveVertex(this.lastPos, Input.mouseGridPos);
            }
            this.lastPos = Input.mouseGridPos;
        }
    }

    public onRender():void {
        if (Input.mode == InputMode.VERTEX) {
            mainCanvas.highlightVertex(Input.mouseGridPos);
        }

        if (Input.mode == InputMode.EDGE) {
            mainCanvas.highlightEdge(mapData.getNearestEdge(Input.mousePos));
        }
    }
}

class Extrude implements Tool {
    name:string = "extrude tool";
    selectKey:string = "e";

    extruding:Boolean = false;
    targetEdge:Edge;
    translation:Vertex;
    initialPosition:Vertex;

    public onMouseMove():void {
        if (this.extruding) {
            this.translation = Vertex.Subtract(Input.mouseGridPos, this.initialPosition);
        }
    }

    public onMouseDown():void {
        if (Input.mode == InputMode.EDGE) {
            this.startExtrude(mapData.getNearestEdge(Input.mousePos));
        }
    }

    public onMouseUp():void {
        if (this.extruding) {
            this.extruding = false;
            this.applyExtrude();
        }
    }

    startExtrude(edge:Edge):void {
        this.extruding = true;
        this.targetEdge = edge;
        this.translation = new Vertex(0,0);
        this.initialPosition = Input.mouseGridPos;
    }

    applyExtrude():void {
        let newSector:Sector = new Sector();
        let edge1:Edge = this.targetEdge.reversedCopy();
        let edge3:Edge = this.targetEdge.copy();
        edge3.translate(this.translation);
        let edge2:Edge = new Edge(edge3.end, edge1.start);
        let edge4:Edge = new Edge(edge1.end, edge3.start);
        newSector.edges.push(edge1);
        newSector.edges.push(edge2);
        newSector.edges.push(edge3);
        newSector.edges.push(edge4);
        mapData.sectors.push(newSector);

        this.targetEdge.edgeLink = edge1;
        edge1.edgeLink = this.targetEdge;
    }

    onRender():void {
        if (this.extruding) {
            let renderEdges:Array<Edge> = new Array<Edge>();
            renderEdges.push(new Edge(Vertex.Add(this.targetEdge.end, this.translation), this.targetEdge.end));
            renderEdges.push(new Edge(Vertex.Add(this.targetEdge.start, this.translation), Vertex.Add(this.targetEdge.end, this.translation)));
            renderEdges.push(new Edge(this.targetEdge.start, Vertex.Add(this.targetEdge.start, this.translation)));
            mainCanvas.drawBasicEdges(renderEdges, mainCanvas.MAPLINE_COLOR);
        } else {
            if (Input.mode == InputMode.EDGE) {
                mainCanvas.highlightEdge(mapData.getNearestEdge(Input.mousePos));
            }
        }
    }
}

function changeTool(tool:Tool) {
    activeTool = tool;
    
    let el = document.getElementById("infopanel");
    el.innerHTML = tool.name;
}

tools.push(new Translate());
tools.push(new Extrude());

changeTool(tools[0]);