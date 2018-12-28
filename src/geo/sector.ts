class Sector {

    // Serialised variables
    public edges : Array<Edge>;
    //

    private _rect : Rect;
    public get rect():Rect {
        if (this._rect) return this._rect;

        let minx = Number.MAX_VALUE;
        let maxx = Number.MIN_VALUE;

        let miny = Number.MAX_VALUE;
        let maxy = Number.MIN_VALUE;

        this.edges.forEach(e => {
            minx = Math.min(minx, e.start.x, e.end.x);
            miny = Math.min(miny, e.start.y, e.end.y);
            maxx = Math.max(maxx, e.start.x, e.end.x);
            maxy = Math.max(maxy, e.start.y, e.end.y);
        });

        this._rect = new Rect(minx, miny, maxx-minx, maxy-miny);

        return this._rect;
    }

    public constructor () {
        this.edges = new Array<Edge>();
    }

    public update():void {
        for (let i = 0; i < this.edges.length; i++) {
            this.edges[i].sector = this;
        }
        this._rect = null;
    }

    public nextEdge(edge:Edge):Edge {
        let index = this.edges.indexOf(edge) + 1
        if (index == this.edges.length) index = 0;
        return this.edges[index];
    }

    public previousEdge(edge:Edge):Edge {
        let index = this.edges.indexOf(edge) - 1;
        if (index == -1) index = this.edges.length - 1;
        return this.edges[index];
    }

    public toPoints():Array<Vertex> {
        let output = new Array<Vertex>();

        for (let i = 0; i < this.edges.length; i++) {
            let e = this.edges[i].process();
            for (let j = 0; j < e.vertices.length - 1; j++) {
                output.push(e.vertices[j]);
            }
        }
        output.push(this.edges[0].start);

        return output;
    }

    public buildMesh(material) {

        let points = this.toPoints();

        for (let i = 0; i < this.edges.length; i++) {
            if (this.edges[i].edgeLink == null) {
                let g = this.edges[i].getGeometry();
                let m = new THREE.Mesh(g, material);
                threescene.add(m);
            }
        }

        let shape = new THREE.Shape();

        shape.moveTo(points[0].x, -points[0].y);
        for (let i = 1; i < points.length; i++) {
            shape.lineTo(points[i].x, -points[i].y);
        }

        let geo = new THREE.ShapeGeometry( shape );
        geo.rotateX(-Math.PI / 2);
        let mesh = new THREE.Mesh(geo, material);
        threescene.add(mesh);

        points = points.reverse();

        shape = new THREE.Shape();

        shape.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            shape.lineTo(points[i].x, points[i].y);
        }

        geo = new THREE.ShapeGeometry( shape );
        geo.rotateX(Math.PI / 2);
        geo.translate(0, 128, 0);
        mesh = new THREE.Mesh(geo, material);
        threescene.add(mesh);
    }

    public serializable():object {
        let serialisedEdges = [];
        this.edges.forEach(e => {
            serialisedEdges.push(e.serializable())
        });
        return {
            e : serialisedEdges
        };
    }

    public static deserialize(sectorObject):Sector {
        let output = new Sector();
        sectorObject["e"].forEach(e => {
            output.edges.push(Edge.deserialize(e));
        });
        output.update();
        return output;
    }

}