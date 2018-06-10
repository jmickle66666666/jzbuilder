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
    return MapData;
}());
//# sourceMappingURL=mapdata.js.map