class EdgeInset {
    private x:number;
    private y:number;

    public constructor (x:number, y:number) {
        this.x = x;
        this.y = y;
    }

    public process(edge:ProcessedEdge):ProcessedEdge {
        for (let i = 1; i < edge.vertices.length-1; i++) {
            edge.vertices[i].x += this.x;
            edge.vertices[i].y += this.y;
        }
        return edge;
    }
}