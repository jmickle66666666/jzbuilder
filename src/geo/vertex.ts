class Vertex {
    public x : number;
    public y : number;
    
    public constructor (x:number, y:number) {
        this.x = x;
        this.y = y;
    }

    public equals(point:Vertex):boolean {
        return this.x == point.x && this.y == point.y;
    }

    public clone():Vertex {
        return new Vertex(this.x, this.y);
    }

    public static Add(a:Vertex, b:Vertex) {
        return new Vertex(a.x + b.x, a.y + b.y);
    }

    public static Subtract(a:Vertex, b:Vertex) {
        return new Vertex(a.x - b.x, a.y - b.y);
    }

    public setCoords(x:number, y:number):void {
        this.x = x;
        this.y = y;
    }

    public setTo(v:Vertex):void {
        this.x = v.x;
        this.y = v.y;
    }

    public translate(offset:Vertex):void {
        this.x += offset.x;
        this.y += offset.y;
    }

    public normalise():void {
        let mod = 1.0 / Util.distance(Vertex.Zero, this);
        this.x *= mod;
        this.y *= mod;
    }

    public normalised():Vertex {
        let output:Vertex = this.clone();
        output.normalise();
        return output;
    }
    

    public static Zero:Vertex = new Vertex(0, 0);
}