var JZBuilder;
(function (JZBuilder) {
    var EditMode;
    (function (EditMode) {
        EditMode[EditMode["VERTEX"] = 0] = "VERTEX";
        EditMode[EditMode["LINE"] = 1] = "LINE";
        EditMode[EditMode["SECTOR"] = 2] = "SECTOR";
        EditMode[EditMode["THING"] = 3] = "THING";
    })(EditMode = JZBuilder.EditMode || (JZBuilder.EditMode = {}));
    var BuilderCanvas = /** @class */ (function () {
        function BuilderCanvas(canvas) {
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
            this.viewOffset = new JZBuilder.Point(-400, -300);
            this.zoom = 1.0;
            this.gridSize = 32;
            this.canvas = canvas;
            this.ctx = this.canvas.getContext('2d');
        }
        BuilderCanvas.prototype.posToView = function (p) {
            return new JZBuilder.Point((p.x / this.zoom) - this.viewOffset.x, (p.y / this.zoom) - this.viewOffset.y);
        };
        BuilderCanvas.prototype.viewToPos = function (p) {
            return new JZBuilder.Point((p.x + this.viewOffset.x) * this.zoom, (p.y + this.viewOffset.y) * this.zoom);
        };
        BuilderCanvas.prototype.redraw = function () {
            this.drawGrid();
            this.drawSectors();
            this.drawMapLines();
            this.drawDrawLines();
            this.drawVertexes();
            this.drawSelectedLines();
            this.drawHighlightedLines();
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
            for (i = 0; i < this.canvas.width; i++) {
                if ((i + this.viewOffset.y) % Math.round(this.gridSize / this.zoom) == 0) {
                    if (i + this.viewOffset.y == 0)
                        this.ctx.strokeStyle = this.GRID_CENTER_COLOR;
                    this.ctx.beginPath();
                    this.ctx.moveTo(0, i);
                    this.ctx.lineTo(this.canvas.height, i);
                    this.ctx.stroke();
                    if (i + this.viewOffset.y == 0)
                        this.ctx.strokeStyle = this.GRID_COLOR;
                }
            }
        };
        BuilderCanvas.prototype.drawSectors = function () {
        };
        BuilderCanvas.prototype.drawMapLines = function () {
            this.drawLines(this.mapData.lines, this.MAPLINE_COLOR);
        };
        BuilderCanvas.prototype.drawDrawLines = function () {
            //this.drawLines(this.mapData.lines, this.MAPLINE_COLOR);
        };
        BuilderCanvas.prototype.drawVertexes = function () {
        };
        BuilderCanvas.prototype.drawSelectedLines = function () {
            //this.drawLines(this.mapData.lines, this.MAPLINE_COLOR);
        };
        BuilderCanvas.prototype.drawHighlightedLines = function () {
            //this.drawLines(this.mapData.lines, this.MAPLINE_COLOR);
        };
        BuilderCanvas.prototype.drawLines = function (lines, color, width) {
            if (width === void 0) { width = 1.0; }
        };
        return BuilderCanvas;
    }());
    JZBuilder.BuilderCanvas = BuilderCanvas;
})(JZBuilder || (JZBuilder = {}));
//# sourceMappingURL=canvas.js.map