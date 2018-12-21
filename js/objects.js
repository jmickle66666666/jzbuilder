var Sector = /** @class */ (function () {
    function Sector() {
        this.edges = new Array();
    }
    Sector.prototype.update = function () {
        for (var i = 0; i < this.edges.length; i++) {
            this.edges[i].sector = this;
        }
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
        return pointDistance(this.start, this.end);
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
        var n = this.sector.nextEdge(this);
        var p = this.sector.previousEdge(this);
        n.start.translate(offset);
        p.end.translate(offset);
        n.dirty = true;
        p.dirty = true;
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
// Probably defunct?
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
// class Sector {
//     public bounds : Rect;
//     public lines : Array<Line>;
//     public preview : HTMLCanvasElement;
//     public floorTexture : HTMLImageElement;
//     public dirty : boolean = false;
//     public constructor (floorTexture : HTMLImageElement) {
//         this.lines = new Array<Line>();
//         this.floorTexture = floorTexture;
//         //document.body.appendChild(this.floorTexture);
//     }
//     public verifyLines():boolean {
//         if (this.lines.length == 0) return false;
//         let linesToRemove:Array<number> = new Array<number>();
//         for (let i = 0; i < this.lines.length; i++) {
//             let line1:Line = this.lines[i];
//             let line2:Line = this.lines[(i+1)%this.lines.length];
//             if (!line1.end.equals(line2.start)) {
//                 return false;
//             }
//             if (line1.length() == 0) {
//                 linesToRemove.push(i);
//             }
//         }
//         for (let i = 0; i < linesToRemove.length; i++) {
//             this.lines.splice(linesToRemove[i]-i, 1);
//         }
//     }
//     public invalidate():void {
//         if (this.lines.length == 0) return;
//         this.dirty = false;
//         this.bounds = new Rect();
//         if (this.verifyLines() == false) {
//             console.error("sector verification failed!");
//         }
//         if (insideOut(this.lines)) {
//             this.lines.reverse();
//             for (let i = 0; i < this.lines.length; i++) {
//                 this.lines[i] = this.lines[i].reversed();
//             }
//         }
//         for (let i = 0; i < this.lines.length; i++) {
//             this.lines[i].sector = this;
//             //this.lines[i].shapeDefining = true;
//             this.bounds.topLeft.x = Math.min(this.bounds.topLeft.x, this.lines[i].start.x, this.lines[i].end.x);
//             this.bounds.topLeft.y = Math.min(this.bounds.topLeft.y, this.lines[i].start.y, this.lines[i].end.y);
//             this.bounds.bottomRight.x = Math.max(this.bounds.bottomRight.x, this.lines[i].start.x, this.lines[i].end.x);
//             this.bounds.bottomRight.y = Math.max(this.bounds.bottomRight.y, this.lines[i].start.y, this.lines[i].end.y);
//         }
//         this.preview = document.createElement("canvas");
//         this.preview.width = this.bounds.width;
//         this.preview.height = this.bounds.height;
//         let ctx = this.preview.getContext('2d');
//         ctx.beginPath();
//         ctx.moveTo(this.lines[0].start.x - this.bounds.topLeft.x, this.lines[0].start.y - this.bounds.topLeft.y);
//         for (let i = 0; i < this.lines.length; i++) {
//             ctx.lineTo(this.lines[i].end.x - this.bounds.topLeft.x, this.lines[i].end.y - this.bounds.topLeft.y);
//         }
//         ctx.imageSmoothingEnabled = false;
//         ctx.clip();
//         let ox:number = this.bounds.topLeft.x % 64;
//         let oy:number = this.bounds.topLeft.y % 64;
//         for (let i = -ox - 64; i < this.bounds.width; i += 64) {
//             for (let j = -oy - 64; j < this.bounds.height; j += 64) {
//                 ctx.drawImage(this.floorTexture, i, j);
//             }
//         }
//     }
//     public static fromConvexPoints(points:Array<Vertex>, texture:HTMLImageElement) {
//         var hullPoints = convexHull(points);
//         var newSector = new Sector(texture);
//         for (let i = 0 ; i < hullPoints.length - 1; i++) {
//             var newLine = new Line(hullPoints[i], hullPoints[i+1]);
//             newSector.lines.push(newLine);
//         }
//         newSector.invalidate();
//         return newSector;
//     }
// }
// class Line {
//     public start : Vertex;
//     public end : Vertex;
//     public sector : Sector;
//     public dirty : boolean = false;
//     public constructor (start:Vertex, end:Vertex) {
//         this.start = start.clone();
//         this.end = end.clone();
//     }
//     public equals(line:Line):boolean {
//         if ((line.start.equals(this.start) && line.end.equals(this.end)) ||
//         (line.start.equals(this.end) && line.end.equals(this.start))) {
//             return true;
//         }
//         return false;
//     }
//     public containsVertex(p:Vertex):boolean {
//         return (this.start.equals(p) || this.end.equals(p));
//     }
//     public invalidate() {
//         if (this.sector != null) this.sector.invalidate();
//         this.dirty = false;
//     }
//     public reversed():Line {
//         return new Line(this.end, this.start);
//     }
//     public pointOnLine(p:Vertex):boolean {
//         if (p.equals(this.start) || p.equals(this.end)) return false;
//         return Math.abs(angleBetweenPoints(this.start, p, this.end) - Math.PI) < 0.05;
//     }
//     public angle():number {
//         return lineAngle(this.start, this.end);
//     }
//     public shareAngle(l:Line):boolean {
//         // check if this angle or opposite angle matches l
//         if (Math.abs(l.angle() - this.angle()) < 0.02) return true;
//         if (Math.abs(l.reversed().angle() - this.angle()) < 0.02) return true;
//         return false;
//     }
//     public split(p:Vertex) {
//         let tempPoint:Vertex = this.end;
//         this.end = p;
//         let newLine = new Line(p, tempPoint);
//         if (this.sector != null) {
//             let index = this.sector.lines.indexOf(this);
//             this.sector.lines.splice(index + 1, 0, newLine);
//             newLine.sector = this.sector;
//         } else {
//             mapData.lines.push(newLine);
//         }
//     }
//     public sharePoint(l:Line):boolean {
//         return (l.start.equals(this.start) || l.end.equals(this.start) || l.start.equals(this.end) || l.end.equals(this.end));
//     }
// }
//# sourceMappingURL=objects.js.map