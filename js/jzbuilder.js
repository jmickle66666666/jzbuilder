var Anim = /** @class */ (function () {
    function Anim(obj, valueName, targetValue, lerpSpeed, onComplete, onRender) {
        if (onComplete === void 0) { onComplete = null; }
        if (onRender === void 0) { onRender = null; }
        this.lerpSpeed = lerpSpeed;
        this.obj = obj;
        this.valueName = valueName;
        this.targetValue = targetValue;
        this.timer = 1.0;
        this.onComplete = onComplete;
        this.onRender = onRender;
        if (Anim.animators == null) {
            Anim.animators = new Array();
        }
        Anim.animators.push(this);
    }
    Anim.prototype.render = function () {
        if (this.onRender) {
            this.onRender();
        }
    };
    Anim.prototype.update = function () {
        this.obj[this.valueName] = this.lerp(this.obj[this.valueName], this.targetValue, this.lerpSpeed);
        this.timer = this.lerp(this.timer, 0, this.lerpSpeed);
        if (this.timer < 0.01) {
            if (this.onComplete) {
                this.onComplete();
            }
            Anim.remove(this);
        }
    };
    Anim.prototype.lerp = function (a, b, amt) {
        return (b * amt) + (a * (1 - amt));
    };
    Anim.prototype.cancel = function () {
        Anim.remove(this);
    };
    Anim.update = function () {
        if (this.animators == null)
            return;
        if (this.animators.length == 0)
            return;
        dirty = true;
        this.animators.forEach(function (a) { return a.update(); });
    };
    Anim.render = function () {
        if (this.animators == null)
            return;
        if (this.animators.length == 0)
            return;
        this.animators.forEach(function (a) { return a.render(); });
    };
    Anim.remove = function (anim) {
        var index = this.animators.indexOf(anim);
        if (index > -1) {
            this.animators.splice(index, 1);
        }
    };
    return Anim;
}());
var BuilderCanvas = /** @class */ (function () {
    function BuilderCanvas(canvas) {
        // Constants
        this.CANVAS_BG_COLOR = "#434043";
        this.GRID_COLOR = "#000000";
        this.GRID_CENTER_COLOR = "#888888";
        this.MAPLINE_2S_COLOR = "#884422";
        this.MAPLINE_COLOR = "#888888";
        this.MAPPROCLINE_COLOR = "#ffcc88";
        this.VERTEX_COLOR = "#FF9944";
        this.HIGHLIGHT_COLOR = "#FFFFFF55";
        this.ACTIVE_FONT_COLOR = "#FFFFFFFF";
        this.INACTIVE_FONT_COLOR = "#FFFFFF77";
        this.VERTEX_SIZE = 2;
        this.ZOOM_SPEED = 1.05;
        this.GRIDLINE_WIDTH = 0.5;
        this.PERP_LENGTH = 5.0;
        this.zoom = 1.0;
        this.gridSize = 32;
        this.modeSelectionOffset = new Vertex(10, 74);
        this.toolSpacing = 24;
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
        this.ctx.textBaseline = "middle";
        this.ctx.textAlign = "left";
        this.ctx.fillStyle = this.INACTIVE_FONT_COLOR;
        this.ctx.font = "18px Ubuntu Mono";
        this.ctx.fillText("Tools", 20, 110);
        for (var i = 0; i < Tool.tools.length; i++) {
            if (Tool.tools[i] == Tool.activeTool) {
                this.ctx.fillStyle = this.ACTIVE_FONT_COLOR;
            }
            else {
                this.ctx.fillStyle = this.INACTIVE_FONT_COLOR;
            }
            this.ctx.textAlign = "left";
            this.ctx.font = "18px Ubuntu Mono";
            this.ctx.fillText(Tool.tools[i].name, 40, 140 + (i * this.toolSpacing));
            this.ctx.textAlign = "center";
            this.ctx.fillStyle = this.ACTIVE_FONT_COLOR;
            this.ctx.font = "12px Open Sans";
            this.ctx.fillText(Tool.tools[i].selectKey.toLocaleUpperCase(), 20, 140 + (i * this.toolSpacing));
            this.ctx.strokeStyle = this.ACTIVE_FONT_COLOR;
            this.ctx.beginPath;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.ellipse(20, 138.5 + (i * this.toolSpacing), 9, 9, 0, 0, Math.PI * 2);
            this.ctx.stroke();
        }
    };
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
                this.drawEdges(sectors[i].edges, this.MAPLINE_COLOR, 1.0);
            }
        }
    };
    BuilderCanvas.prototype.drawVertex = function (vertex) {
        this.ctx.fillStyle = this.VERTEX_COLOR;
        var p = this.posToView(vertex);
        this.ctx.fillRect(p.x - this.VERTEX_SIZE, p.y - this.VERTEX_SIZE, this.VERTEX_SIZE * 2, this.VERTEX_SIZE * 2);
    };
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
        if (s == null)
            return;
        this.drawBasicEdges(s.edges, this.HIGHLIGHT_COLOR, 5, false);
    };
    return BuilderCanvas;
}());
var InputMode;
(function (InputMode) {
    InputMode["VERTEX"] = "vertex";
    InputMode["EDGE"] = "edge";
    InputMode["SECTOR"] = "sector";
})(InputMode || (InputMode = {}));
var Input = /** @class */ (function () {
    function Input() {
    }
    Input.switchMode = function (mode) {
        if (Input.lockModes == false) {
            Input.mode = mode;
            var off = 10;
            if (mode != InputMode.VERTEX)
                off += 74;
            if (mode == InputMode.SECTOR)
                off += 74;
            if (this.lastAnim != null) {
                this.lastAnim.cancel();
            }
            this.lastAnim = new Anim(mainCanvas.modeSelectionOffset, "x", off, 0.3);
        }
    };
    Input.Initialise = function () {
        this.mousePos = new Vertex(0, 0);
        this.mouseGridPos = new Vertex(0, 0);
        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);
        mainCanvas.canvas.addEventListener("mousemove", onMouseMove);
        mainCanvas.canvas.addEventListener("mousedown", onMouseDown);
        mainCanvas.canvas.addEventListener("mouseup", onMouseUp);
        // I love standards
        mainCanvas.canvas.addEventListener("mousewheel", onMouseWheel);
        mainCanvas.canvas.addEventListener("wheel", onMouseWheel);
    };
    Input.viewDragging = false;
    Input.mode = InputMode.VERTEX;
    Input.lockModes = false;
    return Input;
}());
function onKeyDown(e) {
    dirty = true;
    if (e.key == " ")
        Input.viewDragging = true;
    if (e.key == "1")
        Input.switchMode(InputMode.VERTEX);
    if (e.key == "2")
        Input.switchMode(InputMode.EDGE);
    if (e.key == "3")
        Input.switchMode(InputMode.SECTOR);
    for (var i = 0; i < Tool.tools.length; i++) {
        if (e.key == Tool.tools[i].selectKey) {
            Tool.changeTool(Tool.tools[i]);
        }
    }
    if (e.key == "]") {
        mainCanvas.gridSize *= 2;
    }
    if (e.key == "[") {
        mainCanvas.gridSize /= 2;
    }
    if (e.key == "Escape") {
        Tool.changeTool(Tool.tools[0]);
    }
}
function onKeyUp(e) {
    dirty = true;
    if (e.key == " ")
        Input.viewDragging = false;
}
function onMouseMove(e) {
    dirty = true;
    Input.mousePos = mainCanvas.viewToPos(new Vertex(e.offsetX, e.offsetY));
    Input.mouseGridPos = mainCanvas.viewToGridPos(new Vertex(e.offsetX, e.offsetY));
    if (Input.viewDragging) {
        mainCanvas.viewOffset.x -= e.movementX;
        mainCanvas.viewOffset.y -= e.movementY;
    }
    if (Tool.activeTool.onMouseMove) {
        Tool.activeTool.onMouseMove(e);
    }
}
function onMouseWheel(e) {
    dirty = true;
    e.preventDefault();
    if (e.deltaY > 0) {
        mainCanvas.zoom *= mainCanvas.ZOOM_SPEED;
        mainCanvas.viewOffset.x -= (Input.mousePos.x) * ((mainCanvas.ZOOM_SPEED - 1.0) / mainCanvas.zoom);
        mainCanvas.viewOffset.y -= (Input.mousePos.y) * ((mainCanvas.ZOOM_SPEED - 1.0) / mainCanvas.zoom);
    }
    if (e.deltaY < 0) {
        mainCanvas.zoom /= mainCanvas.ZOOM_SPEED;
        mainCanvas.viewOffset.x += (Input.mousePos.x) * ((mainCanvas.ZOOM_SPEED - 1.0) / mainCanvas.zoom);
        mainCanvas.viewOffset.y += (Input.mousePos.y) * ((mainCanvas.ZOOM_SPEED - 1.0) / mainCanvas.zoom);
    }
}
function onMouseDown(e) {
    e.preventDefault();
    if (Tool.activeTool.onMouseDown) {
        Tool.activeTool.onMouseDown(e);
    }
}
function onMouseUp(e) {
    if (Tool.activeTool.onMouseUp) {
        Tool.activeTool.onMouseUp(e);
    }
}
var mainCanvas;
var mapData;
var dirty;
function init() {
    window.setInterval(update, 1000 / 60);
    window.addEventListener("resize", function () {
        mainCanvas = new BuilderCanvas(document.getElementById("maincanvas"));
        render();
    });
    mapData = new MapData();
    mainCanvas = new BuilderCanvas(document.getElementById("maincanvas"));
    dirty = true;
    Tool.tools.push(new BaseTool());
    Tool.tools.push(new Extrude());
    Tool.changeTool(Tool.tools[0]);
    Input.Initialise();
}
function update() {
    Anim.update();
    if (dirty) {
        render();
        dirty = false;
    }
}
function render() {
    mainCanvas.redraw();
    Anim.render();
    if (Tool.activeTool.onRender) {
        Tool.activeTool.onRender();
    }
}
window.addEventListener("load", init);
var MapData = /** @class */ (function () {
    function MapData() {
        this.sectors = new Array();
        this.defaultMap();
    }
    MapData.prototype.defaultMap = function () {
        var v = new Array();
        v.push(new Vertex(-32, -32));
        v.push(new Vertex(32, -32));
        v.push(new Vertex(32, 32));
        v.push(new Vertex(-32, 32));
        var s = new Sector();
        s.edges.push(new Edge(v[3], v[2]));
        s.edges.push(new Edge(v[2], v[1]));
        s.edges.push(new Edge(v[1], v[0]));
        s.edges.push(new Edge(v[0], v[3]));
        s.edges[1].modifiers.push(new EdgeSubdivider(3));
        s.edges[1].modifiers.push(new EdgeInset(8, 0));
        s.update();
        this.sectors.push(s);
    };
    MapData.prototype.getAllEdges = function () {
        var output = new Array();
        for (var i = 0; i < this.sectors.length; i++) {
            output = output.concat(this.sectors[i].edges);
        }
        return output;
    };
    MapData.prototype.getNearestSector = function (p) {
        if (this.sectors.length == 0)
            return null;
        var nDist = Number.MAX_VALUE;
        var nSect = null;
        this.sectors.forEach(function (s) {
            if (s.rect.pointInBounds(p)) {
                var d = Util.sqrDist(p, s.rect.midPoint);
                if (d < nDist) {
                    nDist = d;
                    nSect = s;
                }
            }
        });
        return nSect;
    };
    MapData.prototype.getNearestEdge = function (p) {
        var allEdges = this.getAllEdges();
        if (allEdges.length == 0)
            return null;
        if (allEdges.length == 1)
            return allEdges[0];
        var nDist = Util.distToEdgeMidpoint(p, allEdges[0]);
        var nEdge = allEdges[0];
        for (var i = 1; i < allEdges.length; i++) {
            var d = Util.distToEdgeMidpoint(p, allEdges[i]);
            if (d < nDist) {
                nDist = d;
                nEdge = allEdges[i];
            }
        }
        return nEdge;
    };
    MapData.prototype.getVerticesAt = function (p) {
        var allEdges = this.getAllEdges();
        if (allEdges.length == 0)
            return null;
        var outputVertices = new Array();
        allEdges.forEach(function (e) {
            if (e.start.equals(p))
                outputVertices.push(e.start);
            if (e.end.equals(p))
                outputVertices.push(e.end);
        });
        return outputVertices;
    };
    MapData.prototype.moveVertex = function (from, to) {
        // This gets slower the more edges there are. If this gets bad, sort the lines and do a binary search
        for (var i = 0; i < this.sectors.length; i++) {
            for (var j = 0; j < this.sectors[i].edges.length; j++) {
                if (this.sectors[i].edges[j].start.equals(from)) {
                    this.sectors[i].edges[j].start.x = to.x;
                    this.sectors[i].edges[j].start.y = to.y;
                    this.sectors[i].edges[j].dirty = true;
                }
                if (this.sectors[i].edges[j].end.equals(from)) {
                    this.sectors[i].edges[j].end.x = to.x;
                    this.sectors[i].edges[j].end.y = to.y;
                    this.sectors[i].edges[j].dirty = true;
                }
            }
        }
    };
    MapData.prototype.getEdgesWithVertex = function (v) {
        var output = new Array();
        this.sectors.forEach(function (s) { return s.edges.forEach(function (e) {
            if (e.start.equals(v)) {
                output.push(e);
            }
            else if (e.end.equals(v)) {
                output.push(e);
            }
        }); });
        return output;
    };
    MapData.prototype.getNearestVertex = function (v) {
        var vertexes = new Array();
        var edges = this.getAllEdges();
        edges.forEach(function (e) {
            vertexes.push(e.start);
            vertexes.push(e.end);
        });
        var nDist = Util.sqrDist(v, vertexes[0]);
        var nVert = vertexes[0];
        for (var i = 1; i < vertexes.length; i++) {
            var d = Util.sqrDist(v, vertexes[i]);
            if (d < nDist) {
                nDist = d;
                nVert = vertexes[i];
            }
        }
        return nVert;
    };
    return MapData;
}());
var tips = [
    'welcome, to jz🅱️uilder2',
    'extruding is fun! try it out with the W key!',
    // 'you can delete stuff with ctrl-backspace! mac CMD key isn\'t supported yet, for silly reasons',
    'wow! this tool is a lot of fun, huh?',
    'i hope you\'re doing ok! remember to reach out to friends you haven\'t caught up with in a while. they\'ll probably be very happy to hear from you!',
    'hiya!',
    ':)',
    'your map is looking great so far! keep it up!',
    'you\'re super great, i\'m so glad you\'re hanging out with me :)',
    'i hope you\'re having fun!',
    'you can use the space key to pan around the map!'
];
function newTip() {
    var el = document.getElementById("petext");
    el.innerHTML = tips[Math.floor(Math.random() * tips.length)];
}
var Tool = /** @class */ (function () {
    function Tool() {
    }
    Tool.changeTool = function (tool) {
        if (Tool.activeTool != null && Tool.activeTool.onUnswitch) {
            Tool.activeTool.onUnswitch();
        }
        Tool.activeTool = tool;
        if (Tool.activeTool.onSwitch) {
            Tool.activeTool.onSwitch();
        }
    };
    Tool.tools = new Array();
    return Tool;
}());
// lots commented out until i need it
// this is because it might need updating and i'd rather fix that as i use them
var Rect = /** @class */ (function () {
    function Rect(x, y, width, height) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 0; }
        this.topLeft = new Vertex(x, y);
        this.bottomRight = new Vertex(x + width, y + height);
    }
    Object.defineProperty(Rect.prototype, "midPoint", {
        get: function () {
            return new Vertex((this.topLeft.x + this.bottomRight.x) / 2, (this.topLeft.y + this.bottomRight.y) / 2);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "width", {
        get: function () {
            return this.bottomRight.x - this.topLeft.x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "height", {
        get: function () {
            return this.bottomRight.y - this.topLeft.y;
        },
        enumerable: true,
        configurable: true
    });
    Rect.prototype.pointInBounds = function (p) {
        return p.x >= this.topLeft.x && p.y >= this.topLeft.y && p.x < this.bottomRight.x && p.y < this.bottomRight.y;
    };
    return Rect;
}());
var Util = /** @class */ (function () {
    function Util() {
    }
    Util.sqrDist = function (p1, p2) {
        var a = p2.x - p1.x;
        var b = p2.y - p1.y;
        return Math.pow(a, 2) + Math.pow(b, 2);
    };
    Util.distToEdgeMidpoint = function (p, l) {
        return Util.sqrDist(p, new Vertex((l.start.x + l.end.x) / 2, (l.start.y + l.end.y) / 2));
    };
    Util.distance = function (a, b) {
        return Math.sqrt(Util.sqrDist(a, b));
    };
    return Util;
}());
var Color = /** @class */ (function () {
    function Color() {
    }
    Color.componentToHex = function (c) {
        c *= 255;
        var hex = Math.round(c).toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    };
    Color.rgbToHex = function (r, g, b) {
        return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    };
    Color.rgbaToHex = function (r, g, b, a) {
        return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b) + this.componentToHex(a);
    };
    Color.random = function () {
        return Color.rgbToHex(Math.random(), Math.random(), Math.random());
    };
    return Color;
}());
// function crossProduct(a:Vertex, b:Vertex, o:Vertex):number {
//     return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
// }
// function ccw(a:Vertex, b:Vertex, c:Vertex):boolean {
//     return ((c.y-a.y) * (b.x-a.x) > (b.y-a.y) * (c.x-a.x));
// }
// function linesIntersect(l1:Line, l2:Line):boolean {
//     if (l1.angle() == l2.angle()) return false;
//     if (l1.angle() == l2.reversed().angle()) return false;
//     if (l1.equals(l2)) return false;
//     return (ccw(l1.start,l2.start,l2.end) != ccw(l1.end,l2.start,l2.end)) && (ccw(l1.start,l1.end,l2.start) != ccw(l1.start,l1.end,l2.end));
// }
// function lineIntersection(l1:Line, l2:Line):Vertex {
//     let dx12 = l1.end.x - l1.start.x;
//     let dy12 = l1.end.y - l1.start.y;
//     let dx34 = l2.end.x - l2.start.x;
//     let dy34 = l2.end.y - l2.start.y;
//     let denom = (dy12 * dx34 - dx12 * dy34);
//     let t1 = ((l1.start.x - l2.start.x) * dy34 + (l2.start.y - l1.start.y) * dx34) / denom;
//     return new Vertex(l1.start.x + dx12 * t1, l1.start.y + dy12 * t1);
// }
// function convexHull(points:Array<Vertex>):Array<Vertex> {
//     points.sort(function(a, b) {
//         return a.x == b.x ? a.y - b.y : a.x - b.x;
//     });
//     var lower = [];
//     for (var i = 0; i < points.length; i++) {
//         while (lower.length >= 2 && crossProduct(lower[lower.length - 2], lower[lower.length - 1], points[i]) <= 0) {
//             lower.pop();
//         }
//         lower.push(points[i]);
//     }
//     var upper = [];
//     for (var i = points.length - 1; i >= 0; i--) {
//         while (upper.length >= 2 && crossProduct(upper[upper.length - 2], upper[upper.length - 1], points[i]) <= 0) {
//             upper.pop();
//         }
//         upper.push(points[i]);
//     }
//     upper.pop();
//     lower.pop();
//     return lower.concat(upper);
// }
// function lerp(a:number, b:number, amt:number):number {
//     return (a * amt) + (b * (1.0-amt));
// }
// function insideOut(lines:Array<Line>) {
//     let a = 0;
//     for (let i = 0; i < lines.length; i++) {
//         let p1 = lines[i].start;
//         let p2 = lines[(i+1)%lines.length].start;
//         let p3 = lines[(i+2)%lines.length].start;
//         a += ccw(p1,p2,p3)?1:-1;
//     }
//     return a > 0;
// }
// function angleBetweenPoints(p1:Vertex, p2:Vertex, p3:Vertex):number {
//     let a:number = pointDistance(p2, p1);
//     let b:number = pointDistance(p2, p3);
//     let c:number = pointDistance(p3, p1);
//     return Math.acos(((a**2 + b**2) - c**2)/((a*b)*2));
// }
// function lineAngle(a:Vertex, b:Vertex):number {
//     return Math.atan2(b.y - a.y, b.x - a.x);
// }
// function traceShallowSector(start:Line, fail:boolean = false):Array<Vertex> {
//     let output:Array<Vertex> = new Array<Vertex>();
//     output.push(start.start);
//     let nextPoint:Vertex = start.end;
//     let life = 1000;
//     while(   (!nextPoint.equals(start.start))               && life > 0) {
//         life--;
//         output.push(nextPoint);
//         let nextList = mapData.getNextConnectedVertexes(nextPoint);
//         let minAngle = Number.MAX_VALUE;
//         let nextPointCandidate = null;
//         // Reached a dead end :( we could look ahead to avoid this i think
//         //if (nextList.length == 1) return null;
//         for (let i = 0; i < nextList.length; i++) {
//             let np = nextList[i];
//             if (!np.equals(output[output.length-2])) {
//                 let ang = angleBetweenPoints(output[output.length-2], nextPoint, np);
//                 // while (ang < 0) ang += Math.PI*2;
//                 // while (ang > Math.PI*2) ang -= Math.PI*2;
//                 if (ang < minAngle) {
//                     nextPointCandidate = np;
//                     minAngle = ang;
//                 }
//             }
//         }
//         if (nextPointCandidate == null) {
//             //console.log("traceShallowSector() failed. Possibly unclosed");
//             if (fail) {
//                 return null;
//             }
//             return traceShallowSector(start.reversed(), true);
//         }
//         nextPoint = nextPointCandidate;
//     }
//     output.push(nextPoint);
//     return output;
// }
var EdgeInset = /** @class */ (function () {
    function EdgeInset(x, y) {
        this.x = x;
        this.y = y;
    }
    EdgeInset.prototype.process = function (edge) {
        for (var i = 1; i < edge.vertices.length - 1; i++) {
            edge.vertices[i].x += this.x;
            edge.vertices[i].y += this.y;
        }
        return edge;
    };
    return EdgeInset;
}());
var EdgeSubdivider = /** @class */ (function () {
    function EdgeSubdivider(subdivisions) {
        this.subdivisions = Math.round(subdivisions);
    }
    EdgeSubdivider.prototype.process = function (edge) {
        var output = new ProcessedEdge();
        for (var i = 0; i < edge.vertices.length - 1; i++) {
            for (var p = 0; p < 1.0; p += 1 / this.subdivisions) {
                var nv = new Vertex(edge.vertices[i].x + ((edge.vertices[i + 1].x - edge.vertices[i].x) * p), edge.vertices[i].y + ((edge.vertices[i + 1].y - edge.vertices[i].y) * p));
                output.vertices.push(nv);
            }
        }
        output.vertices.push(edge.vertices[edge.vertices.length - 1]);
        return output;
    };
    EdgeSubdivider.prototype.toString = function () {
        return "Edge Subdivide";
    };
    return EdgeSubdivider;
}());
var Edge = /** @class */ (function () {
    function Edge(start, end) {
        this.dirty = true;
        this.start = start.clone();
        this.end = end.clone();
        this.modifiers = new Array();
        this.dirty = true;
    }
    Edge.prototype.process = function () {
        if (!this.dirty) {
            return this.processCache;
        }
        else {
            this.dirty = false;
            var edge = new ProcessedEdge();
            edge.vertices = new Array();
            edge.vertices.push(this.start);
            edge.vertices.push(this.end);
            for (var i = 0; i < this.modifiers.length; i++) {
                edge = this.modifiers[i].process(edge);
            }
            this.processCache = edge;
            return this.processCache;
        }
    };
    Edge.prototype.getPerpendicular = function () {
        var l = this.length();
        var x = (this.end.x - this.start.x) / l;
        var y = (this.end.y - this.start.y) / l;
        return new Vertex(-y, x);
    };
    Edge.prototype.getMidpoint = function () {
        return new Vertex((this.start.x + this.end.x) / 2, (this.start.y + this.end.y) / 2);
    };
    Edge.prototype.length = function () {
        return Util.distance(this.start, this.end);
    };
    Edge.prototype.copy = function () {
        var output = new Edge(this.start, this.end);
        return output;
    };
    Edge.prototype.reversedCopy = function () {
        var output = new Edge(this.end, this.start);
        return output;
    };
    Edge.prototype.translate = function (offset, moveLink) {
        if (moveLink === void 0) { moveLink = true; }
        this.start.translate(offset);
        this.end.translate(offset);
        if (this.edgeLink && moveLink) {
            this.edgeLink.translate(offset, false);
        }
        if (this.sector) {
            var n = this.sector.nextEdge(this);
            var p = this.sector.previousEdge(this);
            n.start.translate(offset);
            p.end.translate(offset);
            if (n.edgeLink) {
                n.edgeLink.end.translate(offset);
            }
            if (p.edgeLink) {
                p.edgeLink.start.translate(offset);
            }
            n.dirty = true;
            p.dirty = true;
        }
        this.dirty = true;
    };
    Edge.prototype.clearModifiers = function () {
        this.modifiers = new Array();
        this.processCache = null;
        this.dirty = true;
    };
    return Edge;
}());
var ProcessedEdge = /** @class */ (function () {
    function ProcessedEdge() {
        this.vertices = new Array();
    }
    return ProcessedEdge;
}());
var Sector = /** @class */ (function () {
    function Sector() {
        this.edges = new Array();
    }
    Object.defineProperty(Sector.prototype, "rect", {
        get: function () {
            if (this._rect)
                return this._rect;
            var minx = Number.MAX_VALUE;
            var maxx = Number.MIN_VALUE;
            var miny = Number.MAX_VALUE;
            var maxy = Number.MIN_VALUE;
            this.edges.forEach(function (e) {
                minx = Math.min(minx, e.start.x, e.end.x);
                miny = Math.min(miny, e.start.y, e.end.y);
                maxx = Math.max(maxx, e.start.x, e.end.x);
                maxy = Math.max(maxy, e.start.y, e.end.y);
            });
            this._rect = new Rect(minx, miny, maxx - minx, maxy - miny);
            return this._rect;
        },
        enumerable: true,
        configurable: true
    });
    Sector.prototype.update = function () {
        for (var i = 0; i < this.edges.length; i++) {
            this.edges[i].sector = this;
        }
        this._rect = null;
    };
    Sector.prototype.nextEdge = function (edge) {
        var index = this.edges.indexOf(edge) + 1;
        if (index == this.edges.length)
            index = 0;
        return this.edges[index];
    };
    Sector.prototype.previousEdge = function (edge) {
        var index = this.edges.indexOf(edge) - 1;
        if (index == -1)
            index = this.edges.length - 1;
        return this.edges[index];
    };
    return Sector;
}());
var Vertex = /** @class */ (function () {
    function Vertex(x, y) {
        this.x = x;
        this.y = y;
    }
    Vertex.prototype.equals = function (point) {
        return this.x == point.x && this.y == point.y;
    };
    Vertex.prototype.clone = function () {
        return new Vertex(this.x, this.y);
    };
    Vertex.Add = function (a, b) {
        return new Vertex(a.x + b.x, a.y + b.y);
    };
    Vertex.Subtract = function (a, b) {
        return new Vertex(a.x - b.x, a.y - b.y);
    };
    Vertex.prototype.setCoords = function (x, y) {
        this.x = x;
        this.y = y;
    };
    Vertex.prototype.setTo = function (v) {
        this.x = v.x;
        this.y = v.y;
    };
    Vertex.prototype.translate = function (offset) {
        this.x += offset.x;
        this.y += offset.y;
    };
    return Vertex;
}());
var BaseTool = /** @class */ (function () {
    function BaseTool() {
        this.name = "Move/Edit/Select";
        this.selectKey = "q";
        this.dragging = false;
        this.lastPos = Input.mouseGridPos;
    }
    BaseTool.prototype.onMouseDown = function (e) {
        if (Input.mode == InputMode.VERTEX) {
            var v = mapData.getNearestVertex(Input.mousePos);
            if (Util.distance(v, Input.mousePos) < 64) {
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
            if (this.activeSector != null) {
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
        }
    };
    BaseTool.prototype.onMouseUp = function (e) {
        this.dragging = false;
        Input.lockModes = false;
    };
    BaseTool.prototype.onMouseMove = function (e) {
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
    BaseTool.prototype.onRender = function () {
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
                if (Util.distance(v, Input.mousePos) < 64) {
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
    BaseTool.prototype.onUnswitch = function () {
        Input.lockModes = false;
    };
    return BaseTool;
}());
var Extrude = /** @class */ (function () {
    function Extrude() {
        this.name = "Extrude";
        this.selectKey = "w";
        this.extruding = false;
    }
    Extrude.prototype.onSwitch = function () {
        Input.switchMode(InputMode.EDGE);
    };
    Extrude.prototype.onMouseMove = function (e) {
        if (this.extruding) {
            this.translation = Vertex.Subtract(Input.mouseGridPos, this.initialPosition);
        }
    };
    Extrude.prototype.onMouseDown = function (e) {
        if (Input.mode == InputMode.EDGE) {
            this.startExtrude(mapData.getNearestEdge(Input.mousePos));
        }
    };
    Extrude.prototype.onMouseUp = function (e) {
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
//# sourceMappingURL=jzbuilder.js.map