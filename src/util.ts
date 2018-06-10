function sqrDist(p1:Vertex, p2:Vertex):number {
    var a = p2.x - p1.x;
    var b = p2.y - p1.y;
    return a**2 + b**2;
}

function distToSegmentMidpoint(p:Vertex, a:Vertex, b:Vertex):number {
    return sqrDist(p, new Vertex((a.x + b.x)/2, (a.y + b.y)/2));
}