class BuilderCanvas {

    ICON_VERTEX_MODE : HTMLImageElement;
    ICON_EDGE_MODE : HTMLImageElement;
    ICON_SECTOR_MODE : HTMLImageElement;

    // Constants
    CANVAS_BG_COLOR : string        = "#434043";
    GRID_COLOR : string             = "#000000";
    GRID_CENTER_COLOR : string      = "#888888";
    MAPLINE_2S_COLOR : string          = "#884422";
    MAPLINE_COLOR : string          = "#888888";
    MAPPROCLINE_COLOR : string          = "#ffcc88";
    VERTEX_COLOR : string           = "#FF9944";
    HIGHLIGHT_COLOR : string       = "#FFFFFF55";
    SELECTION_COLOR : string       = "#FFDD8855";
    ACTIVE_FONT_COLOR : string       = "#FFFFFFFF";
    INACTIVE_FONT_COLOR : string       = "#FFFFFF77";

    VERTEX_SIZE : number            = 2;
    ZOOM_SPEED : number             = 1.05;
    GRIDLINE_WIDTH : number         = 0.5;
    PERP_LENGTH : number            = 5.0;

    viewOffset : Vertex;
    zoom : number = 1.0;
    gridSize : number = 32;

    canvas : HTMLCanvasElement;
    ctx : CanvasRenderingContext2D;

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
    }


    public modeSelectionOffset:Vertex = new Vertex(10,74);
    private toolSpacing:number = 24;

    public drawIcons() {
        this.ctx.drawImage(this.ICON_VERTEX_MODE, 10, 10, 64, 64);
        this.ctx.drawImage(this.ICON_EDGE_MODE, 84, 10, 64, 64);
        this.ctx.drawImage(this.ICON_SECTOR_MODE, 158, 10, 64, 64);

        this.ctx.strokeStyle = this.HIGHLIGHT_COLOR;
        this.ctx.lineWidth = 5;
        this.ctx.beginPath();
        this.ctx.moveTo(this.modeSelectionOffset.x, this.modeSelectionOffset.y);
        this.ctx.lineTo(this.modeSelectionOffset.x + 64, this.modeSelectionOffset.y);
        this.ctx.stroke();

        this.ctx.textBaseline = "middle";

        this.ctx.textAlign = "left";
        this.ctx.fillStyle = this.INACTIVE_FONT_COLOR;
        this.ctx.font = "18px Ubuntu Mono";
        this.ctx.fillText("Tools", 20, 110);
        
        for (let i = 0; i < Tool.tools.length; i++) {
            if (Tool.tools[i] == Tool.activeTool) {
                this.ctx.fillStyle = this.ACTIVE_FONT_COLOR;
            } else {
                this.ctx.fillStyle = this.INACTIVE_FONT_COLOR;
            }
            this.ctx.textAlign = "left";
            this.ctx.font = "18px Ubuntu Mono";
            this.ctx.fillText(Tool.tools[i].name, 40, 140 + (i*this.toolSpacing));

            this.ctx.textAlign = "center";
            this.ctx.fillStyle = this.ACTIVE_FONT_COLOR;
            this.ctx.font = "12px Open Sans";
            this.ctx.fillText(Tool.tools[i].selectKey.toLocaleUpperCase(), 20, 140 + (i*this.toolSpacing));

            this.ctx.strokeStyle = this.ACTIVE_FONT_COLOR;
            this.ctx.beginPath;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.ellipse(20, 138.5 + (i*this.toolSpacing), 9, 9, 0, 0, Math.PI*2);
            this.ctx.stroke();
        }
    }

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
                this.drawEdges(sectors[i].edges, this.MAPLINE_COLOR, 1.0);
            }
        }
    }

    drawVertex(vertex:Vertex):void {
        this.ctx.fillStyle = this.VERTEX_COLOR;
        let p = this.posToView(vertex);
        this.ctx.fillRect(p.x - this.VERTEX_SIZE, p.y - this.VERTEX_SIZE, this.VERTEX_SIZE * 2, this.VERTEX_SIZE * 2);
    }

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

    public highlightVertex(v:Vertex, color:string = this.HIGHLIGHT_COLOR) {
        let p = this.posToView(v);
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.ellipse(p.x, p.y, 5, 5, 0, 0, Math.PI * 2);
        this.ctx.fill();
    }

    public highlightEdge(e:Edge, color:string = this.HIGHLIGHT_COLOR) {
        let p = this.posToView(e.start);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 5;
        this.ctx.beginPath();
        this.ctx.moveTo(p.x, p.y);
        p = this.posToView(e.end);
        this.ctx.lineTo(p.x, p.y);
        this.ctx.stroke();
    }

    public highlightSector(s:Sector, color:string = this.HIGHLIGHT_COLOR) {
        if (s == null) return;
        this.drawBasicEdges(s.edges, color, 5, false);
    }
}