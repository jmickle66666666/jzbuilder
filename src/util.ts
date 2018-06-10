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