class MapData {

    public lines : Array<Line>;
    public sectors : Array<Sector>;

    constructor () {
        this.lines = new Array<Line>();
        this.sectors = new Array<Sector>();
    }

    getAllLines():Array<Line> {
        let output:Array<Line> = new Array<Line>();
        output = output.concat(this.lines);
        for (let i = 0; i < this.sectors.length; i++) {
            output = output.concat(this.sectors[i].lines);
        }
        return output;
    }

    getSectorIndexAt(p:Vertex):number {
        if (this.sectors.length == 0) return -1;
        var nIndex = -1;
        var nDist = Number.MAX_VALUE;
        for (let i = 0; i < this.sectors.length; i++) {
            if (this.sectors[i].bounds.pointInBounds(p)) {
                let d = sqrDist(p, this.sectors[i].bounds.midPoint);
                if (d < nDist) {
                    nDist = d;
                    nIndex = i;
                }
            }
        }

        return nIndex;
    }

    getNearestLine(p:Vertex):Line {
        let allLines:Array<Line> = this.getAllLines();
        if (allLines.length == 0) return null;
        if (allLines.length == 1) return allLines[0];

        let nDist = distToSegmentMidpoint(p, allLines[0]);
        let nLine = allLines[0];
        for (let i = 1; i < allLines.length; i++) {
            let d = distToSegmentMidpoint(p, allLines[i]);
            if (d < nDist) {
                nDist = d;
                nLine = new Line(allLines[i].start, allLines[i].end);
            }
        }
        return nLine;
    }

    moveVertex(from:Vertex, to:Vertex) {

        // This gets slower the more lines there are. If this gets bad, sort the lines and do a binary search
        // Also, this invalidates sectors a lot. I should really have a system for marking sectors as dirty and invalidate later.

        let allLines:Array<Line> = this.getAllLines();
        if (allLines.length == 0) return null;

        for (let i = 0; i < allLines.length; i++) {
            if (allLines[i].start.equals(from)) {
                allLines[i].start.x = to.x;
                allLines[i].start.y = to.y;
                allLines[i].invalidate();
            } else if (allLines[i].end.equals(from)) {
                allLines[i].end.x = to.x;
                allLines[i].end.y = to.y;
                allLines[i].invalidate();
            }
        }
    }

    deleteLine(l:Line):void {
        for (let i = 0; i < this.lines.length; i++) {
            if (this.lines[i].equals(l)) {
                this.lines.splice(i, 1);
                i -= 1;
            }
        }

        for (let i = 0; i < this.sectors.length; i++) {
            for (let j = 0; j < this.sectors[i].lines.length; j++) {
                if (this.sectors[i].lines[j].equals(l)) {
                    this.sectors[i].lines.splice(j, 1);
                    this.lines = this.lines.concat(this.sectors[i].lines);
                    this.sectors.splice(i, 1);
                    break;
                }
            }
        }

        for (let i = 0; i < this.lines.length; i++) {
            this.lines[i].sector = null;
        }
    }

    deleteVertex(p:Vertex):void {
        for (let i = 0; i < this.sectors.length; i++) {
            for (let j = 0; j < this.sectors[i].lines.length; j++) {
                if (this.sectors[i].lines[j].containsVertex(p)) {
                    this.sectors[i].lines.splice(j, 1);
                    this.lines = this.lines.concat(this.sectors[i].lines);
                    this.sectors.splice(i, 1);
                    break;
                }
            }
        }

        for (let i = 0; i < this.lines.length; i++) {
            if (this.lines[i].containsVertex(p)) {
                this.lines.splice(i, 1);
                i -= 1;
            }
        }

        for (let i = 0; i < this.lines.length; i++) {
            this.lines[i].sector = null;
        }
    }

    deleteSectorAt(p:Vertex):void {
        if (this.sectors.length == 0) return;
        var nIndex = -1;
        var nDist = Number.MAX_VALUE;
        for (let i = 0; i < this.sectors.length; i++) {
            if (this.sectors[i].bounds.pointInBounds(p)) {
                let d = sqrDist(p, this.sectors[i].bounds.midPoint);
                if (d < nDist) {
                    nDist = d;
                    nIndex = i;
                }
            }
        }

        this.sectors.splice(nIndex, 1);
    }

    vertexExists(p:Vertex) {
        let allLines:Array<Line> = this.getAllLines();
        if (allLines.length == 0) return null;

        for (let i = 0; i < allLines.length; i++) {
            if (allLines[i].start.equals(p)) {
                return true;
            } else if (allLines[i].end.equals(p)) {
                return true;
            }
        }

        return false;
    }

}