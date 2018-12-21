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
var BuilderCanvas = /** @class */ (function () {
    //     mapData : MapData;
    //     drawingLines : Array<Line>;
    //     selectedLines : Array<Line>;
    //     highlightSector : number;
    //     highlightLines : Array<Line>;
    function BuilderCanvas(canvas) {
        //     // Constants
        this.CANVAS_BG_COLOR = "#434043";
        this.GRID_COLOR = "#000000";
        this.GRID_CENTER_COLOR = "#888888";
        //     DRAWLINE_COLOR : string         = "#998811";
        this.MAPLINE_2S_COLOR = "#884422";
        this.MAPLINE_COLOR = "#888888";
        this.MAPPROCLINE_COLOR = "#ffcc88";
        //     HIGHLIGHTLINE_COLOR : string    = "#FFFFFF";
        this.VERTEX_COLOR = "#FF9944";
        this.HIGHLIGHT_COLOR = "#FFFFFF55";
        this.ACTIVE_FONT_COLOR = "#FFFFFFFF";
        this.INACTIVE_FONT_COLOR = "#FFFFFF77";
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
        this.VERTEX_SIZE = 2;
        this.ZOOM_SPEED = 1.05;
        this.GRIDLINE_WIDTH = 0.5;
        this.PERP_LENGTH = 5.0;
        this.zoom = 1.0;
        this.gridSize = 32;
        this.modeSelectionOffset = new Vertex(10, 74);
        this.canvas = canvas;
        this.viewOffset = new Vertex(-Math.round(canvas.clientWidth * 0.5), -Math.round(canvas.clientHeight * 0.5));
        this.ctx = this.canvas.getContext('2d');
        this.ctx.canvas.width = canvas.clientWidth;
        this.ctx.canvas.height = canvas.clientHeight;
        this.ctx.lineCap = "round";
        this.ICON_VERTEX_MODE = document.getElementById('vertexmode');
        this.ICON_EDGE_MODE = document.getElementById('edgemode');
        this.ICON_SECTOR_MODE = document.getElementById('sectormode');
    }
    BuilderCanvas.prototype.posToView = function (p) {
        return new Vertex((p.x / this.zoom) - this.viewOffset.x, (p.y / this.zoom) - this.viewOffset.y);
    };
    BuilderCanvas.prototype.viewToPos = function (p) {
        return new Vertex((p.x + this.viewOffset.x) * this.zoom, (p.y + this.viewOffset.y) * this.zoom);
    };
    BuilderCanvas.prototype.viewToGridPos = function (p) {
        var mp = this.viewToPos(p);
        mp.x = Math.round(mp.x / this.gridSize) * this.gridSize;
        mp.y = Math.round(mp.y / this.gridSize) * this.gridSize;
        return mp;
    };
    BuilderCanvas.prototype.redraw = function () {
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
    };
    BuilderCanvas.prototype.drawIcons = function () {
        this.ctx.drawImage(this.ICON_VERTEX_MODE, 10, 10, 64, 64);
        this.ctx.drawImage(this.ICON_EDGE_MODE, 84, 10, 64, 64);
        this.ctx.drawImage(this.ICON_SECTOR_MODE, 158, 10, 64, 64);
        this.ctx.strokeStyle = this.HIGHLIGHT_COLOR;
        this.ctx.lineWidth = 5;
        this.ctx.beginPath();
        this.ctx.moveTo(this.modeSelectionOffset.x, this.modeSelectionOffset.y);
        this.ctx.lineTo(this.modeSelectionOffset.x + 64, this.modeSelectionOffset.y);
        this.ctx.stroke();
        this.ctx.font = "18px Ubuntu Mono";
        for (var i = 0; i < tools.length; i++) {
            if (tools[i] == activeTool) {
                this.ctx.fillStyle = this.ACTIVE_FONT_COLOR;
            }
            else {
                this.ctx.fillStyle = this.INACTIVE_FONT_COLOR;
            }
            this.ctx.fillText('[' + tools[i].selectKey + '] ' + tools[i].name, 10, 120 + (i * 20));
        }
    };
    //     drawDebug() {
    //         this.ctx.strokeText(Input.state.toString(), 10, 10);
    //     }
    BuilderCanvas.prototype.drawGrid = function () {
        this.ctx.fillStyle = this.CANVAS_BG_COLOR;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.lineWidth = this.GRIDLINE_WIDTH;
        this.ctx.strokeStyle = this.GRID_COLOR;
        var vo = this.viewOffset.clone();
        vo.x = Math.round(vo.x);
        vo.y = Math.round(vo.y);
        var i;
        for (i = 0; i < this.canvas.width; i++) {
            if ((i + vo.x) % Math.round(this.gridSize / this.zoom) == 0) {
                if (i + vo.x == 0)
                    this.ctx.strokeStyle = this.GRID_CENTER_COLOR;
                this.ctx.beginPath();
                this.ctx.moveTo(i, 0);
                this.ctx.lineTo(i, this.canvas.height);
                this.ctx.stroke();
                if (i + vo.x == 0)
                    this.ctx.strokeStyle = this.GRID_COLOR;
            }
        }
        for (i = 0; i < this.canvas.height; i++) {
            if ((i + vo.y) % Math.round(this.gridSize / this.zoom) == 0) {
                if (i + vo.y == 0)
                    this.ctx.strokeStyle = this.GRID_CENTER_COLOR;
                this.ctx.beginPath();
                this.ctx.moveTo(0, i);
                this.ctx.lineTo(this.canvas.width, i);
                this.ctx.stroke();
                if (i + vo.y == 0)
                    this.ctx.strokeStyle = this.GRID_COLOR;
            }
        }
    };
    BuilderCanvas.prototype.drawSectors = function (sectors) {
        if (sectors.length != 0) {
            this.ctx.imageSmoothingEnabled = false;
            for (var i = 0; i < sectors.length; i++) {
                // let p = this.posToView(sectors[i].bounds.topLeft);
                // this.ctx.drawImage(this.mapData.sectors[i].preview, p.x, p.y, this.mapData.sectors[i].bounds.width / this.zoom, this.mapData.sectors[i].bounds.height / this.zoom);
                this.drawEdges(sectors[i].edges, this.MAPLINE_COLOR, 1.0);
            }
        }
    };
    //     drawMapLines():void {
    //         this.drawLines(this.mapData.lines, this.MAPLINE_COLOR);
    //     }
    //     drawDrawLines():void {
    //         this.drawLines(this.drawingLines, this.DRAWLINE_COLOR, 2, false);
    //     }
    BuilderCanvas.prototype.drawVertex = function (vertex) {
        this.ctx.fillStyle = this.VERTEX_COLOR;
        // let allLines:Array<Line> = mapData.getAllLines();
        // for (let i = 0; i < allLines.length; i++) {
        var p = this.posToView(vertex);
        this.ctx.fillRect(p.x - this.VERTEX_SIZE, p.y - this.VERTEX_SIZE, this.VERTEX_SIZE * 2, this.VERTEX_SIZE * 2);
        // }
        // if (editMode == EditMode.VERTEX) {
        //     this.ctx.fillStyle = this.DRAWVERTEX_COLOR;
        //     let p = this.posToView(Input.mouseGridPos);
        //     this.ctx.fillRect(p.x - this.VERTEX_SIZE, p.y - this.VERTEX_SIZE, this.VERTEX_SIZE * 2, this.VERTEX_SIZE * 2);
        // }
    };
    //     drawSelectedLines():void {
    //         this.drawLines(this.selectedLines, this.SELECTEDLINE_COLOR, 2.0);
    //     }
    //     drawHighlightedLines():void {
    //         if (this.highlightLines != null) this.drawLines(this.highlightLines, this.HIGHLIGHTLINE_COLOR, 2.0);
    //     }
    BuilderCanvas.prototype.drawBasicEdges = function (edges, color, width, drawNodule) {
        if (width === void 0) { width = 1.0; }
        if (drawNodule === void 0) { drawNodule = true; }
        if (edges == null)
            return;
        if (edges.length == 0)
            return;
        this.ctx.lineWidth = width;
        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        for (var i = 0; i < edges.length; i++) {
            if (edges[i] != null) {
                var p = this.posToView(edges[i].start);
                this.ctx.moveTo(p.x, p.y);
                p = this.posToView(edges[i].end);
                this.ctx.lineTo(p.x, p.y);
                if (drawNodule) {
                    p = this.posToView(edges[i].getMidpoint());
                    this.ctx.moveTo(p.x, p.y);
                    var perp = edges[i].getPerpendicular();
                    this.ctx.lineTo(p.x - (perp.x * this.PERP_LENGTH), p.y - (perp.y * this.PERP_LENGTH));
                }
            }
        }
        this.ctx.stroke();
        for (var i = 0; i < edges.length; i++) {
            this.drawVertex(edges[i].start);
            this.drawVertex(edges[i].end);
        }
    };
    BuilderCanvas.prototype.drawEdges = function (edges, color, width, drawNodule) {
        if (width === void 0) { width = 1.0; }
        if (drawNodule === void 0) { drawNodule = true; }
        if (edges == null)
            return;
        if (edges.length == 0)
            return;
        this.ctx.lineWidth = width;
        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        for (var i = 0; i < edges.length; i++) {
            if (edges[i] != null && edges[i].edgeLink == null) {
                var p = this.posToView(edges[i].start);
                this.ctx.moveTo(p.x, p.y);
                p = this.posToView(edges[i].end);
                this.ctx.lineTo(p.x, p.y);
                if (drawNodule) {
                    p = this.posToView(edges[i].getMidpoint());
                    this.ctx.moveTo(p.x, p.y);
                    var perp = edges[i].getPerpendicular();
                    this.ctx.lineTo(p.x - (perp.x * this.PERP_LENGTH), p.y - (perp.y * this.PERP_LENGTH));
                }
            }
        }
        this.ctx.stroke();
        this.drawBasicEdges(edges.filter(function (e) { return e.edgeLink != null; }), this.MAPLINE_2S_COLOR);
        this.ctx.lineWidth = width;
        this.ctx.strokeStyle = this.MAPPROCLINE_COLOR;
        this.ctx.beginPath();
        for (var i = 0; i < edges.length; i++) {
            if (edges[i].edgeLink == null) {
                var e = edges[i].process();
                var p = this.posToView(e.vertices[0]);
                this.ctx.moveTo(p.x, p.y);
                for (var i_1 = 1; i_1 < e.vertices.length; i_1++) {
                    p = this.posToView(e.vertices[i_1]);
                    this.drawVertex(e.vertices[i_1]);
                    this.ctx.lineTo(p.x, p.y);
                }
            }
        }
        this.ctx.stroke();
        for (var i = 0; i < edges.length; i++) {
            this.drawVertex(edges[i].start);
            this.drawVertex(edges[i].end);
        }
    };
    BuilderCanvas.prototype.highlightVertex = function (v) {
        var p = this.posToView(v);
        this.ctx.fillStyle = this.HIGHLIGHT_COLOR;
        this.ctx.beginPath();
        this.ctx.ellipse(p.x, p.y, 5, 5, 0, 0, Math.PI * 2);
        this.ctx.fill();
    };
    BuilderCanvas.prototype.highlightEdge = function (e) {
        var p = this.posToView(e.start);
        this.ctx.strokeStyle = this.HIGHLIGHT_COLOR;
        this.ctx.lineWidth = 5;
        this.ctx.beginPath();
        this.ctx.moveTo(p.x, p.y);
        p = this.posToView(e.end);
        this.ctx.lineTo(p.x, p.y);
        this.ctx.stroke();
    };
    BuilderCanvas.prototype.highlightSector = function (s) {
        this.drawBasicEdges(s.edges, this.HIGHLIGHT_COLOR, 5, false);
    };
    return BuilderCanvas;
}());
//# sourceMappingURL=canvas.js.map