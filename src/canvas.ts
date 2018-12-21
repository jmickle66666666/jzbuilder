// Probably defunct

// enum EditMode {
//     VERTEX,
//     LINE,
//     SECTOR,
//     THING,
//     MAKESECTOR
// }

// function getRandomColor() {
//     var letters = '0123456789ABCDEF';
//     var color = '#';
//     for (var i = 0; i < 6; i++) {
//       color += letters[Math.floor(Math.random() * 16)];
//     }
//     return color;
//   }

class BuilderCanvas {

    ICON_VERTEX_MODE : HTMLImageElement;
    ICON_EDGE_MODE : HTMLImageElement;
    ICON_SECTOR_MODE : HTMLImageElement;

//     // Constants
    CANVAS_BG_COLOR : string        = "#434043";
    GRID_COLOR : string             = "#000000";
    GRID_CENTER_COLOR : string      = "#888888";
//     DRAWLINE_COLOR : string         = "#998811";
    MAPLINE_2S_COLOR : string          = "#884422";
    MAPLINE_COLOR : string          = "#888888";
    MAPPROCLINE_COLOR : string          = "#ffcc88";
//     HIGHLIGHTLINE_COLOR : string    = "#FFFFFF";
    VERTEX_COLOR : string           = "#FF9944";
    HIGHLIGHT_COLOR : string       = "#FFFFFF55";
//     SECTOR_COLOR : string           = "#22441144";
//     SELECTEDLINE_COLOR : string     = "#FFAA11";


//     public resetDefaultColors():void {
//         this.CANVAS_BG_COLOR        = "#434043";
//         this.GRID_COLOR             = "#000000";
//         this.GRID_CENTER_COLOR      = "#888888";
//         this.DRAWLINE_COLOR         = "#998811";
//         this.MAPLINE_COLOR          = "#cccccc";
//         this.HIGHLIGHTLINE_COLOR    = "#FFFFFF";
//         this.VERTEX_COLOR           = "#FF8811";
//         this.DRAWVERTEX_COLOR       = "#FFFFFF";
//         this.SECTOR_COLOR           = "#22441144";
//         this.SELECTEDLINE_COLOR     = "#FFAA11";
//     }

//     public randomColors():void {
//         this.CANVAS_BG_COLOR        = getRandomColor();
//         this.GRID_COLOR             = getRandomColor();
//         this.GRID_CENTER_COLOR      = getRandomColor();
//         this.DRAWLINE_COLOR         = getRandomColor();
//         this.MAPLINE_COLOR          = getRandomColor();
//         this.HIGHLIGHTLINE_COLOR    = getRandomColor();
//         this.VERTEX_COLOR           = getRandomColor();
//         this.DRAWVERTEX_COLOR       = getRandomColor();
//         this.SELECTEDLINE_COLOR     = getRandomColor();
//         this.SECTOR_COLOR           = getRandomColor()+"44";
//         this.redraw();
//     }

//     LINE_SELECT_DISTANCE : number   = 5;
    VERTEX_SIZE : number            = 2;
    ZOOM_SPEED : number             = 1.05;
    GRIDLINE_WIDTH : number         = 0.5;
    PERP_LENGTH : number            = 5.0;

    viewOffset : Vertex;
    zoom : number = 1.0;
    gridSize : number = 32;

    canvas : HTMLCanvasElement;
    ctx : CanvasRenderingContext2D;

//     mapData : MapData;

//     drawingLines : Array<Line>;
//     selectedLines : Array<Line>;
//     highlightSector : number;
//     highlightLines : Array<Line>;

    public constructor (canvas: HTMLCanvasElement) {
        this.canvas = canvas;

        this.viewOffset = new Vertex(-Math.round(canvas.clientWidth * 0.5), -Math.round(canvas.clientHeight * 0.5));

        this.ctx = <CanvasRenderingContext2D> this.canvas.getContext('2d');

        this.ctx.canvas.width = canvas.clientWidth;
        this.ctx.canvas.height = canvas.clientHeight;

        this.ctx.lineCap = "round";

        this.ICON_VERTEX_MODE = document.getElementById('vertexmode') as HTMLImageElement;
        this.ICON_EDGE_MODE = document.getElementById('edgemode') as HTMLImageElement;
        this.ICON_SECTOR_MODE = document.getElementById('sectormode') as HTMLImageElement;
    }

    public posToView(p:Vertex): Vertex {
        return new Vertex((p.x / this.zoom) - this.viewOffset.x, (p.y / this.zoom) - this.viewOffset.y);
    }

    public viewToPos(p:Vertex): Vertex {
        return new Vertex((p.x + this.viewOffset.x) * this.zoom, (p.y + this.viewOffset.y)* this.zoom);
    }

    public viewToGridPos(p:Vertex): Vertex {
        let mp = this.viewToPos(p);
        mp.x = Math.round(mp.x / this.gridSize) * this.gridSize;
        mp.y = Math.round(mp.y / this.gridSize) * this.gridSize;
        return mp;
    }

    public redraw():void {
        this.drawGrid();
        this.drawSectors(mapData.sectors);
        this.drawIcons();
        // this.drawMapLines();
        // this.drawDrawLines();
        // if (Input.state == InputState.EXTRUDING) this.drawExtrudeLine();
        // this.drawVertexes();
        // this.drawSelectedLines();
        // this.drawHighlightedLines();
        // this.drawAnimLines();
        //this.drawDebug();
    }


    public modeSelectionOffset:Vertex = new Vertex(10,74);
    drawIcons() {

        this.ctx.drawImage(this.ICON_VERTEX_MODE, 10, 10, 64, 64);
        this.ctx.drawImage(this.ICON_EDGE_MODE, 84, 10, 64, 64);
        this.ctx.drawImage(this.ICON_SECTOR_MODE, 158, 10, 64, 64);

        this.ctx.strokeStyle = this.HIGHLIGHT_COLOR;
        this.ctx.lineWidth = 5;
        this.ctx.beginPath();
        this.ctx.moveTo(this.modeSelectionOffset.x, this.modeSelectionOffset.y);
        this.ctx.lineTo(this.modeSelectionOffset.x + 64, this.modeSelectionOffset.y);
        this.ctx.stroke();

    }


//     drawDebug() {
//         this.ctx.strokeText(Input.state.toString(), 10, 10);
//     }

    drawGrid():void {
        this.ctx.fillStyle = this.CANVAS_BG_COLOR;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.lineWidth = this.GRIDLINE_WIDTH;
        this.ctx.strokeStyle = this.GRID_COLOR;

        let vo:Vertex = this.viewOffset.clone();
        vo.x = Math.round(vo.x);
        vo.y = Math.round(vo.y);

        let i;
        for (i = 0; i < this.canvas.width; i++) {
            if ( (i + vo.x) % Math.round(this.gridSize/this.zoom) == 0 ) {
                if (i + vo.x == 0) this.ctx.strokeStyle = this.GRID_CENTER_COLOR;
                this.ctx.beginPath();
                this.ctx.moveTo(i, 0);
                this.ctx.lineTo(i, this.canvas.height);
                this.ctx.stroke();
                if (i + vo.x == 0) this.ctx.strokeStyle = this.GRID_COLOR;
            }
        }

        for (i = 0; i < this.canvas.height; i++) {
            if ( (i + vo.y) % Math.round(this.gridSize/this.zoom) == 0 ) {
                if (i + vo.y == 0) this.ctx.strokeStyle = this.GRID_CENTER_COLOR;
                this.ctx.beginPath();
                this.ctx.moveTo(0, i);
                this.ctx.lineTo(this.canvas.width, i);
                this.ctx.stroke();
                if (i + vo.y == 0) this.ctx.strokeStyle = this.GRID_COLOR;
            }
        }
    }

    drawSectors(sectors:Array<Sector>):void {
        if (sectors.length != 0) {
            this.ctx.imageSmoothingEnabled = false;
            for (let i = 0; i < sectors.length; i++) {
                // let p = this.posToView(sectors[i].bounds.topLeft);
                // this.ctx.drawImage(this.mapData.sectors[i].preview, p.x, p.y, this.mapData.sectors[i].bounds.width / this.zoom, this.mapData.sectors[i].bounds.height / this.zoom);
                this.drawEdges(sectors[i].edges, this.MAPLINE_COLOR, 1.0);
            }
        }
    }

//     drawMapLines():void {
//         this.drawLines(this.mapData.lines, this.MAPLINE_COLOR);
//     }

//     drawDrawLines():void {
//         this.drawLines(this.drawingLines, this.DRAWLINE_COLOR, 2, false);
//     }

    drawVertex(vertex:Vertex):void {
        this.ctx.fillStyle = this.VERTEX_COLOR;
        // let allLines:Array<Line> = mapData.getAllLines();
        // for (let i = 0; i < allLines.length; i++) {
        let p = this.posToView(vertex);
        this.ctx.fillRect(p.x - this.VERTEX_SIZE, p.y - this.VERTEX_SIZE, this.VERTEX_SIZE * 2, this.VERTEX_SIZE * 2);
        // }

        // if (editMode == EditMode.VERTEX) {
        //     this.ctx.fillStyle = this.DRAWVERTEX_COLOR;
        //     let p = this.posToView(Input.mouseGridPos);
        //     this.ctx.fillRect(p.x - this.VERTEX_SIZE, p.y - this.VERTEX_SIZE, this.VERTEX_SIZE * 2, this.VERTEX_SIZE * 2);
        // }
    }

//     drawSelectedLines():void {
//         this.drawLines(this.selectedLines, this.SELECTEDLINE_COLOR, 2.0);
//     }

//     drawHighlightedLines():void {
//         if (this.highlightLines != null) this.drawLines(this.highlightLines, this.HIGHLIGHTLINE_COLOR, 2.0);
//     }

    drawBasicEdges(edges : Array<Edge>, color:string, width:number = 1.0, drawNodule:boolean = true):void {
        if (edges == null) return;
        if (edges.length == 0) return;
        this.ctx.lineWidth = width;
        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        for (let i = 0; i < edges.length; i++) {
            if (edges[i] != null) {
                let p:Vertex = this.posToView(edges[i].start);
                this.ctx.moveTo(p.x, p.y);
                p = this.posToView(edges[i].end);
                this.ctx.lineTo(p.x, p.y);
                if (drawNodule) {
                    p = this.posToView(edges[i].getMidpoint());
                    this.ctx.moveTo(p.x, p.y);
                    let perp = edges[i].getPerpendicular();
                    this.ctx.lineTo(p.x - (perp.x * this.PERP_LENGTH), p.y - (perp.y * this.PERP_LENGTH));
                }
            }
        }
        this.ctx.stroke();
            
        for (let i = 0; i < edges.length; i++) {
            this.drawVertex(edges[i].start);
            this.drawVertex(edges[i].end);
        }
    }

    drawEdges(edges : Array<Edge>, color:string, width:number = 1.0, drawNodule:boolean = true):void {
        if (edges == null) return;
        if (edges.length == 0) return;
        this.ctx.lineWidth = width;
        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        for (let i = 0; i < edges.length; i++) {
            if (edges[i] != null && edges[i].edgeLink == null) {
                let p:Vertex = this.posToView(edges[i].start);
                this.ctx.moveTo(p.x, p.y);
                p = this.posToView(edges[i].end);
                this.ctx.lineTo(p.x, p.y);
                if (drawNodule) {
                    p = this.posToView(edges[i].getMidpoint());
                    this.ctx.moveTo(p.x, p.y);
                    let perp = edges[i].getPerpendicular();
                    this.ctx.lineTo(p.x - (perp.x * this.PERP_LENGTH), p.y - (perp.y * this.PERP_LENGTH));
                }
            }
        }
        this.ctx.stroke();

        this.drawBasicEdges(edges.filter(e => e.edgeLink != null), this.MAPLINE_2S_COLOR);

        this.ctx.lineWidth = width;
        this.ctx.strokeStyle = this.MAPPROCLINE_COLOR;
        this.ctx.beginPath();
        for (let i = 0; i < edges.length; i++) {
            if (edges[i].edgeLink == null) {
                let e:ProcessedEdge = edges[i].process();
                let p:Vertex = this.posToView(e.vertices[0]);
                this.ctx.moveTo(p.x, p.y);
                
                for (let i = 1; i < e.vertices.length; i++) {
                    p = this.posToView(e.vertices[i]);
                    this.drawVertex(e.vertices[i]);
                    this.ctx.lineTo(p.x, p.y);
                }
            }
        }
        this.ctx.stroke();
            
        for (let i = 0; i < edges.length; i++) {
            this.drawVertex(edges[i].start);
            this.drawVertex(edges[i].end);
        }
    }

    public highlightVertex(v:Vertex) {
        let p = this.posToView(v);
        this.ctx.fillStyle = this.HIGHLIGHT_COLOR;
        this.ctx.beginPath();
        this.ctx.ellipse(p.x, p.y, 5, 5, 0, 0, Math.PI * 2);
        this.ctx.fill();
    }

    public highlightEdge(e:Edge) {
        let p = this.posToView(e.start);
        this.ctx.strokeStyle = this.HIGHLIGHT_COLOR;
        this.ctx.lineWidth = 5;
        this.ctx.beginPath();
        this.ctx.moveTo(p.x, p.y);
        p = this.posToView(e.end);
        this.ctx.lineTo(p.x, p.y);
        this.ctx.stroke();
    }

    public highlightSector(s:Sector) {
        this.drawBasicEdges(s.edges, this.HIGHLIGHT_COLOR, 5, false);
    }

//     drawExtrudeLine():void {
//         this.drawLines( [
//             new Line(extrudeEnd.start, extrudeStart.end),
//             extrudeEnd,
//             new Line(extrudeStart.start, extrudeEnd.end),
//             extrudeStart
//         ], this.DRAWLINE_COLOR, 2.0, false);
//     }

//     drawAnimLines():void {
//         if (Anim.animLines.length == 0) return;
//         for (let i = 0; i < Anim.animLines.length; i++) {
//             this.ctx.beginPath();
//             this.ctx.strokeStyle = Anim.animLines[i].getColorString();
//             this.ctx.lineWidth = Anim.animLines[i].width;
//             let p:Vertex = this.posToView(Anim.animLines[i].line.start);
//             this.ctx.moveTo(p.x, p.y);
//             p = this.posToView(Anim.animLines[i].line.end);
//             this.ctx.lineTo(p.x, p.y);
//             this.ctx.stroke();
//         }
//     }
}