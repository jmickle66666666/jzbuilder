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
}

class Rect {
    public topLeft : Vertex;
    public bottomRight : Vertex;

    public constructor (x:number = 0, y:number = 0, width:number = 0, height:number = 0) {
        this.topLeft = new Vertex(x, y);
        this.bottomRight = new Vertex(x + width, y + height);
    }

    public get midPoint():Vertex {
        return new Vertex((this.topLeft.x + this.bottomRight.x) / 2, (this.topLeft.y + this.bottomRight.y) / 2);
    }

    public get width():number {
        return this.bottomRight.x - this.topLeft.x;
    }

    public get height():number {
        return this.bottomRight.y - this.topLeft.y;
    }

    public pointInBounds(p:Vertex):boolean {
        return p.x >= this.topLeft.x && p.y >= this.topLeft.y && p.x < this.bottomRight.x && p.y < this.bottomRight.y;
    }
}

class Sector {
    public bounds : Rect;
    public lines : Array<Line>;
    public preview : HTMLCanvasElement;
    public floorTexture : HTMLImageElement;

    public constructor (floorTexture : HTMLImageElement) {
        this.lines = new Array<Line>();

        this.floorTexture = floorTexture;
        //document.body.appendChild(this.floorTexture);
    }

    public invalidate():void {
        if (this.lines.length == 0) return;

        this.bounds = new Rect();

        for (let i = 0; i < this.lines.length; i++) {
            this.bounds.topLeft.x = Math.min(this.bounds.topLeft.x, this.lines[i].start.x, this.lines[i].end.x);
            this.bounds.topLeft.y = Math.min(this.bounds.topLeft.y, this.lines[i].start.y, this.lines[i].end.y);
            this.bounds.bottomRight.x = Math.max(this.bounds.bottomRight.x, this.lines[i].start.x, this.lines[i].end.x);
            this.bounds.bottomRight.y = Math.max(this.bounds.bottomRight.y, this.lines[i].start.y, this.lines[i].end.y);
        }

        this.preview = document.createElement("canvas");
        this.preview.width = this.bounds.width;
        this.preview.height = this.bounds.height;
        let ctx = this.preview.getContext('2d');
        
        ctx.beginPath();
        ctx.moveTo(this.lines[0].start.x - this.bounds.topLeft.x, this.lines[0].start.y - this.bounds.topLeft.y);
        for (let i = 0; i < this.lines.length; i++) {
            ctx.lineTo(this.lines[i].end.x - this.bounds.topLeft.x, this.lines[i].end.y - this.bounds.topLeft.y);
        }
        ctx.imageSmoothingEnabled = false;
        ctx.clip();
        

        let ox:number = this.bounds.topLeft.x % 64;
        let oy:number = this.bounds.topLeft.y % 64;
        for (let i = -ox - 64; i < this.bounds.width; i += 64) {
            for (let j = -oy - 64; j < this.bounds.height; j += 64) {
                ctx.drawImage(this.floorTexture, i, j);
            }
        }

    }
}

class Line {
    public start : Vertex;
    public end : Vertex;

    public frontSector : Sector;
    public backSector : Sector;
    public shapeDefining : boolean;

    public constructor (start:Vertex, end:Vertex) {
        this.start = start;
        this.end = end;
    }
}