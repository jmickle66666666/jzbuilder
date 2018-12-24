
class MapData {

    public sectors : Array<Sector>;

    constructor () {
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
        if (this.sectors.length == 0) return null;

        let nDist = Number.MAX_VALUE;
        let nSect = null;
        this.sectors.forEach(s => {
            if (s.rect.pointInBounds(p)) {
                let d = Util.sqrDist(p, s.rect.midPoint);
                if (d < nDist) {
                    nDist = d;
                    nSect = s;
                }
            }
        });

        return nSect;
    }

    getNearestEdge(p:Vertex, minimumDistance:number = Number.MAX_VALUE):Edge {
        let allEdges:Array<Edge> = this.getAllEdges();
        if (allEdges.length == 0) return null;

        let nDist = minimumDistance;
        let nEdge = null;
        for (let i = 0; i < allEdges.length; i++) {
            let d = Util.distToSegmentSquared(p, allEdges[i].start, allEdges[i].end);
            if (d < nDist) {
                nDist = d;
                nEdge = allEdges[i];
            }
        }
        return nEdge;
    }

    getVerticesAt(p:Vertex, into:Array<Vertex> = null):Array<Vertex> {
        let allEdges:Array<Edge> = this.getAllEdges();
        if (allEdges.length == 0) return null;

        if (into == null) {
            let outputVertices:Array<Vertex> = new Array<Vertex>();
            allEdges.forEach(e => {
                if (e.start.equals(p)) outputVertices.push(e.start);
                if (e.end.equals(p)) outputVertices.push(e.end);
            });

            return outputVertices;
        } else {
            allEdges.forEach(e => {
                if (e.start.equals(p) && into.indexOf(e.start) == -1) {
                    into.push(e.start);
                }
                if (e.end.equals(p) && into.indexOf(e.end) == -1) {
                    into.push(e.end);
                }
            });

            return into;
        }
    }

    moveVertex(from:Vertex, to:Vertex) {

        // This gets slower the more edges there are. If this gets bad, sort the lines and do a binary search

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

    getNearestVertex(v:Vertex, minimumDistance:number = Number.MAX_VALUE):Vertex {

        let vertexes = new Array<Vertex>();
        let edges = this.getAllEdges();
        edges.forEach(e => {
            vertexes.push(e.start);
            vertexes.push(e.end);
        });

        let nDist = Number.MAX_VALUE;
        let nVert = null;
        for (let i = 0; i < vertexes.length; i++) {
            let d = Util.sqrDist(v, vertexes[i]);
            if (d < minimumDistance && d < nDist) {
                nDist = d;
                nVert = vertexes[i];
            }
        }
        return nVert;
    }

    splitLinesAt(v:Vertex):boolean {
        let output = false;
        this.sectors.forEach(s => {
            s.edges.forEach(e => {
                if (Util.distToSegmentSquared(v, e.start, e.end) < 1) {
                    e.split(v);
                    output = true;
                }
            });
        });
        return output;
    }

    updateEdgePairs():void {

        let edges = this.getAllEdges();

        edges.forEach(e1 => {
            edges.forEach(e2 => {
                if (e1.start.equals(e2.end) && e1.end.equals(e2.start)) {
                    e1.edgeLink = e2;
                    e2.edgeLink = e1;
                }
            });
        });
        
    }

    quicksaveData:string;

    quicksave():void {
        this.quicksaveData = MapIO.serialize(this);
    }

    quickload():void {
        mapData = MapIO.unserialize(this.quicksaveData);
    }

    testload():void {
        mapData = MapIO.unserialize(MapIO.serialize(this));
    }

    // Keeping this in case there's something i can take from it
    
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