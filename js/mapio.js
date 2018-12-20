// Probably defunct?
// class SectorState {
//     public points:Array<number>;
//     public toSector() : Sector {
//         let output : Sector = new Sector(tempTexture);
//         for (let i = 0; i < this.points.length - 2; i+=2) {
//             output.lines.push(new Line(new Vertex(this.points[i], this.points[i+1]), new Vertex(this.points[i+2], this.points[i+3])));
//         }
//         output.invalidate();
//         return output;
//     }
//     public static fromSector(s:Sector):SectorState {
//         let output:SectorState = new SectorState();
//         output.points = new Array<number>();
//         output.points.push(s.lines[0].start.x);
//         output.points.push(s.lines[0].start.y);
//         for (let i = 0; i < s.lines.length; i++) {
//             output.points.push(s.lines[i].end.x);
//             output.points.push(s.lines[i].end.y);
//         }
//         return output;
//     }
// }
// class LineState {
//     public points:Array<number>;
//     public toLine():Line {
//         return new Line(new Vertex(this.points[0], this.points[1]), new Vertex(this.points[2], this.points[3]));
//     }
//     public static fromLine(l:Line):LineState {
//         let output:LineState = new LineState();
//         output.points = new Array<number>();
//         output.points.push(l.start.x);
//         output.points.push(l.start.y);
//         output.points.push(l.end.x);
//         output.points.push(l.end.y);
//         return output;
//     }
// }
// class UndoStack {
//     public LIMIT : number = 10;
//     public stack : Array<MapState> = new Array<MapState>();
//     public actionHistory : Array<string> = new Array<string>();
//     public save(action:string = ""):void {
//         this.stack.push(MapState.create());
//         if (this.stack.length > this.LIMIT) {
//             this.stack.shift();
//         }
//         if (action != "") {
//             this.actionHistory.push(action);
//         }
//     }
//     public restore():void {
//         if (this.stack.length > 0) {
//             this.stack.pop().restore();
//         }
//     }
//     public export():string {
//         return JSON.stringify({"undostack":this.stack,"actions":this.actionHistory});
//     }
// }
// class MapState {
//     public lines : Array<LineState>;
//     public sectors : Array<SectorState>;
//     public static create():MapState {
//         let output:MapState = new MapState();
//         output.lines = new Array<LineState>();
//         for (let i = 0; i < mapData.lines.length; i++) {
//             output.lines.push(LineState.fromLine(mapData.lines[i]));
//         }
//         output.sectors = new Array<SectorState>();
//         for (let i = 0; i < mapData.sectors.length; i++) {
//             output.sectors.push(SectorState.fromSector(mapData.sectors[i]));
//         }
//         return output;
//     }
//     public restore():void {
//         mapData.lines.length = 0;
//         for (let i = 0; i < this.lines.length; i++) {
//             mapData.lines.push(this.lines[i].toLine());
//         }
//         mapData.sectors.length = 0;
//         for (let i = 0; i < this.sectors.length; i++) {
//             mapData.sectors.push(this.sectors[i].toSector());
//         }
//     }
//     public toJSON():string {
//         return JSON.stringify({"lines":this.lines, "sectors":this.sectors});
//     }
//     public static fromJSON(json:string):MapState {
//         let obj = JSON.parse(json);
//         let output:MapState = new MapState();
//         output.lines = new Array<LineState>();
//         output.sectors = new Array<SectorState>();
//         for (let i = 0; i < obj.lines.length; i++) {
//             let nls = new LineState();
//             nls.points = obj.lines[i].points;
//             output.lines.push(nls)
//         }
//         for (let i = 0; i < obj.sectors.length; i++) {
//             let nls = new SectorState();
//             nls.points = obj.sectors[i].points;
//             output.sectors.push(nls)
//         }
//         return output;
//     }
// }
// function saveMap() {
//     saveString(MapState.create().toJSON(), "jzmap.json");
// }
// function loadMap(event) {
//     let fileInput = document.getElementById('maploader') as HTMLInputElement;
//     var reader = new FileReader();
//     reader.onload = onReaderLoad;
//     reader.readAsText(fileInput.files[0]);
// }
// function onReaderLoad(event) {
//     MapState.fromJSON(event.target.result).restore();
//     mainCanvas.redraw();
// }
// function exportUDMF() {
//     let udmf = new UDMFData(mapData);
//     saveString(udmf.toString(), "jzmap.udmf.txt");
// }
// function exportUndoStack() {
//     saveString(undoStack.export(), "jzundo.log");
// }
// function saveString(data:string, filename:string) {
//     var a = document.createElement("a");
//     let udmf = new UDMFData(mapData);
//     var file = new Blob([data], {type: "text/plain"});
//     a.href = URL.createObjectURL(file);
//     a.download = filename;
//     a.click();
// }
//# sourceMappingURL=mapio.js.map