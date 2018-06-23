var EditMode;
(function (EditMode) {
    EditMode[EditMode["VERTEX"] = 0] = "VERTEX";
    EditMode[EditMode["LINE"] = 1] = "LINE";
    EditMode[EditMode["SECTOR"] = 2] = "SECTOR";
    EditMode[EditMode["THING"] = 3] = "THING";
    EditMode[EditMode["MAKESECTOR"] = 4] = "MAKESECTOR";
})(EditMode || (EditMode = {}));
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
var BuilderCanvas = /** @class */ (function () {
    function BuilderCanvas(canvas, mapData) {
        // Constants
        this.CANVAS_BG_COLOR = "#434043";
        this.GRID_COLOR = "#000000";
        this.GRID_CENTER_COLOR = "#888888";
        this.DRAWLINE_COLOR = "#998811";
        this.MAPLINE_COLOR = "#cccccc";
        this.HIGHLIGHTLINE_COLOR = "#FFFFFF";
        this.VERTEX_COLOR = "#FF8811";
        this.DRAWVERTEX_COLOR = "#FFFFFF";
        this.SECTOR_COLOR = "#22441144";
        this.SELECTEDLINE_COLOR = "#FFAA11";
        this.LINE_SELECT_DISTANCE = 5;
        this.VERTEX_SIZE = 2;
        this.ZOOM_SPEED = 1.05;
        this.GRIDLINE_WIDTH = 0.5;
        this.PERP_LENGTH = 5.0;
        this.zoom = 1.0;
        this.gridSize = 32;
        this.mapData = mapData;
        this.canvas = canvas;
        this.drawingLines = new Array();
        this.selectedLines = new Array();
        this.viewOffset = new Vertex(-Math.round(canvas.clientWidth * 0.5), -Math.round(canvas.clientHeight * 0.5));
        this.ctx = this.canvas.getContext('2d');
        this.ctx.canvas.width = canvas.clientWidth;
        this.ctx.canvas.height = canvas.clientHeight;
    }
    BuilderCanvas.prototype.resetDefaultColors = function () {
        this.CANVAS_BG_COLOR = "#434043";
        this.GRID_COLOR = "#000000";
        this.GRID_CENTER_COLOR = "#888888";
        this.DRAWLINE_COLOR = "#998811";
        this.MAPLINE_COLOR = "#cccccc";
        this.HIGHLIGHTLINE_COLOR = "#FFFFFF";
        this.VERTEX_COLOR = "#FF8811";
        this.DRAWVERTEX_COLOR = "#FFFFFF";
        this.SECTOR_COLOR = "#22441144";
        this.SELECTEDLINE_COLOR = "#FFAA11";
    };
    BuilderCanvas.prototype.randomColors = function () {
        this.CANVAS_BG_COLOR = getRandomColor();
        this.GRID_COLOR = getRandomColor();
        this.GRID_CENTER_COLOR = getRandomColor();
        this.DRAWLINE_COLOR = getRandomColor();
        this.MAPLINE_COLOR = getRandomColor();
        this.HIGHLIGHTLINE_COLOR = getRandomColor();
        this.VERTEX_COLOR = getRandomColor();
        this.DRAWVERTEX_COLOR = getRandomColor();
        this.SELECTEDLINE_COLOR = getRandomColor();
        this.SECTOR_COLOR = getRandomColor() + "44";
        this.redraw();
    };
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
        this.drawSectors();
        this.drawMapLines();
        this.drawDrawLines();
        if (Input.state == InputState.EXTRUDING)
            this.drawExtrudeLine();
        this.drawVertexes();
        this.drawSelectedLines();
        this.drawHighlightedLines();
        this.drawAnimLines();
        //this.drawDebug();
    };
    BuilderCanvas.prototype.drawDebug = function () {
        this.ctx.strokeText(Input.state.toString(), 10, 10);
    };
    BuilderCanvas.prototype.drawGrid = function () {
        this.ctx.fillStyle = this.CANVAS_BG_COLOR;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.lineWidth = this.GRIDLINE_WIDTH;
        this.ctx.strokeStyle = this.GRID_COLOR;
        var i;
        for (i = 0; i < this.canvas.width; i++) {
            if ((i + this.viewOffset.x) % Math.round(this.gridSize / this.zoom) == 0) {
                if (i + this.viewOffset.x == 0)
                    this.ctx.strokeStyle = this.GRID_CENTER_COLOR;
                this.ctx.beginPath();
                this.ctx.moveTo(i, 0);
                this.ctx.lineTo(i, this.canvas.height);
                this.ctx.stroke();
                if (i + this.viewOffset.x == 0)
                    this.ctx.strokeStyle = this.GRID_COLOR;
            }
        }
        for (i = 0; i < this.canvas.height; i++) {
            if ((i + this.viewOffset.y) % Math.round(this.gridSize / this.zoom) == 0) {
                if (i + this.viewOffset.y == 0)
                    this.ctx.strokeStyle = this.GRID_CENTER_COLOR;
                this.ctx.beginPath();
                this.ctx.moveTo(0, i);
                this.ctx.lineTo(this.canvas.width, i);
                this.ctx.stroke();
                if (i + this.viewOffset.y == 0)
                    this.ctx.strokeStyle = this.GRID_COLOR;
            }
        }
    };
    BuilderCanvas.prototype.drawSectors = function () {
        if (this.mapData.sectors.length != 0) {
            this.ctx.imageSmoothingEnabled = false;
            for (var i = 0; i < mapData.sectors.length; i++) {
                var p = this.posToView(this.mapData.sectors[i].bounds.topLeft);
                this.ctx.drawImage(this.mapData.sectors[i].preview, p.x, p.y, this.mapData.sectors[i].bounds.width / this.zoom, this.mapData.sectors[i].bounds.height / this.zoom);
                this.drawLines(this.mapData.sectors[i].lines, (i == this.highlightSector) ? this.HIGHLIGHTLINE_COLOR : this.MAPLINE_COLOR, (i == this.highlightSector) ? 2.0 : 1.0);
            }
        }
    };
    BuilderCanvas.prototype.drawMapLines = function () {
        this.drawLines(this.mapData.lines, this.MAPLINE_COLOR);
    };
    BuilderCanvas.prototype.drawDrawLines = function () {
        this.drawLines(this.drawingLines, this.DRAWLINE_COLOR, 2, false);
    };
    BuilderCanvas.prototype.drawVertexes = function () {
        this.ctx.fillStyle = this.VERTEX_COLOR;
        var allLines = mapData.getAllLines();
        for (var i = 0; i < allLines.length; i++) {
            var p = this.posToView(allLines[i].start);
            this.ctx.fillRect(p.x - this.VERTEX_SIZE, p.y - this.VERTEX_SIZE, this.VERTEX_SIZE * 2, this.VERTEX_SIZE * 2);
            p = this.posToView(allLines[i].end);
            this.ctx.fillRect(p.x - this.VERTEX_SIZE, p.y - this.VERTEX_SIZE, this.VERTEX_SIZE * 2, this.VERTEX_SIZE * 2);
        }
        if (editMode == EditMode.VERTEX) {
            this.ctx.fillStyle = this.DRAWVERTEX_COLOR;
            var p = this.posToView(Input.mouseGridPos);
            this.ctx.fillRect(p.x - this.VERTEX_SIZE, p.y - this.VERTEX_SIZE, this.VERTEX_SIZE * 2, this.VERTEX_SIZE * 2);
        }
    };
    BuilderCanvas.prototype.drawSelectedLines = function () {
        this.drawLines(this.selectedLines, this.SELECTEDLINE_COLOR, 2.0);
    };
    BuilderCanvas.prototype.drawHighlightedLines = function () {
        if (this.highlightLines != null)
            this.drawLines(this.highlightLines, this.HIGHLIGHTLINE_COLOR, 2.0);
    };
    BuilderCanvas.prototype.drawLines = function (lines, color, width, drawNodule) {
        if (width === void 0) { width = 1.0; }
        if (drawNodule === void 0) { drawNodule = true; }
        if (lines == null)
            return;
        if (lines.length == 0)
            return;
        this.ctx.lineWidth = width;
        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        for (var i = 0; i < lines.length; i++) {
            if (lines[i] != null) {
                var p = this.posToView(lines[i].start);
                this.ctx.moveTo(p.x, p.y);
                p = this.posToView(lines[i].end);
                this.ctx.lineTo(p.x, p.y);
                if (drawNodule) {
                    p = this.posToView(lines[i].getMidpoint());
                    this.ctx.moveTo(p.x, p.y);
                    var perp = lines[i].getPerpendicular();
                    this.ctx.lineTo(p.x - (perp.x * this.PERP_LENGTH), p.y - (perp.y * this.PERP_LENGTH));
                }
            }
        }
        this.ctx.stroke();
    };
    BuilderCanvas.prototype.drawExtrudeLine = function () {
        this.drawLines([
            new Line(extrudeEnd.start, extrudeStart.end),
            extrudeEnd,
            new Line(extrudeStart.start, extrudeEnd.end),
            extrudeStart
        ], this.DRAWLINE_COLOR, 2.0, false);
    };
    BuilderCanvas.prototype.drawAnimLines = function () {
        if (Anim.animLines.length == 0)
            return;
        for (var i = 0; i < Anim.animLines.length; i++) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = Anim.animLines[i].getColorString();
            this.ctx.lineWidth = Anim.animLines[i].width;
            var p = this.posToView(Anim.animLines[i].line.start);
            this.ctx.moveTo(p.x, p.y);
            p = this.posToView(Anim.animLines[i].line.end);
            this.ctx.lineTo(p.x, p.y);
            this.ctx.stroke();
        }
    };
    return BuilderCanvas;
}());
//# sourceMappingURL=canvas.js.map