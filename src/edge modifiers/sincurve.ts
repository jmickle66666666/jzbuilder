class SinCurve implements EdgeModifier {
    private points:number;
    private distance:number;
    public name:string = "SinCurve";

    public constructor (points:number = 5, distance:number = 16) {
        this.points = points;
        this.distance = distance;
    }

    public process(edge:ProcessedEdge):ProcessedEdge {

        if (this.points <= 0) return edge;

        let output:ProcessedEdge = new ProcessedEdge();



        for (let i = 0; i < edge.vertices.length - 1; i++) {

            output.vertices.push(edge.vertices[i]);
            let offset:Vertex = Vertex.Subtract(edge.vertices[i+1], edge.vertices[i]);
            let e:Edge = new Edge(edge.vertices[i], edge.vertices[i + 1]);
            let normal:Vertex = e.getNormal();

            for (let j = 1.0 / this.points; j <= 1.0; j += 1.0 / this.points) {
                let nv = Vertex.Add(edge.vertices[i], offset.scaled(j));
                nv.add(normal.scaled(this.distance * Math.sin(j * Math.PI)));
                output.vertices.push(nv);
            }

        }

        return output;
    }

    public editorElement():HTMLElement {
        let elem = document.createElement("div");
        elem.appendChild(Properties.NumberField(this, "points"));
        elem.appendChild(Properties.NumberField(this, "distance"));
        return elem;
    }

    public serialised():object {
        return {
            points : this.points,
            distance : this.distance,
            classname : "SinCurve"
        }
    }

    public deserialize(obj) {
        this.points = obj.points;
        this.distance = obj.distance;
    }
}