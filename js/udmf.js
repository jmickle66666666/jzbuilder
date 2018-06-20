var UDMFData = /** @class */ (function () {
    function UDMFData(data) {
        this.namespace = "zdoom";
        this.data = data;
        this.vertexes = new Array();
        this.sectors = new Array();
        this.lines = new Array();
        this.sidedefs = new Array();
        for (var i = 0; i < data.sectors.length; i++) {
            this.addSector(data.sectors[i]);
        }
    }
    UDMFData.prototype.addSector = function (s) {
        var us = new UDMFSector();
        // Sector Defaults
        us.texturefloor = "FLOOR4_8";
        us.textureceiling = "FLOOR4_8";
        us.heightceiling = 128;
        var l = this.sectors.push(us) - 1;
        for (var i = 0; i < s.lines.length; i++) {
            this.addLine(s.lines[i], l);
        }
    };
    UDMFData.prototype.addLine = function (l, sector) {
        var v1 = this.findVertex(l.start);
        var v2 = this.findVertex(l.end);
        for (var i = 0; i < this.lines.length; i++) {
            if (this.lines[i].v2 == v1) {
                if (this.lines[i].v1 == v2) {
                    this.lines[i].sideback = this.addSidedef(sector);
                    this.lines[i].blocking = false;
                    return;
                }
            }
        }
        var newLine = new UDMFLine(v1, v2, this.addSidedef(sector));
        newLine.blocking = true;
        this.lines.push(newLine);
    };
    UDMFData.prototype.addSidedef = function (sector) {
        var newSidedef = new UDMFSidedef(sector);
        newSidedef.texturemiddle = "BROWN1";
        return this.sidedefs.push(newSidedef) - 1;
    };
    UDMFData.prototype.addVertex = function (v) {
        for (var i = 0; i < this.vertexes.length; i++) {
            if (v.x == this.vertexes[i].x) {
                if (v.y == this.vertexes[i].y) {
                    return;
                }
            }
        }
        this.vertexes.push(new UDMFVertex(v.x, v.y));
    };
    UDMFData.prototype.findVertex = function (v) {
        for (var i = 0; i < this.vertexes.length; i++) {
            if (v.x == this.vertexes[i].x) {
                if (v.y == this.vertexes[i].y) {
                    return i;
                }
            }
        }
        var l = this.vertexes.push(new UDMFVertex(v.x, v.y)) - 1;
        return l;
    };
    UDMFData.prototype.toString = function () {
        var output = "";
        output += UDMFUtil.PropString("namespace", this.namespace);
        for (var i = 0; i < this.vertexes.length; i++) {
            output += this.vertexes[i].toString();
        }
        for (var i = 0; i < this.sidedefs.length; i++) {
            output += this.sidedefs[i].toString();
        }
        for (var i = 0; i < this.lines.length; i++) {
            output += this.lines[i].toString();
        }
        for (var i = 0; i < this.sectors.length; i++) {
            output += this.sectors[i].toString();
        }
        return output;
    };
    return UDMFData;
}());
var UDMFLine = /** @class */ (function () {
    function UDMFLine(v1, v2, sidefront) {
        this.id = -1;
        this.blocking = false;
        this.blockmonsters = false;
        this.twosided = false;
        this.dontpegtop = false;
        this.dontpegbottom = false;
        this.secret = false;
        this.blocksound = false;
        this.dontdraw = false;
        this.mapped = false;
        this.passuse = false;
        this.sideback = -1;
        this.v1 = v1;
        this.v2 = v2;
        this.sidefront = sidefront;
    }
    UDMFLine.prototype.toString = function () {
        var output = "";
        output += "linedef\n{\n";
        output += UDMFUtil.PropInt("id", this.id, true, -1);
        output += UDMFUtil.PropInt("v1", this.v1);
        output += UDMFUtil.PropInt("v2", this.v2);
        output += UDMFUtil.PropBool("blocking", this.blocking, true, false);
        output += UDMFUtil.PropBool("blockmonsters", this.blockmonsters, true, false);
        output += UDMFUtil.PropBool("twosided", this.twosided, true, false);
        output += UDMFUtil.PropBool("dontpegtop", this.dontpegtop, true, false);
        output += UDMFUtil.PropBool("dontpegbottom", this.dontpegbottom, true, false);
        output += UDMFUtil.PropBool("secret", this.secret, true, false);
        output += UDMFUtil.PropBool("blocksound", this.blocksound, true, false);
        output += UDMFUtil.PropBool("dontdraw", this.dontdraw, true, false);
        output += UDMFUtil.PropBool("mapped", this.mapped, true, false);
        output += UDMFUtil.PropBool("passuse", this.passuse, true, false);
        output += UDMFUtil.PropInt("sidefront", this.sidefront);
        output += UDMFUtil.PropInt("sideback", this.sideback, true, -1);
        output += "}\n";
        return output;
    };
    return UDMFLine;
}());
var UDMFSidedef = /** @class */ (function () {
    function UDMFSidedef(sector) {
        this.offsetx = 0;
        this.offsety = 0;
        this.texturetop = "-";
        this.texturemiddle = "-";
        this.texturebottom = "-";
        this.sector = sector;
    }
    UDMFSidedef.prototype.toString = function () {
        var output = "";
        output += "sidedef\n{\n";
        output += UDMFUtil.PropInt("offsetx", this.offsetx, true, 0);
        output += UDMFUtil.PropInt("offsety", this.offsety, true, 0);
        output += UDMFUtil.PropString("texturetop", this.texturetop, "-");
        output += UDMFUtil.PropString("texturemiddle", this.texturemiddle, "-");
        output += UDMFUtil.PropString("texturebottom", this.texturebottom, "-");
        output += UDMFUtil.PropInt("sector", this.sector);
        output += "}\n";
        return output;
    };
    return UDMFSidedef;
}());
var UDMFVertex = /** @class */ (function () {
    function UDMFVertex(x, y) {
        this.x = x;
        this.y = y;
    }
    UDMFVertex.prototype.toString = function () {
        var output = "";
        output += "vertex\n{\n";
        output += UDMFUtil.PropFloat("x", this.x);
        output += UDMFUtil.PropFloat("y", this.y);
        output += "}\n";
        return output;
    };
    return UDMFVertex;
}());
var UDMFSector = /** @class */ (function () {
    function UDMFSector() {
        this.heightfloor = 0;
        this.heightceiling = 0;
        this.lightlevel = 160;
        this.special = 0;
        this.id = 0;
    }
    UDMFSector.prototype.toString = function () {
        var output = "";
        output += "sector\n{\n";
        output += UDMFUtil.PropInt("heightfloor", this.heightfloor, true, 0);
        output += UDMFUtil.PropInt("heightceiling", this.heightceiling, true, 0);
        output += UDMFUtil.PropString("texturefloor", this.texturefloor);
        output += UDMFUtil.PropString("textureceiling", this.textureceiling);
        output += UDMFUtil.PropInt("lightlevel", this.lightlevel, true, 160);
        output += UDMFUtil.PropInt("special", this.special, true, 0);
        output += UDMFUtil.PropInt("id", this.id, true, 0);
        output += "}\n";
        return output;
    };
    return UDMFSector;
}());
var UDMFUtil = /** @class */ (function () {
    function UDMFUtil() {
    }
    UDMFUtil.PropString = function (name, value, ignoreval) {
        if (ignoreval === void 0) { ignoreval = ""; }
        if (value == ignoreval)
            return "";
        return name + " = \"" + value + "\";\n";
    };
    UDMFUtil.PropInt = function (name, value, ignore, ignoreval) {
        if (ignore === void 0) { ignore = false; }
        if (ignoreval === void 0) { ignoreval = 0; }
        if (ignore && ignoreval == Math.floor(value))
            return "";
        return name + " = " + Math.floor(value).toString() + ";\n";
    };
    UDMFUtil.PropFloat = function (name, value, ignore, ignoreval) {
        if (ignore === void 0) { ignore = false; }
        if (ignoreval === void 0) { ignoreval = 0; }
        if (ignore && ignoreval == value)
            return "";
        return name + " = " + value.toString() + ";\n";
    };
    UDMFUtil.PropBool = function (name, value, ignore, ignoreval) {
        if (ignore === void 0) { ignore = false; }
        if (ignoreval === void 0) { ignoreval = false; }
        if (ignore && ignoreval == value)
            return "";
        return name + " = " + (value ? "true" : "false") + ";\n";
    };
    return UDMFUtil;
}());
//# sourceMappingURL=udmf.js.map