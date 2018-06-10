var Vertex = /** @class */ (function () {
    function Vertex(x, y) {
        this.x = x;
        this.y = y;
    }
    Vertex.prototype.equals = function (point) {
        return this.x == point.x && this.y == point.y;
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
        this.lines = new Array();
        this.floorTexture = floorTexture;
        //document.body.appendChild(this.floorTexture);
    }
    Sector.prototype.invalidate = function () {
        if (this.lines.length == 0)
            return;
        this.bounds = new Rect();
        for (var i = 0; i < this.lines.length; i++) {
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
    return Sector;
}());
var Line = /** @class */ (function () {
    function Line(start, end) {
        this.start = start;
        this.end = end;
    }
    return Line;
}());
//# sourceMappingURL=objects.js.map