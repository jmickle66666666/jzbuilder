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
    return MapData;
}());
//# sourceMappingURL=mapdata.js.map