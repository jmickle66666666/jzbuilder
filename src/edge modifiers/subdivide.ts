class EdgeSubdivider {
    private subdivisions:number;

    public constructor (subdivisions:number) {
        this.subdivisions = Math.round(subdivisions);
    }

    public process(edge:ProcessedEdge):ProcessedEdge {
        let output:ProcessedEdge = new ProcessedEdge();

        for (let i = 0; i < edge.vertices.length-1; i++) {

            for (let p = 0; p < 1.0; p+= 1/this.subdivisions) {
                let nv = new Vertex(
                    edge.vertices[i].x + ((edge.vertices[i+1].x - edge.vertices[i].x) * p),
                    edge.vertices[i].y + ((edge.vertices[i+1].y - edge.vertices[i].y) * p)
                );
                output.vertices.push(nv);
            }

        }
        output.vertices.push(edge.vertices[edge.vertices.length-1]);
        return output;
    }

    public toString():string {
        return "Edge Subdivide";
    }
}