namespace JZBuilder {

    export class Point {
        public x : number;
        public y : number;
        public constructor (x:number, y:number) {
            this.x = x;
            this.y = y;
        }
    }

    export class Rect {
        public topLeft : Point;
        public bottomRight : Point;

        public constructor (x:number = 0, y:number = 0, width:number = 0, height:number = 0) {
            this.topLeft = new Point(x, y);
            this.bottomRight = new Point(x + width, y + height);
        }

        public get midPoint():Point {
            return new Point((this.topLeft.x + this.bottomRight.x) / 2, (this.topLeft.y + this.bottomRight.y) / 2);
        }

        public get width():number {
            return this.bottomRight.x - this.topLeft.x;
        }

        public get height():number {
            return this.bottomRight.y - this.topLeft.y;
        }

        public pointInBounds(p:Point):boolean {
            return p.x >= this.topLeft.x && p.y >= this.topLeft.y && p.x < this.bottomRight.x && p.y < this.bottomRight.y;
        }
    }

    export class Sector {
        public bounds : Rect;
        public lines : Array<Line>;
        public preview : HTMLCanvasElement;
        public floorTexture : HTMLImageElement;

        public constructor () {
            this.floorTexture = document.createElement("img");
            this.floorTexture.src = "JZCRATE2";
        }

        public invalidate():void {
            if (this.lines.length == 0) return;

            this.bounds = new Rect();

            for (var i = 0; i < this.lines.length; i++) {
                this.bounds.topLeft.x = Math.min(this.bounds.topLeft.x, this.lines[i].start.x, this.lines[i].end.x);
                this.bounds.topLeft.y = Math.min(this.bounds.topLeft.y, this.lines[i].start.y, this.lines[i].end.y);
                this.bounds.bottomRight.x = Math.max(this.bounds.bottomRight.x, this.lines[i].start.x, this.lines[i].end.x);
                this.bounds.bottomRight.y = Math.max(this.bounds.bottomRight.x, this.lines[i].start.y, this.lines[i].end.y);
            }

            this.preview = document.createElement("canvas");
            this.preview.width = this.bounds.width;
            this.preview.height = this.bounds.height;
            var ctx = this.preview.getContext('2d');
            
            ctx.beginPath();
            ctx.moveTo(this.lines[0].start.x - this.bounds.topLeft.x, this.lines[0].start.y - this.bounds.topLeft.y);
            for (i = 0; i < this.lines.length; i++) {
                ctx.lineTo(this.lines[i].end.x - this.bounds.topLeft.x, this.lines[i].end.y - this.bounds.topLeft.y);
            }
            ctx.imageSmoothingEnabled = false;
            ctx.clip();

            var ox:number = this.bounds.topLeft.x % 64;
            var oy:number = this.bounds.topLeft.y % 64;

            for (i = -ox - 64; i < this.bounds.width; i += 64) {
                for (var j = -oy - 64; j < this.bounds.height; j += 64) {
                    ctx.drawImage(this.floorTexture, i, j);
                }
            }

        }
    }

    export class Line {
        public start : Point;
        public end : Point;

        public frontSector : Sector;
        public backSector : Sector;
        public shapeDefining : boolean;

        public constructor (start:Point, end:Point) {
            this.start = start;
            this.end = end;
        }
    }

}