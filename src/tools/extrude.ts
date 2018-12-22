class Extrude implements Tool {
    name:string = "Extrude";
    selectKey:string = "w";

    extruding:Boolean = false;
    targetEdge:Edge;
    translation:Vertex;
    initialPosition:Vertex;

    public onSwitch():void {
        Input.switchMode(InputMode.EDGE);
    }

    public onMouseMove(e:MouseEvent):void {
        if (this.extruding) {
            this.translation = Vertex.Subtract(Input.mouseGridPos, this.initialPosition);
        }
    }

    public onMouseDown(e:MouseEvent):void {
        if (Input.mode == InputMode.EDGE) {
            this.startExtrude(mapData.getNearestEdge(Input.mousePos));
        }
    }

    public onMouseUp(e:MouseEvent):void {
        if (this.extruding) {
            this.extruding = false;
            this.applyExtrude();
        }
    }

    startExtrude(edge:Edge):void {

        if (edge.edgeLink != null) return;

        this.extruding = true;
        this.targetEdge = edge;
        this.translation = new Vertex(0,0);
        this.initialPosition = Input.mouseGridPos;
    }

    applyExtrude():void {
        let newSector:Sector = new Sector();
        let edge1:Edge = this.targetEdge.reversedCopy();
        let edge3:Edge = new Edge(this.targetEdge.start, this.targetEdge.end);
        edge3.translate(this.translation);
        let edge2:Edge = new Edge(edge3.end, edge1.start);
        let edge4:Edge = new Edge(edge1.end, edge3.start);
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

        let animEdge = {
            edges : [edge1, edge2, edge3, edge4],
            alpha : 1
        }
        new Anim(animEdge, "alpha", 0, 0.2, null, function () {
            mainCanvas.drawBasicEdges(animEdge.edges, Color.rgbaToHex(1,1,1,animEdge.alpha), (1.0 - animEdge.alpha) * 30, false);
        });
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