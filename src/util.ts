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