var SectorState = /** @class */ (function () {
    function SectorState() {
    }
    SectorState.prototype.toSector = function () {
        var output = new Sector(tempTexture);
        for (var i = 0; i < this.points.length - 2; i += 2) {
            output.lines.push(new Line(new Vertex(this.points[i], this.points[i + 1]), new Vertex(this.points[i + 2], this.points[i + 3])));
        }
        output.invalidate();
        return output;
    };
    SectorState.fromSector = function (s) {
        var output = new SectorState();
        output.points = new Array();
        output.points.push(s.lines[0].start.x);
        output.points.push(s.lines[0].start.y);
        for (var i = 0; i < s.lines.length; i++) {
            output.points.push(s.lines[i].end.x);
            output.points.push(s.lines[i].end.y);
        }
        return output;
    };
    return SectorState;
}());
var LineState = /** @class */ (function () {
    function LineState() {
    }
    LineState.prototype.toLine = function () {
        return new Line(new Vertex(this.points[0], this.points[1]), new Vertex(this.points[2], this.points[3]));
    };
    LineState.fromLine = function (l) {
        var output = new LineState();
        output.points = new Array();
        output.points.push(l.start.x);
        output.points.push(l.start.y);
        output.points.push(l.end.x);
        output.points.push(l.end.y);
        return output;
    };
    return LineState;
}());
var UndoStack = /** @class */ (function () {
    function UndoStack() {
        this.LIMIT = 10;
        this.stack = new Array();
        this.actionHistory = new Array();
    }
    UndoStack.prototype.save = function (action) {
        if (action === void 0) { action = ""; }
        this.stack.push(MapState.create());
        if (this.stack.length > this.LIMIT) {
            this.stack.shift();
        }
        if (action != "") {
            this.actionHistory.push(action);
        }
    };
    UndoStack.prototype.restore = function () {
        if (this.stack.length > 0) {
            this.stack.pop().restore();
        }
    };
    UndoStack.prototype.export = function () {
        return JSON.stringify({ "undostack": this.stack, "actions": this.actionHistory });
    };
    return UndoStack;
}());
var MapState = /** @class */ (function () {
    function MapState() {
    }
    MapState.create = function () {
        var output = new MapState();
        output.lines = new Array();
        for (var i = 0; i < mapData.lines.length; i++) {
            output.lines.push(LineState.fromLine(mapData.lines[i]));
        }
        output.sectors = new Array();
        for (var i = 0; i < mapData.sectors.length; i++) {
            output.sectors.push(SectorState.fromSector(mapData.sectors[i]));
        }
        return output;
    };
    MapState.prototype.restore = function () {
        mapData.lines.length = 0;
        for (var i = 0; i < this.lines.length; i++) {
            mapData.lines.push(this.lines[i].toLine());
        }
        mapData.sectors.length = 0;
        for (var i = 0; i < this.sectors.length; i++) {
            mapData.sectors.push(this.sectors[i].toSector());
        }
    };
    MapState.prototype.toJSON = function () {
        return JSON.stringify({ "lines": this.lines, "sectors": this.sectors });
    };
    MapState.fromJSON = function (json) {
        var obj = JSON.parse(json);
        var output = new MapState();
        output.lines = new Array();
        output.sectors = new Array();
        for (var i = 0; i < obj.lines.length; i++) {
            var nls = new LineState();
            nls.points = obj.lines[i].points;
            output.lines.push(nls);
        }
        for (var i = 0; i < obj.sectors.length; i++) {
            var nls = new SectorState();
            nls.points = obj.sectors[i].points;
            output.sectors.push(nls);
        }
        return output;
    };
    return MapState;
}());
function saveMap() {
    saveString(MapState.create().toJSON(), "jzmap.json");
}
function loadMap(event) {
    var fileInput = document.getElementById('maploader');
    var reader = new FileReader();
    reader.onload = onReaderLoad;
    reader.readAsText(fileInput.files[0]);
}
function onReaderLoad(event) {
    MapState.fromJSON(event.target.result).restore();
    mainCanvas.redraw();
}
function exportUDMF() {
    var udmf = new UDMFData(mapData);
    saveString(udmf.toString(), "jzmap.udmf.txt");
}
function exportUndoStack() {
    saveString(undoStack.export(), "jzundo.log");
}
function saveString(data, filename) {
    var a = document.createElement("a");
    var udmf = new UDMFData(mapData);
    var file = new Blob([data], { type: "text/plain" });
    a.href = URL.createObjectURL(file);
    a.download = filename;
    a.click();
}
//# sourceMappingURL=mapio.js.map