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
        var e = this.getNearestEdge(p);
        return e.sector; // lol
    };
    MapData.prototype.getNearestEdge = function (p) {
        var allEdges = this.getAllEdges();
        if (allEdges.length == 0)
            return null;
        if (allEdges.length == 1)
            return allEdges[0];
        var nDist = distToSegmentMidpoint(p, allEdges[0]);
        var nEdge = allEdges[0];
        for (var i = 1; i < allEdges.length; i++) {
            var d = distToSegmentMidpoint(p, allEdges[i]);
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
        var nDist = sqrDist(v, vertexes[0]);
        var nVert = vertexes[0];
        for (var i = 1; i < vertexes.length; i++) {
            var d = sqrDist(v, vertexes[i]);
            if (d < nDist) {
                nDist = d;
                nVert = vertexes[i];
            }
        }
        return nVert;
    };
    return MapData;
}());
//# sourceMappingURL=mapdata.js.map