function sqrDist(p1:Vertex, p2:Vertex):number {
    var a = p2.x - p1.x;
    var b = p2.y - p1.y;
    return a**2 + b**2;
}

function distToSegmentMidpoint(p:Vertex, l:Line):number {
    return sqrDist(p, new Vertex((l.start.x + l.end.x)/2, (l.start.y + l.end.y)/2));
}

function crossProduct(a:Vertex, b:Vertex, o:Vertex):number {
    return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}

function ccw(a:Vertex, b:Vertex, c:Vertex):boolean {
    return ((c.y-a.y) * (b.x-a.x) > (b.y-a.y) * (c.x-a.x));
}

function linesIntersect(l1:Line, l2:Line):boolean {
    if (l1.angle() == l2.angle()) return false;
    if (l1.angle() == l2.reversed().angle()) return false;
    if (l1.equals(l2)) return false;
    return (ccw(l1.start,l2.start,l2.end) != ccw(l1.end,l2.start,l2.end)) && (ccw(l1.start,l1.end,l2.start) != ccw(l1.start,l1.end,l2.end));
}

function lineIntersection(l1:Line, l2:Line):Vertex {
    let dx12 = l1.end.x - l1.start.x;
    let dy12 = l1.end.y - l1.start.y;
    let dx34 = l2.end.x - l2.start.x;
    let dy34 = l2.end.y - l2.start.y;

    let denom = (dy12 * dx34 - dx12 * dy34);

    let t1 = ((l1.start.x - l2.start.x) * dy34 + (l2.start.y - l1.start.y) * dx34) / denom;

    return new Vertex(l1.start.x + dx12 * t1, l1.start.y + dy12 * t1);
}

function convexHull(points:Array<Vertex>):Array<Vertex> {
    points.sort(function(a, b) {
        return a.x == b.x ? a.y - b.y : a.x - b.x;
    });

    var lower = [];
    for (var i = 0; i < points.length; i++) {
        while (lower.length >= 2 && crossProduct(lower[lower.length - 2], lower[lower.length - 1], points[i]) <= 0) {
            lower.pop();
        }
        lower.push(points[i]);
    }

    var upper = [];
    for (var i = points.length - 1; i >= 0; i--) {
        while (upper.length >= 2 && crossProduct(upper[upper.length - 2], upper[upper.length - 1], points[i]) <= 0) {
            upper.pop();
        }
        upper.push(points[i]);
    }

    upper.pop();
    lower.pop();
    return lower.concat(upper);
}

function insideOut(lines:Array<Line>) {
    let a = 0;
    for (let i = 0; i < lines.length; i++) {
        let p1 = lines[i].start;
        let p2 = lines[(i+1)%lines.length].start;
        let p3 = lines[(i+2)%lines.length].start;
        a += ccw(p1,p2,p3)?1:-1;
    }
    return a < 0;
}

function angleBetweenPoints(p1:Vertex, p2:Vertex, p3:Vertex):number {
    let a:number = pointDistance(p2, p1);
    let b:number = pointDistance(p2, p3);
    let c:number = pointDistance(p3, p1);
    return Math.acos(((a**2 + b**2) - c**2)/((a*b)*2));
}

function pointDistance(a:Vertex, b:Vertex):number {
    return Math.sqrt(sqrDist(a, b));
}

function lineAngle(a:Vertex, b:Vertex):number {
    return Math.atan2(b.y - a.y, b.x - a.x);
}

function traceShallowSector(start:Line, fail:boolean = false):Array<Vertex> {
    let output:Array<Vertex> = new Array<Vertex>();

    output.push(start.start);
    let nextPoint:Vertex = start.end;

    let life = 1000;
    while(   (!nextPoint.equals(start.start))               && life > 0) {
        life--;
        output.push(nextPoint);
        let nextList = mapData.getNextConnectedVertexes(nextPoint);
        
        let minAngle = Number.MAX_VALUE;
        let nextPointCandidate = null;

        // Reached a dead end :( we could look ahead to avoid this i think
        //if (nextList.length == 1) return null;

        for (let i = 0; i < nextList.length; i++) {
            let np = nextList[i];
            if (!np.equals(output[output.length-2])) {
                let ang = angleBetweenPoints(output[output.length-2], nextPoint, np);
                // while (ang < 0) ang += Math.PI*2;
                // while (ang > Math.PI*2) ang -= Math.PI*2;
                if (ang < minAngle) {
                    nextPointCandidate = np;
                    minAngle = ang;
                }
            }
        }
        if (nextPointCandidate == null) {
            //console.log("traceShallowSector() failed. Possibly unclosed");
            if (fail) {
                return null;
            }
            return traceShallowSector(start.reversed(), true);
        }

        nextPoint = nextPointCandidate;
    }

    output.push(nextPoint);
    
    return output;
}