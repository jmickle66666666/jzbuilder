namespace JZBuilder {

    function sqrDist(p1:Point, p2:Point):number {
        var a = p2.x - p1.x;
        var b = p2.y - p1.y;
        return a**2 + b**2;
    }

    function distToSegmentMidpoint(p:Point, a:Point, b:Point):number {
        return sqrDist(p, new Point((a.x + b.x)/2, (a.y + b.y)/2));
    }

}