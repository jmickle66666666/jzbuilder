class Edge {

    // Serialised variables
    public start:Vertex;
    public end:Vertex;
    public modifiers : Array<EdgeModifier>;
    // 

    public edgeLink:Edge;
    public sector : Sector;
    
    public dirty:Boolean = true;
    private processCache:ProcessedEdge;
    public process():ProcessedEdge {
        if (!this.dirty) {
            return this.processCache;
        } else {
            //this.dirty = false;

            let edge:ProcessedEdge = new ProcessedEdge();
            edge.vertices = new Array<Vertex>();
            edge.vertices.push(this.start);
            edge.vertices.push(this.end);
            for (let i = 0; i < this.modifiers.length; i++) {
                edge = this.modifiers[i].process(edge);
            }
            this.processCache = edge;
            return this.processCache;

        }
    }

    public getPerpendicular():Vertex {
        let l = this.length();
        let x = (this.end.x - this.start.x) / l;
        let y = (this.end.y - this.start.y) / l;
        return new Vertex(-y, x);
    }

    public getNormal():Vertex {
        let x = (this.end.x - this.start.x);
        let y = (this.end.y - this.start.y);
        return new Vertex(-y, x).normalised();
    }

    public getMidpoint():Vertex {
        return new Vertex((this.start.x + this.end.x)/2, (this.start.y + this.end.y)/2);
    }

    public length():number { 
        return Util.distance(this.start, this.end);
    }

    public constructor (start:Vertex, end:Vertex) {
        this.start = start.clone();
        this.end = end.clone();
        this.modifiers = new Array<EdgeModifier>();
        this.dirty = true;
    }

    public copy():Edge {
        let output:Edge = new Edge(this.start, this.end);
        return output;
    }

    public reversedCopy():Edge {
        let output:Edge = new Edge(this.end, this.start);
        return output;
    }

    public translate(offset:Vertex, moveLink:Boolean = true) {
        this.start.translate(offset);
        this.end.translate(offset);

        if (this.edgeLink && moveLink) {
            this.edgeLink.translate(offset, false);
        }

        if (this.sector) {

            let n = this.sector.nextEdge(this);
            let p = this.sector.previousEdge(this);
            n.start.translate(offset);
            p.end.translate(offset);

            if (n.edgeLink) {
                n.edgeLink.end.translate(offset);
            }

            if (p.edgeLink) {
                p.edgeLink.start.translate(offset);
            }

            n.dirty = true;
            p.dirty = true;

        }
        
        this.dirty = true;
    }

    public split(v:Vertex):Edge {
        if (v.equals(this.start) || v.equals(this.end)) return;
        let newLine = new Edge(v, this.end);
        this.end = v;
        this.sector.edges.splice(this.sector.edges.indexOf(this) + 1, 0, newLine);
        this.dirty = true;
        this.sector.update();
        return newLine;
    }

    public splitAtExistingVertexes() {
        mapData.sectors.forEach(s => {
            s.edges.forEach(e => {
                if (Util.distToSegmentSquared(e.start, this.start, this.end) < 1) {
                    this.split(e.start);
                } else if (Util.distToSegmentSquared(e.end, this.start, this.end) < 1) {
                    this.split(e.end);
                }
            });
        });
    }

    public clearModifiers() {
        this.modifiers = new Array<EdgeModifier>();
        this.processCache = null;
        this.dirty = true;
    }

    public getAngle():number {
        return Math.atan2(this.end.y - this.start.y, this.end.x - this.start.x);
    }

    public getGeometry() {

        let points = this.process().vertices;
        let off = 0;
        let geo = new THREE.Geometry();
        for (let i = 0; i < points.length - 1; i++) {
            let g = new THREE.Geometry();
            g.vertices.push(new THREE.Vector3(points[i].x, 0, points[i].y));
            g.vertices.push(new THREE.Vector3(points[i+1].x, 0, points[i+1].y));
            g.vertices.push(new THREE.Vector3(points[i].x, 128, points[i].y));
            g.vertices.push(new THREE.Vector3(points[i+1].x, 128, points[i+1].y));

            g.faces.push(new THREE.Face3(0, 2, 3));
            g.faces.push(new THREE.Face3(0, 3, 1));

            let len = Util.distance(points[i], points[i+1]);

            let uv00 = new THREE.Vector2(off, 0);
            let uv01 = new THREE.Vector2(off, 128);
            let uv11 = new THREE.Vector2(off + len, 128);
            let uv10 = new THREE.Vector2(off + len, 0);

            off += len;

            g.faceVertexUvs[0].push([uv00, uv01, uv11]);
            g.faceVertexUvs[0].push([uv00, uv11, uv10]);

            g.uvsNeedUpdate = true;

            geo.merge(g);
        }
        return geo;
    }

    public serializable():object {
        let mods = [];
        this.modifiers.forEach(m => {
            mods.push(m.serialised());
        });

        return {
            a : this.start.x,
            b : this.start.y,
            c : this.end.x,
            d : this.end.y,
            m : mods
        }
    }

    public static deserialize(edgeObject):Edge {
        let output = new Edge(
            new Vertex(edgeObject["a"], edgeObject["b"]), 
            new Vertex(edgeObject["c"], edgeObject["d"])
        );

        edgeObject["m"].forEach(m => {
            let mod = new window[m["classname"]]();
            mod.deserialize(m);
            output.modifiers.push(mod);
        });

        return output;
    }
}

class ProcessedEdge {
    public vertices : Array<Vertex>;

    public constructor() {
        this.vertices = new Array<Vertex>();
    }
}

interface EdgeModifier {
    process(edge: ProcessedEdge):ProcessedEdge;
    toString():string;
    name:string;
    editorElement?():HTMLElement;
    serialised():object;
}