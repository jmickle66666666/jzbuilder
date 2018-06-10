
namespace JZBuilder
{

    export enum EditMode {
        VERTEX,
        LINE,
        SECTOR,
        THING
    }

    export class BuilderCanvas {
        // Constants
        CANVAS_BG_COLOR : string        = "#434043";
        GRID_COLOR : string             = "#000000";
        GRID_CENTER_COLOR : string      = "#888888";
        DRAWLINE_COLOR : string         = "#998811";
        MAPLINE_COLOR : string          = "#cccccc";
        HIGHLIGHTLINE_COLOR : string    = "#FFFFFF";
        VERTEX_COLOR : string           = "#FF8811";
        DRAWVERTEX_COLOR : string       = "#FFFFFF";
        SECTOR_COLOR : string           = "#22441144";
        SELECTEDLINE_COLOR : string     = "#FFAA11";
        LINE_SELECT_DISTANCE : number   = 5;
        VERTEX_SIZE : number            = 2;
        ZOOM_SPEED : number             = 1.05;
        GRIDLINE_WIDTH : number         = 0.5;

        viewOffset : Point = new Point(-400, -300);
        zoom : number = 1.0;
        gridSize : number = 32;

        canvas : HTMLCanvasElement;
        ctx : CanvasRenderingContext2D;

        mapData : MapData;

        public constructor (canvas: HTMLCanvasElement) {
            this.canvas = canvas;
            this.ctx = <CanvasRenderingContext2D> this.canvas.getContext('2d');
        }

        public posToView(p:Point): Point {
            return new Point((p.x / this.zoom) - this.viewOffset.x, (p.y / this.zoom) - this.viewOffset.y);
        }

        public viewToPos(p:Point): Point {
            return new Point((p.x + this.viewOffset.x) * this.zoom, (p.y + this.viewOffset.y)* this.zoom);
        }

        public redraw():void {
            this.drawGrid();
            this.drawSectors();
            this.drawMapLines();
            this.drawDrawLines();
            this.drawVertexes();
            this.drawSelectedLines();
            this.drawHighlightedLines();
        }

        drawGrid():void {
            this.ctx.fillStyle = this.CANVAS_BG_COLOR;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.lineWidth = this.GRIDLINE_WIDTH;
            this.ctx.strokeStyle = this.GRID_COLOR;
            let i;
            for (i = 0; i < this.canvas.width; i++) {
                if ( (i + this.viewOffset.x) % Math.round(this.gridSize/this.zoom) == 0 ) {
                    if (i + this.viewOffset.x == 0) this.ctx.strokeStyle = this.GRID_CENTER_COLOR;
                    this.ctx.beginPath();
                    this.ctx.moveTo(i, 0);
                    this.ctx.lineTo(i, this.canvas.height);
                    this.ctx.stroke();
                    if (i + this.viewOffset.x == 0) this.ctx.strokeStyle = this.GRID_COLOR;
                }
            }

            for (i = 0; i < this.canvas.width; i++) {
                if ( (i + this.viewOffset.y) % Math.round(this.gridSize/this.zoom) == 0 ) {
                    if (i + this.viewOffset.y == 0) this.ctx.strokeStyle = this.GRID_CENTER_COLOR;
                    this.ctx.beginPath();
                    this.ctx.moveTo(0, i);
                    this.ctx.lineTo(this.canvas.height, i);
                    this.ctx.stroke();
                    if (i + this.viewOffset.y == 0) this.ctx.strokeStyle = this.GRID_COLOR;
                }
            }
        }

        drawSectors():void {

        }

        drawMapLines():void {
            this.drawLines(this.mapData.lines, this.MAPLINE_COLOR);
        }

        drawDrawLines():void {
            //this.drawLines(this.mapData.lines, this.MAPLINE_COLOR);
        }

        drawVertexes():void {

        }

        drawSelectedLines():void {
            //this.drawLines(this.mapData.lines, this.MAPLINE_COLOR);
        }

        drawHighlightedLines():void {
            //this.drawLines(this.mapData.lines, this.MAPLINE_COLOR);
        }

        drawLines(lines : Array<Line>, color:string, width:number = 1.0):void {

        }


    }
}