class Edge {

    public start:Vertex;
    public end:Vertex;
    public edgeLink:Edge;
    public sector : Sector;
    
    public modifiers : Array<EdgeModifier>;
    public dirty:Boolean = true;
    private processCache:ProcessedEdge;
    public process():ProcessedEdge {
        if (!this.dirty) {
            return this.processCache;
        } else {
            this.dirty = false;

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

    public clearModifiers() {
        this.modifiers = new Array<EdgeModifier>();
        this.processCache = null;
        this.dirty = true;
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
}