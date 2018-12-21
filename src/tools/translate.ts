class Translate implements Tool {
    name:string = "Translate";
    selectKey:string = "t";
    lastPos:Vertex;
    dragging:Boolean = false;

    activeVertices:Array<Vertex>;
    activeEdge:Edge;
    activeSector:Sector;

    public constructor () {
        this.lastPos = Input.mouseGridPos;
    }
    
    public onMouseDown():void {
        if (Input.mode == InputMode.VERTEX) {
            let v = mapData.getNearestVertex(Input.mousePos);

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
            this.activeVertices = new Array<Vertex>();
            this.activeVertices = this.activeVertices.concat(mapData.getVerticesAt(this.activeEdge.start));
            this.activeVertices = this.activeVertices.concat(mapData.getVerticesAt(this.activeEdge.end));
            this.dragging = true;
            Input.lockModes = true;
            this.lastPos = Input.mouseGridPos;
        }

        if (Input.mode == InputMode.SECTOR) {
            this.activeSector = mapData.getNearestSector(Input.mouseGridPos);
            let verts = new Array<Vertex>();
            this.activeSector.edges.forEach(e => {
                verts = verts.concat(mapData.getVerticesAt(e.start));
                verts = verts.concat(mapData.getVerticesAt(e.end));
            });

            this.activeVertices = verts.filter(function(item, pos) {
                return verts.indexOf(item) == pos;
            })

            this.dragging = true;
            Input.lockModes = true;
            this.lastPos = Input.mouseGridPos;
        }
    }

    public onMouseUp():void {
        this.dragging = false
        Input.lockModes = false;
    }

    public onMouseMove():void {

        if (this.dragging) {
            if (!this.lastPos.equals(Input.mouseGridPos)) {

                let diff:Vertex = Vertex.Subtract(Input.mouseGridPos, this.lastPos);

                this.activeVertices.forEach(v => {
                    v.translate(diff);
                    mapData.getEdgesWithVertex(v).forEach(e => e.dirty = true);
                });

                this.lastPos.setTo(Input.mouseGridPos);
            }
        }
    }

    public onRender():void {

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
        } else {
            if (Input.mode == InputMode.VERTEX) {
                let v = mapData.getNearestVertex(Input.mousePos);
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
    }

    public onUnswitch():void {
        Input.lockModes = false;
    }
}