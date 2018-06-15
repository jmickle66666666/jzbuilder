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
    return Vertex;
}());
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
var Sector = /** @class */ (function () {
    function Sector(floorTexture) {
        this.dirty = false;
        this.lines = new Array();
        this.floorTexture = floorTexture;
        //document.body.appendChild(this.floorTexture);
    }
    // public retrace():void {
    //     let newList:Array<Line> = new Array<Line>();
    //     let used:Array<number> = new Array<number>();
    //     // Find first non-zero length line:
    //     let first:Line = this.lines[0];
    //     newList.push()
    //     let i = 0;
    //     while (first.length() != 0) {
    //         i += 1;
    //         first = this.lines[i];
    //     }
    //     let last:Line = first;
    //     let next:Line = null;
    //     i = 0;
    //     while (next == null) {
    //         if (!this.lines[i].equals(last) && this.lines[i].length() != 0) {
    //             if (this.lines[i].sharePoint(last)) {
    //                 next = this.lines[i];
    //             }
    //         }
    //         i++;
    //     }
    // }
    Sector.prototype.invalidate = function () {
        if (this.lines.length == 0)
            return;
        this.dirty = false;
        this.bounds = new Rect();
        for (var i = 0; i < this.lines.length; i++) {
            this.lines[i].sector = this;
            //this.lines[i].shapeDefining = true;
            this.bounds.topLeft.x = Math.min(this.bounds.topLeft.x, this.lines[i].start.x, this.lines[i].end.x);
            this.bounds.topLeft.y = Math.min(this.bounds.topLeft.y, this.lines[i].start.y, this.lines[i].end.y);
            this.bounds.bottomRight.x = Math.max(this.bounds.bottomRight.x, this.lines[i].start.x, this.lines[i].end.x);
            this.bounds.bottomRight.y = Math.max(this.bounds.bottomRight.y, this.lines[i].start.y, this.lines[i].end.y);
        }
        this.preview = document.createElement("canvas");
        this.preview.width = this.bounds.width;
        this.preview.height = this.bounds.height;
        var ctx = this.preview.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(this.lines[0].start.x - this.bounds.topLeft.x, this.lines[0].start.y - this.bounds.topLeft.y);
        for (var i = 0; i < this.lines.length; i++) {
            ctx.lineTo(this.lines[i].end.x - this.bounds.topLeft.x, this.lines[i].end.y - this.bounds.topLeft.y);
        }
        ctx.imageSmoothingEnabled = false;
        ctx.clip();
        var ox = this.bounds.topLeft.x % 64;
        var oy = this.bounds.topLeft.y % 64;
        for (var i = -ox - 64; i < this.bounds.width; i += 64) {
            for (var j = -oy - 64; j < this.bounds.height; j += 64) {
                ctx.drawImage(this.floorTexture, i, j);
            }
        }
    };
    Sector.fromConvexPoints = function (points, texture) {
        var hullPoints = convexHull(points);
        var newSector = new Sector(texture);
        for (var i = 0; i < hullPoints.length - 1; i++) {
            var newLine = new Line(hullPoints[i], hullPoints[i + 1]);
            newSector.lines.push(newLine);
        }
        newSector.invalidate();
        return newSector;
    };
    return Sector;
}());
var Line = /** @class */ (function () {
    function Line(start, end) {
        //public shapeDefining : boolean = false;
        this.dirty = false;
        this.start = start.clone();
        this.end = end.clone();
    }
    Line.prototype.length = function () {
        return pointDistance(this.start, this.end);
    };
    Line.prototype.equals = function (line) {
        if ((line.start.equals(this.start) && line.end.equals(this.end)) ||
            (line.start.equals(this.end) && line.end.equals(this.start))) {
            return true;
        }
        return false;
    };
    Line.prototype.containsVertex = function (p) {
        return (this.start.equals(p) || this.end.equals(p));
    };
    Line.prototype.invalidate = function () {
        if (this.sector != null)
            this.sector.invalidate();
        this.dirty = false;
    };
    Line.prototype.reversed = function () {
        return new Line(this.end, this.start);
    };
    Line.prototype.pointOnLine = function (p) {
        if (p.equals(this.start) || p.equals(this.end))
            return false;
        return Math.abs(angleBetweenPoints(this.start, p, this.end) - Math.PI) < 0.05;
    };
    Line.prototype.angle = function () {
        return lineAngle(this.start, this.end);
    };
    Line.prototype.shareAngle = function (l) {
        // check if this angle or opposite angle matches l
        if (l.angle() == this.angle())
            return true;
        if (l.reversed().angle() == this.angle())
            return true;
        return false;
    };
    Line.prototype.split = function (p) {
        var tempPoint = this.end;
        this.end = p;
        var newLine = new Line(p, tempPoint);
        if (this.sector != null) {
            var index = this.sector.lines.indexOf(this);
            this.sector.lines.splice(index + 1, 0, newLine);
            newLine.sector = this.sector;
        }
        else {
            mapData.lines.push(newLine);
        }
    };
    Line.prototype.sharePoint = function (l) {
        return (l.start.equals(this.start) || l.end.equals(this.start) || l.start.equals(this.end) || l.end.equals(this.end));
    };
    return Line;
}());
//# sourceMappingURL=objects.js.map