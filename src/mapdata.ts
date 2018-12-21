
class MapData {

//     public lines : Array<Line>;
    public sectors : Array<Sector>;

    constructor () {
//         this.lines = new Array<Line>();
        this.sectors = new Array<Sector>();
        this.defaultMap();
    }

    defaultMap() {
        let v:Array<Vertex> = new Array<Vertex>();
        v.push(new Vertex(-32, -32));
        v.push(new Vertex( 32, -32));
        v.push(new Vertex( 32,  32));
        v.push(new Vertex(-32,  32));
        let s = new Sector();
        s.edges.push(new Edge(v[3], v[2]));
        s.edges.push(new Edge(v[2], v[1]));
        s.edges.push(new Edge(v[1], v[0]));
        s.edges.push(new Edge(v[0], v[3]));
        s.edges[1].modifiers.push(new EdgeSubdivider(3));
        s.edges[1].modifiers.push(new EdgeInset(8, 0));
        s.update();
        this.sectors.push(s);
    }

    getAllEdges():Array<Edge> {
        let output:Array<Edge> = new Array<Edge>();
        for (let i = 0; i < this.sectors.length; i++) {
            output = output.concat(this.sectors[i].edges);
        }
        return output;
    }

    getNearestSector(p:Vertex):Sector {

        let e:Edge = this.getNearestEdge(p);
        return e.sector; // lol

        // if (this.sectors.length == 0) return null;
        // var nSector = null;
        // var nDist = Number.MAX_VALUE;
        // for (let i = 0; i < this.sectors.length; i++) {
        //     if (this.sectors[i].bounds.pointInBounds(p)) {
        //         let d = sqrDist(p, this.sectors[i].bounds.midPoint);
        //         if (d < nDist) {
        //             nDist = d;
        //             nIndex = i;
        //         }
        //     }
        // }

        // return nIndex;
    }

    getNearestEdge(p:Vertex):Edge {
        let allEdges:Array<Edge> = this.getAllEdges();
        if (allEdges.length == 0) return null;
        if (allEdges.length == 1) return allEdges[0];

        let nDist = distToSegmentMidpoint(p, allEdges[0]);
        let nEdge = allEdges[0];
        for (let i = 1; i < allEdges.length; i++) {
            let d = distToSegmentMidpoint(p, allEdges[i]);
            if (d < nDist) {
                nDist = d;
                nEdge = allEdges[i];
            }
        }
        return nEdge;
    }

    getVerticesAt(p:Vertex):Array<Vertex> {
        let allEdges:Array<Edge> = this.getAllEdges();
        if (allEdges.length == 0) return null;

        let outputVertices:Array<Vertex> = new Array<Vertex>();
        allEdges.forEach(e => {
            if (e.start.equals(p)) outputVertices.push(e.start);
            if (e.end.equals(p)) outputVertices.push(e.end);
        });

        return outputVertices;
    }

    moveVertex(from:Vertex, to:Vertex) {

        // This gets slower the more lines there are. If this gets bad, sort the lines and do a binary search
        // Also, this invalidates sectors a lot. I should really have a system for marking sectors as dirty and invalidate later.

        
        for (let i = 0; i < this.sectors.length; i++) {
            for (let j = 0; j < this.sectors[i].edges.length; j++) {
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
    }

    getEdgesWithVertex(v:Vertex):Array<Edge> {
        let output = new Array<Edge>();
        this.sectors.forEach(
            s => s.edges.forEach(
                e => {
                    if (e.start.equals(v)) {
                        output.push(e);
                    } else if (e.end.equals(v)) {
                        output.push(e);
                    }
                }
            )
        );
        return output;
    }

    getNearestVertex(v:Vertex):Vertex {

        let vertexes = new Array<Vertex>();
        let edges = this.getAllEdges();
        edges.forEach(e => {
            vertexes.push(e.start);
            vertexes.push(e.end);
        });

        let nDist = sqrDist(v, vertexes[0]);
        let nVert = vertexes[0];
        for (let i = 1; i < vertexes.length; i++) {
            let d = sqrDist(v, vertexes[i]);
            if (d < nDist) {
                nDist = d;
                nVert = vertexes[i];
            }
        }
        return nVert;
    }

//     getLinesWithVertex(p:Vertex):Array<any> {
//         let allLines:Array<Line> = this.getAllLines();
//         if (allLines.length == 0) return null;

//         let output = [];

//         for (let i = 0; i < allLines.length; i++) {
//             if (allLines[i].start.equals(p)) {
//                 output.push({line:allLines[i],position:"start"});
//             } else if (allLines[i].end.equals(p)) {
//                 output.push({line:allLines[i],position:"end"});
//             }
//         }
//         return output;
//     }

//     getNextConnectedVertexes(p:Vertex):Array<Vertex> {
//         let allLines:Array<Line> = this.getAllLines();
//         if (allLines.length == 0) return null;

//         let output:Array<Vertex> = new Array<Vertex>();

//         for (let i = 0; i < allLines.length; i++) {
//             if (allLines[i].start.equals(p)) {
//                 output.push(allLines[i].end);
//             } else if (allLines[i].end.equals(p)) {
//                 output.push(allLines[i].start);
//             }
//         }
//         return output;
//     }

//     deleteLine(l:Line):void {
//         for (let i = 0; i < this.lines.length; i++) {
//             if (this.lines[i].equals(l)) {
//                 this.lines.splice(i, 1);
//                 i -= 1;
//             }
//         }

//         for (let i = 0; i < this.sectors.length; i++) {
//             for (let j = 0; j < this.sectors[i].lines.length; j++) {
//                 if (this.sectors[i].lines[j].equals(l)) {
//                     this.sectors[i].lines.splice(j, 1);
//                     this.lines = this.lines.concat(this.sectors[i].lines);
//                     this.sectors.splice(i, 1);
//                     break;
//                 }
//             }
//         }

//         for (let i = 0; i < this.lines.length; i++) {
//             this.lines[i].sector = null;
//         }
//     }

//     deleteVertex(p:Vertex):void {
//         for (let i = 0; i < this.sectors.length; i++) {
//             for (let j = 0; j < this.sectors[i].lines.length; j++) {
//                 if (this.sectors[i].lines[j].containsVertex(p)) {
//                     this.sectors[i].lines.splice(j, 1);
//                     this.lines = this.lines.concat(this.sectors[i].lines);
//                     this.sectors.splice(i, 1);
//                     break;
//                 }
//             }
//         }

//         for (let i = 0; i < this.lines.length; i++) {
//             if (this.lines[i].containsVertex(p)) {
//                 this.lines.splice(i, 1);
//                 i -= 1;
//             }
//         }

//         for (let i = 0; i < this.lines.length; i++) {
//             this.lines[i].sector = null;
//         }
//     }

//     deleteSectorAt(p:Vertex):void {
//         if (this.sectors.length == 0) return;
//         var nIndex = -1;
//         var nDist = Number.MAX_VALUE;
//         for (let i = 0; i < this.sectors.length; i++) {
//             if (this.sectors[i].bounds.pointInBounds(p)) {
//                 let d = sqrDist(p, this.sectors[i].bounds.midPoint);
//                 if (d < nDist) {
//                     nDist = d;
//                     nIndex = i;
//                 }
//             }
//         }

//         this.sectors.splice(nIndex, 1);
//     }

//     vertexExists(p:Vertex) {
//         let allLines:Array<Line> = this.getAllLines();
//         if (allLines.length == 0) return null;

//         for (let i = 0; i < allLines.length; i++) {
//             if (allLines[i].start.equals(p)) {
//                 return true;
//             } else if (allLines[i].end.equals(p)) {
//                 return true;
//             }
//         }

//         return false;
//     }

//     createSplits(v:Vertex) {
//         let allLines:Array<Line> = this.getAllLines();
//         if (allLines.length == 0) return;

//         for (let i = 0; i < allLines.length; i++) {
//             if (allLines[i].pointOnLine(v)) {
//                 allLines[i].split(v);
//                 this.createSplits(v);
//                 return;
//             }
//         }
//     }

//     checkOverlaps(newLine:Line) {
//         let allLines:Array<Line> = this.getAllLines();
//         if (allLines.length == 0) return;

//         for (let i = 0; i < allLines.length; i++) {
//             if (linesIntersect(newLine, allLines[i])) {
//                 let inter = lineIntersection(newLine, allLines[i]);
                
//                 allLines[i].split(inter);
//                 newLine.split(inter);
//             }
//         }

//         this.createSplits(newLine.start);
//         this.createSplits(newLine.end);
//     }

//     revalidateDirty() {
//         let allLines:Array<Line> = this.getAllLines();

//         for (let i = 0; i < allLines.length; i++) {
//             if (allLines[i].dirty) {
//                 allLines[i].invalidate();
//             }
//         }

//         for (let i = 0; i < this.sectors.length; i++) {
//             if (this.sectors[i].dirty) {
//                 this.sectors[i].invalidate();
//             }
//         }
//     }

//     addLine(l:Line) {

//         Anim.addLine(l);

//         // First check if it completely overlaps an existing line
//         for (let i = 0 ; i < this.sectors.length; i++) {
//             for (let j = 0; j < this.sectors[i].lines.length; j++) {

//                 let ml:Line = this.sectors[i].lines[j];

//                 if (l.shareAngle(ml)) {
//                     if (ml.pointOnLine(l.start) && ml.pointOnLine(l.end)) {

//                         if (l.angle() != ml.angle()) l = l.reversed();


//                         ml.split(l.start);
//                         this.sectors[i].lines[j+1].split(l.end);
//                         console.log("ya");
//                         return;
//                     } else if (ml.pointOnLine(l.start)) {
//                         // Then check if it partially overlaps an existing line
//                         ml.split(l.start);
//                         return;
                        
//                     } else if (ml.pointOnLine(l.end)) {
//                         ml.split(l.end);
//                         return;
//                     } else if (l.pointOnLine(ml.start) &&
//                     l.pointOnLine(ml.end)) {
//                         if (l.angle() != ml.angle()) l = l.reversed();
//                         l.split(ml.start);
//                         return;
//                     } else if (l.pointOnLine(ml.start)) {
//                         l.split(ml.start);
//                         return;
//                     } else if (l.pointOnLine(ml.end)) {
//                         l.split(ml.end);
//                         return;
//                     }
//                 }
//             }
//         }

//         // Then check if it crosses an existing line

//         // Then check if one of the vertexes touches an existing line
//     }

}