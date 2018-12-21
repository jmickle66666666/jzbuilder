var Translate = /** @class */ (function () {
    function Translate() {
        this.name = "Move/Edit/Select";
        this.selectKey = "q";
        this.dragging = false;
        this.lastPos = Input.mouseGridPos;
    }
    Translate.prototype.onMouseDown = function () {
        if (Input.mode == InputMode.VERTEX) {
            var v = mapData.getNearestVertex(Input.mousePos);
            if (pointDistance(v, Input.mousePos) < 64) {
                this.activeVertices = mapData.getVerticesAt(v);
                if (this.activeVertices.length > 0) {
                    this.dragging = true;
                    Input.lockModes = true;
                    this.lastPos = Input.mouseGridPos;
                }
            }
        }
        if (Input.mode == InputMode.EDGE) {
            this.activeEdge = mapData.getNearestEdge(Input.mouseGridPos);
            this.activeVertices = new Array();
            this.activeVertices = this.activeVertices.concat(mapData.getVerticesAt(this.activeEdge.start));
            this.activeVertices = this.activeVertices.concat(mapData.getVerticesAt(this.activeEdge.end));
            this.dragging = true;
            Input.lockModes = true;
            this.lastPos = Input.mouseGridPos;
        }
        if (Input.mode == InputMode.SECTOR) {
            this.activeSector = mapData.getNearestSector(Input.mouseGridPos);
            var verts_1 = new Array();
            this.activeSector.edges.forEach(function (e) {
                verts_1 = verts_1.concat(mapData.getVerticesAt(e.start));
                verts_1 = verts_1.concat(mapData.getVerticesAt(e.end));
            });
            this.activeVertices = verts_1.filter(function (item, pos) {
                return verts_1.indexOf(item) == pos;
            });
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
        if (this.dragging) {
            if (!this.lastPos.equals(Input.mouseGridPos)) {
                var diff_1 = Vertex.Subtract(Input.mouseGridPos, this.lastPos);
                this.activeVertices.forEach(function (v) {
                    v.translate(diff_1);
                    mapData.getEdgesWithVertex(v).forEach(function (e) { return e.dirty = true; });
                });
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
                var v = mapData.getNearestVertex(Input.mousePos);
                if (pointDistance(v, Input.mousePos) < 64) {
                    mainCanvas.highlightVertex(v);
                }
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
//# sourceMappingURL=translate.js.map