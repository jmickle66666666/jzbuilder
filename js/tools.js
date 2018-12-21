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
        if (Input.mode == InputMode.VERTEX) {
            this.activeVertices = mapData.getVerticesAt(Input.mouseGridPos);
            if (this.activeVertices.length > 0) {
                this.dragging = true;
                Input.lockModes = true;
            }
        }
        if (Input.mode == InputMode.EDGE) {
            this.activeEdge = mapData.getNearestEdge(Input.mouseGridPos);
            this.dragging = true;
            Input.lockModes = true;
            this.lastPos = Input.mouseGridPos;
        }
    };
    Translate.prototype.onMouseUp = function () {
        this.dragging = false;
        Input.lockModes = false;
    };
    Translate.prototype.onMouseMove = function () {
        if (Input.mode == InputMode.VERTEX && this.dragging) {
            this.activeVertices.forEach(function (v) {
                v.setTo(Input.mouseGridPos);
                mapData.getEdgesWithVertex(v).forEach(function (e) { return e.dirty = true; });
            });
        }
        if (Input.mode == InputMode.EDGE && this.dragging) {
            if (!this.lastPos.equals(Input.mouseGridPos)) {
                this.activeEdge.translate(Vertex.Subtract(Input.mouseGridPos, this.lastPos));
                this.lastPos.setTo(Input.mouseGridPos);
            }
        }
    };
    Translate.prototype.onRender = function () {
        if (this.dragging) {
            if (Input.mode == InputMode.VERTEX) {
                mainCanvas.highlightVertex(this.activeVertices[0]);
            }
            if (Input.mode == InputMode.EDGE) {
                mainCanvas.highlightEdge(this.activeEdge);
            }
            if (Input.mode == InputMode.SECTOR) {
                mainCanvas.highlightSector(this.activeSector);
            }
        }
        else {
            if (Input.mode == InputMode.VERTEX) {
                mainCanvas.highlightVertex(Input.mouseGridPos);
            }
            if (Input.mode == InputMode.EDGE) {
                mainCanvas.highlightEdge(mapData.getNearestEdge(Input.mousePos));
            }
            if (Input.mode == InputMode.SECTOR) {
                mainCanvas.highlightSector(mapData.getNearestSector(Input.mousePos));
            }
        }
    };
    Translate.prototype.onUnswitch = function () {
        Input.lockModes = false;
    };
    return Translate;
}());
var Extrude = /** @class */ (function () {
    function Extrude() {
        this.name = "extrude tool";
        this.selectKey = "e";
        this.extruding = false;
    }
    Extrude.prototype.onSwitch = function () {
        Input.switchMode(InputMode.EDGE);
    };
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
        var edge3 = new Edge(this.targetEdge.start, this.targetEdge.end);
        edge3.translate(this.translation);
        var edge2 = new Edge(edge3.end, edge1.start);
        var edge4 = new Edge(edge1.end, edge3.start);
        newSector.edges.push(edge1);
        newSector.edges.push(edge2);
        newSector.edges.push(edge3);
        newSector.edges.push(edge4);
        newSector.update();
        mapData.sectors.push(newSector);
        this.targetEdge.clearModifiers();
        this.targetEdge.dirty = true;
        this.targetEdge.edgeLink = edge1;
        edge1.edgeLink = this.targetEdge;
        var animEdge = {
            edges: [edge1, edge2, edge3, edge4],
            alpha: 1
        };
        new Anim(animEdge, "alpha", 0, 0.2, null, function () {
            mainCanvas.drawBasicEdges(animEdge.edges, Color.rgbaToHex(1, 1, 1, animEdge.alpha), (1.0 - animEdge.alpha) * 30, false);
        });
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
    if (activeTool != null && activeTool.onUnswitch) {
        activeTool.onUnswitch();
    }
    activeTool = tool;
    if (activeTool.onSwitch) {
        activeTool.onSwitch();
    }
}
tools.push(new Translate());
tools.push(new Extrude());
changeTool(tools[0]);
//# sourceMappingURL=tools.js.map