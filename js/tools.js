var activeTool;
var tools = new Array();
var Translate = /** @class */ (function () {
    function Translate() {
        this.name = "translate tool";
        this.selectKey = "t";
        this.dragging = false;
        this.lastPos = Input.mouseGridPos;
    }
    Translate.prototype.onMouseDown = function () {
        this.dragging = true;
    };
    Translate.prototype.onMouseUp = function () {
        this.dragging = false;
    };
    Translate.prototype.onMouseMove = function () {
        if (this.lastPos != Input.mouseGridPos) {
            if (this.dragging && Input.mode == InputMode.VERTEX) {
                mapData.moveVertex(this.lastPos, Input.mouseGridPos);
            }
            this.lastPos = Input.mouseGridPos;
        }
    };
    Translate.prototype.onRender = function () {
        if (Input.mode == InputMode.VERTEX) {
            mainCanvas.highlightVertex(Input.mouseGridPos);
        }
        if (Input.mode == InputMode.EDGE) {
            mainCanvas.highlightEdge(mapData.getNearestEdge(Input.mousePos));
        }
    };
    return Translate;
}());
var Extrude = /** @class */ (function () {
    function Extrude() {
        this.name = "extrude tool";
        this.selectKey = "e";
        this.extruding = false;
    }
    Extrude.prototype.onMouseMove = function () {
        if (this.extruding) {
            this.translation = Vertex.Subtract(Input.mouseGridPos, this.initialPosition);
        }
    };
    Extrude.prototype.onMouseDown = function () {
        if (Input.mode == InputMode.EDGE) {
            this.startExtrude(mapData.getNearestEdge(Input.mousePos));
        }
    };
    Extrude.prototype.onMouseUp = function () {
        if (this.extruding) {
            this.extruding = false;
            this.applyExtrude();
        }
    };
    Extrude.prototype.startExtrude = function (edge) {
        this.extruding = true;
        this.targetEdge = edge;
        this.translation = new Vertex(0, 0);
        this.initialPosition = Input.mouseGridPos;
    };
    Extrude.prototype.applyExtrude = function () {
        var newSector = new Sector();
        var edge1 = this.targetEdge.reversedCopy();
        var edge3 = this.targetEdge.copy();
        edge3.translate(this.translation);
        var edge2 = new Edge(edge3.end, edge1.start);
        var edge4 = new Edge(edge1.end, edge3.start);
        newSector.edges.push(edge1);
        newSector.edges.push(edge2);
        newSector.edges.push(edge3);
        newSector.edges.push(edge4);
        mapData.sectors.push(newSector);
        this.targetEdge.edgeLink = edge1;
        edge1.edgeLink = this.targetEdge;
    };
    Extrude.prototype.onRender = function () {
        if (this.extruding) {
            var renderEdges = new Array();
            renderEdges.push(new Edge(Vertex.Add(this.targetEdge.end, this.translation), this.targetEdge.end));
            renderEdges.push(new Edge(Vertex.Add(this.targetEdge.start, this.translation), Vertex.Add(this.targetEdge.end, this.translation)));
            renderEdges.push(new Edge(this.targetEdge.start, Vertex.Add(this.targetEdge.start, this.translation)));
            mainCanvas.drawBasicEdges(renderEdges, mainCanvas.MAPLINE_COLOR);
        }
        else {
            if (Input.mode == InputMode.EDGE) {
                mainCanvas.highlightEdge(mapData.getNearestEdge(Input.mousePos));
            }
        }
    };
    return Extrude;
}());
function changeTool(tool) {
    activeTool = tool;
    var el = document.getElementById("infopanel");
    el.innerHTML = tool.name;
}
tools.push(new Translate());
tools.push(new Extrude());
changeTool(tools[0]);
//# sourceMappingURL=tools.js.map