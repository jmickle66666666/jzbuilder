function sqrDist(p1, p2) {
    var a = p2.x - p1.x;
    var b = p2.y - p1.y;
    return Math.pow(a, 2) + Math.pow(b, 2);
}
function distToSegmentMidpoint(p, a, b) {
    return sqrDist(p, new Vertex((a.x + b.x) / 2, (a.y + b.y) / 2));
}
//# sourceMappingURL=util.js.map