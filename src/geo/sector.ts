class Sector {
    public edges : Array<Edge>;

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

}