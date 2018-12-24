class BaseTool implements ITool {
    name:string = "Move/Edit/Select";
    selectKey:string = "q";
    lastPos:Vertex;
    dragging:Boolean = false;

    activeVertices:Array<Vertex>;

    selectedVertexes:Array<Vertex>;
    selectedEdges:Array<Edge>;
    selectedSectors:Array<Sector>;

    dragged:Boolean;

    public constructor () {
        this.lastPos = Input.mouseGridPos;

        this.selectedVertexes = new Array<Vertex>();
        this.selectedEdges = new Array<Edge>();
        this.selectedSectors = new Array<Sector>();

        this.activeVertices = new Array<Vertex>();

        this.dragged = false;
    }

    public onModeChange(mode:InputMode) {
        // Select edges of selected sectors, select vertexes of selected edges
    }
    
    public onMouseDown(e:MouseEvent):void {

        this.dragged = false;
        this.dragging = true;
        this.lastPos = Input.mouseGridPos;

    }

    public onMouseUp(e:MouseEvent):void {
        this.dragging = false
        Input.lockModes = false;

        if (!this.dragged) {

            if (!Input.shiftHeld) {
                // Holding shift will concat selection, so otherwise we should clear the selection
    
                this.selectedVertexes.length = 0;
                this.selectedEdges.length = 0;
                this.selectedSectors.length = 0;
            }
    
            if (Input.mode == InputMode.VERTEX) {
                let v = mapData.getNearestVertex(Input.mousePos, 64);
    
                if (v) {
                    mapData.getVerticesAt(v, this.selectedVertexes);
                    this.updateActiveVertexes();
                }
            }
    
            if (Input.mode == InputMode.EDGE) {
                let e = mapData.getNearestEdge(Input.mousePos);
                let i = this.selectedEdges.indexOf(e);
                if (i >= 0) {
                    this.selectedEdges.splice(i, 1);
                } else {
                    this.selectedEdges.push(e);
                }
                this.updateActiveVertexes();
            }
    
            if (Input.mode == InputMode.SECTOR) {
                let s = mapData.getNearestSector(Input.mousePos);
                if (s) {
                    let i = this.selectedSectors.indexOf(s);
                    if (i >= 0) {
                        this.selectedSectors.splice(i, 1);
                    } else {
                        this.selectedSectors.push(s);
                    }
                    this.updateActiveVertexes();
                }
            }

        }
    }

    public onMouseMove(e:MouseEvent):void {
        if (this.dragging && this.activeVertices.length != 0) {
            if (!this.lastPos.equals(Input.mouseGridPos)) {

                this.dragged = true;

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

        if (Input.mode == InputMode.VERTEX) {
            this.selectedVertexes.forEach(v => {
                mainCanvas.highlightVertex(v, mainCanvas.SELECTION_COLOR);
            })
        }

        if (Input.mode == InputMode.EDGE) {
            this.selectedEdges.forEach(e => {
                mainCanvas.highlightEdge(e, mainCanvas.SELECTION_COLOR);
            });
        }

        if (Input.mode == InputMode.SECTOR) {
            this.selectedSectors.forEach(s => {
                mainCanvas.highlightSector(s, mainCanvas.SELECTION_COLOR);
            })
        }

        if (Input.mode == InputMode.VERTEX) {
            let v = mapData.getNearestVertex(Input.mousePos, 64);
            if (v) {
                mainCanvas.highlightVertex(v, mainCanvas.HIGHLIGHT_COLOR);
            }
        }

        if (Input.mode == InputMode.EDGE) {
            mainCanvas.highlightEdge(mapData.getNearestEdge(Input.mousePos), mainCanvas.HIGHLIGHT_COLOR);
        }

        if (Input.mode == InputMode.SECTOR) {
            let s = mapData.getNearestSector(Input.mousePos);
            if (s) {
                mainCanvas.highlightSector(s, mainCanvas.HIGHLIGHT_COLOR);
            }
        }

    }

    public onSwitch():void {
        this.selectedVertexes.length = 0;
        this.selectedEdges.length = 0;
        this.selectedSectors.length = 0;
    }

    public onUnswitch():void {
        Input.lockModes = false;
    }

    updateActiveVertexes():void {
        this.activeVertices.length = 0;

        this.selectedVertexes.forEach(v => {
            if (this.activeVertices.indexOf(v) == -1) {
                this.activeVertices.push(v);
            }
        });

        this.selectedEdges.forEach(e => {
            mapData.getVerticesAt(e.start, this.activeVertices);
            mapData.getVerticesAt(e.end, this.activeVertices);
        });

        this.selectedSectors.forEach(s => {
            s.edges.forEach(e =>{
                mapData.getVerticesAt(e.start, this.activeVertices);
                mapData.getVerticesAt(e.end, this.activeVertices);
            });
        });
    }
}