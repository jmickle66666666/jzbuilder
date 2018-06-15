var MapData = /** @class */ (function () {
    function MapData() {
        this.lines = new Array();
        this.sectors = new Array();
    }
    MapData.prototype.getAllLines = function () {
        var output = new Array();
        output = output.concat(this.lines);
        for (var i = 0; i < this.sectors.length; i++) {
            output = output.concat(this.sectors[i].lines);
        }
        return output;
    };
    MapData.prototype.getSectorIndexAt = function (p) {
        if (this.sectors.length == 0)
            return -1;
        var nIndex = -1;
        var nDist = Number.MAX_VALUE;
        for (var i = 0; i < this.sectors.length; i++) {
            if (this.sectors[i].bounds.pointInBounds(p)) {
                var d = sqrDist(p, this.sectors[i].bounds.midPoint);
                if (d < nDist) {
                    nDist = d;
                    nIndex = i;
                }
            }
        }
        return nIndex;
    };
    MapData.prototype.getNearestLine = function (p) {
        var allLines = this.getAllLines();
        if (allLines.length == 0)
            return null;
        if (allLines.length == 1)
            return allLines[0];
        var nDist = distToSegmentMidpoint(p, allLines[0]);
        var nLine = allLines[0];
        for (var i = 1; i < allLines.length; i++) {
            var d = distToSegmentMidpoint(p, allLines[i]);
            if (d < nDist) {
                nDist = d;
                nLine = new Line(allLines[i].start, allLines[i].end);
            }
        }
        return nLine;
    };
    MapData.prototype.moveVertex = function (from, to) {
        // This gets slower the more lines there are. If this gets bad, sort the lines and do a binary search
        // Also, this invalidates sectors a lot. I should really have a system for marking sectors as dirty and invalidate later.
        var allLines = this.getAllLines();
        if (allLines.length == 0)
            return null;
        for (var i = 0; i < allLines.length; i++) {
            if (allLines[i].start.equals(from)) {
                allLines[i].start.x = to.x;
                allLines[i].start.y = to.y;
                allLines[i].invalidate();
            }
            else if (allLines[i].end.equals(from)) {
                allLines[i].end.x = to.x;
                allLines[i].end.y = to.y;
                allLines[i].invalidate();
            }
        }
    };
    MapData.prototype.getLinesWithVertex = function (p) {
        var allLines = this.getAllLines();
        if (allLines.length == 0)
            return null;
        var output = [];
        for (var i = 0; i < allLines.length; i++) {
            if (allLines[i].start.equals(p)) {
                output.push({ line: allLines[i], position: "start" });
            }
            else if (allLines[i].end.equals(p)) {
                output.push({ line: allLines[i], position: "end" });
            }
        }
        return output;
    };
    MapData.prototype.getNextConnectedVertexes = function (p) {
        var allLines = this.getAllLines();
        if (allLines.length == 0)
            return null;
        var output = new Array();
        for (var i = 0; i < allLines.length; i++) {
            if (allLines[i].start.equals(p)) {
                output.push(allLines[i].end);
            }
            else if (allLines[i].end.equals(p)) {
                output.push(allLines[i].start);
            }
        }
        return output;
    };
    MapData.prototype.deleteLine = function (l) {
        for (var i = 0; i < this.lines.length; i++) {
            if (this.lines[i].equals(l)) {
                this.lines.splice(i, 1);
                i -= 1;
            }
        }
        for (var i = 0; i < this.sectors.length; i++) {
            for (var j = 0; j < this.sectors[i].lines.length; j++) {
                if (this.sectors[i].lines[j].equals(l)) {
                    this.sectors[i].lines.splice(j, 1);
                    this.lines = this.lines.concat(this.sectors[i].lines);
                    this.sectors.splice(i, 1);
                    break;
                }
            }
        }
        for (var i = 0; i < this.lines.length; i++) {
            this.lines[i].sector = null;
        }
    };
    MapData.prototype.deleteVertex = function (p) {
        for (var i = 0; i < this.sectors.length; i++) {
            for (var j = 0; j < this.sectors[i].lines.length; j++) {
                if (this.sectors[i].lines[j].containsVertex(p)) {
                    this.sectors[i].lines.splice(j, 1);
                    this.lines = this.lines.concat(this.sectors[i].lines);
                    this.sectors.splice(i, 1);
                    break;
                }
            }
        }
        for (var i = 0; i < this.lines.length; i++) {
            if (this.lines[i].containsVertex(p)) {
                this.lines.splice(i, 1);
                i -= 1;
            }
        }
        for (var i = 0; i < this.lines.length; i++) {
            this.lines[i].sector = null;
        }
    };
    MapData.prototype.deleteSectorAt = function (p) {
        if (this.sectors.length == 0)
            return;
        var nIndex = -1;
        var nDist = Number.MAX_VALUE;
        for (var i = 0; i < this.sectors.length; i++) {
            if (this.sectors[i].bounds.pointInBounds(p)) {
                var d = sqrDist(p, this.sectors[i].bounds.midPoint);
                if (d < nDist) {
                    nDist = d;
                    nIndex = i;
                }
            }
        }
        this.sectors.splice(nIndex, 1);
    };
    MapData.prototype.vertexExists = function (p) {
        var allLines = this.getAllLines();
        if (allLines.length == 0)
            return null;
        for (var i = 0; i < allLines.length; i++) {
            if (allLines[i].start.equals(p)) {
                return true;
            }
            else if (allLines[i].end.equals(p)) {
                return true;
            }
        }
        return false;
    };
    MapData.prototype.createSplits = function (v) {
        var allLines = this.getAllLines();
        if (allLines.length == 0)
            return;
        for (var i = 0; i < allLines.length; i++) {
            if (allLines[i].pointOnLine(v)) {
                allLines[i].split(v);
                this.createSplits(v);
                return;
            }
        }
    };
    return MapData;
}());
//# sourceMappingURL=mapdata.js.map