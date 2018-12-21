var Extrude = /** @class */ (function () {
    function Extrude() {
        this.name = "Extrude";
        this.selectKey = "w";
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
        if (edge.edgeLink != null)
            return;
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
        newSector.edges.push(edge4);
        newSector.edges.push(edge3);
        newSector.edges.push(edge2);
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
//# sourceMappingURL=extrude.js.map