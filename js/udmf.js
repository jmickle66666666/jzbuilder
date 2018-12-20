// // NEEDS UPDATING
// class UDMFData {
//     public lines:Array<UDMFLine>;
//     public sectors:Array<UDMFSector>;
//     public vertexes:Array<UDMFVertex>;
//     public sidedefs:Array<UDMFSidedef>;
//     public namespace:string = "zdoom";
//     public data:MapData;
//     public constructor(data:MapData) {
//         this.data = data;
//         this.vertexes = new Array<UDMFVertex>();
//         this.sectors = new Array<UDMFSector>();
//         this.lines = new Array<UDMFLine>();
//         this.sidedefs = new Array<UDMFSidedef>();
//         for (let i = 0; i < data.sectors.length; i++) {
//             this.addSector(data.sectors[i]);
//         }
//     }
//     public addSector(s:Sector) {
//         let us:UDMFSector = new UDMFSector();
//         // Sector Defaults
//         us.texturefloor = "FLOOR4_8";
//         us.textureceiling = "FLOOR4_8";
//         us.heightceiling = 128;
//         let l = this.sectors.push(us)-1;
//         for (let i = 0; i < s.lines.length; i++) {
//             this.addLine(s.lines[i], l);
//         }
//     }
//     public addLine(l:Line, sector:number) {
//         let v1:number = this.findVertex(l.start);
//         let v2:number = this.findVertex(l.end);
//         for (let i = 0; i < this.lines.length; i++) {
//             if (this.lines[i].v2 == v1) {
//                 if (this.lines[i].v1 == v2) {
//                     this.lines[i].sideback = this.addSidedef(sector);
//                     this.lines[i].blocking = false;
//                     return;
//                 }
//             }
//         }
//         let newLine:UDMFLine = new UDMFLine(v1, v2, this.addSidedef(sector));
//         newLine.blocking = true;
//         this.lines.push(newLine);
//     }
//     public addSidedef(sector:number):number {
//         let newSidedef = new UDMFSidedef(sector);
//         newSidedef.texturemiddle = "BROWN1";
//         return this.sidedefs.push(newSidedef)-1;
//     }
//     public addVertex(v:Vertex):void {
//         for (let i = 0; i < this.vertexes.length; i++) {
//             if (v.x == this.vertexes[i].x) {
//                 if (v.y == this.vertexes[i].y) {
//                     return;
//                 }
//             }
//         }
//         this.vertexes.push(new UDMFVertex(v.x, v.y));
//     }
//     public findVertex(v:Vertex):number {
//         for (let i = 0; i < this.vertexes.length; i++) {
//             if (v.x == this.vertexes[i].x) {
//                 if (v.y == this.vertexes[i].y) {
//                     return i;
//                 }
//             }
//         }
//         let l = this.vertexes.push(new UDMFVertex(v.x, v.y)) - 1;
//         return l;
//     }
//     public toString():string {
//         let output = "";
//         output += UDMFUtil.PropString("namespace", this.namespace);
//         for (let i = 0; i < this.vertexes.length; i++) { output += this.vertexes[i].toString(); }
//         for (let i = 0; i < this.sidedefs.length; i++) { output += this.sidedefs[i].toString(); }
//         for (let i = 0; i < this.lines.length; i++) { output += this.lines[i].toString(); }
//         for (let i = 0; i < this.sectors.length; i++) { output += this.sectors[i].toString(); }
//         return output;
//     }
// }
// class UDMFLine {
//     public id:number = -1;
//     public v1:number;
//     public v2:number;
//     public blocking:boolean = false;
//     public blockmonsters:boolean = false;
//     public twosided:boolean = false;
//     public dontpegtop:boolean = false;
//     public dontpegbottom:boolean = false;
//     public secret:boolean = false;
//     public blocksound:boolean = false;
//     public dontdraw:boolean = false;
//     public mapped:boolean = false;
//     public passuse:boolean = false;
//     public sidefront:number;
//     public sideback:number = -1;
//     public constructor(v1:number, v2:number, sidefront:number) {
//         this.v1 = v1;
//         this.v2 = v2;
//         this.sidefront = sidefront;
//     }
//     public toString():string {
//         let output:string = "";
//         output += "linedef\n{\n";
//         output += UDMFUtil.PropInt("id", this.id, true, -1);
//         output += UDMFUtil.PropInt("v1", this.v1);
//         output += UDMFUtil.PropInt("v2", this.v2);
//         output += UDMFUtil.PropBool("blocking", this.blocking, true, false);
//         output += UDMFUtil.PropBool("blockmonsters", this.blockmonsters, true, false);
//         output += UDMFUtil.PropBool("twosided", this.twosided, true, false);
//         output += UDMFUtil.PropBool("dontpegtop", this.dontpegtop, true, false);
//         output += UDMFUtil.PropBool("dontpegbottom", this.dontpegbottom, true, false);
//         output += UDMFUtil.PropBool("secret", this.secret, true, false);
//         output += UDMFUtil.PropBool("blocksound", this.blocksound, true, false);
//         output += UDMFUtil.PropBool("dontdraw", this.dontdraw, true, false);
//         output += UDMFUtil.PropBool("mapped", this.mapped, true, false);
//         output += UDMFUtil.PropBool("passuse", this.passuse, true, false);
//         output += UDMFUtil.PropInt("sidefront", this.sidefront);
//         output += UDMFUtil.PropInt("sideback", this.sideback, true, -1);
//         output += "}\n";
//         return output;
//     }
// }
// class UDMFSidedef {
//     public offsetx:number = 0;
//     public offsety:number = 0;
//     public texturetop:string = "-";
//     public texturemiddle:string = "-";
//     public texturebottom:string = "-";
//     public sector:number;
//     public constructor(sector:number) {
//         this.sector = sector;
//     }
//     public toString():string {
//         let output:string = "";
//         output += "sidedef\n{\n";
//         output += UDMFUtil.PropInt("offsetx", this.offsetx, true, 0);
//         output += UDMFUtil.PropInt("offsety", this.offsety, true, 0);
//         output += UDMFUtil.PropString("texturetop", this.texturetop, "-");
//         output += UDMFUtil.PropString("texturemiddle", this.texturemiddle, "-");
//         output += UDMFUtil.PropString("texturebottom", this.texturebottom, "-");
//         output += UDMFUtil.PropInt("sector", this.sector);
//         output += "}\n";
//         return output;
//     }
// }
// class UDMFVertex {
//     public x:number;
//     public y:number;
//     public constructor(x:number, y:number) {
//         this.x = x;
//         this.y = y;
//     }
//     public toString():string {
//         let output:string = "";
//         output += "vertex\n{\n";
//         output += UDMFUtil.PropFloat("x", this.x);
//         output += UDMFUtil.PropFloat("y", this.y);
//         output += "}\n";
//         return output;
//     }
// }
// class UDMFSector {
//     public heightfloor:number = 0;
//     public heightceiling:number = 0;
//     public texturefloor:string;
//     public textureceiling:string;
//     public lightlevel:number = 160;
//     public special:number = 0;
//     public id:number = 0;
//     public toString():string {
//         let output:string = "";
//         output += "sector\n{\n";
//         output += UDMFUtil.PropInt("heightfloor", this.heightfloor, true, 0);
//         output += UDMFUtil.PropInt("heightceiling", this.heightceiling, true, 0);
//         output += UDMFUtil.PropString("texturefloor", this.texturefloor);
//         output += UDMFUtil.PropString("textureceiling", this.textureceiling);
//         output += UDMFUtil.PropInt("lightlevel", this.lightlevel, true, 160);
//         output += UDMFUtil.PropInt("special", this.special, true, 0);
//         output += UDMFUtil.PropInt("id", this.id, true, 0);
//         output += "}\n";
//         return output;
//     }
// }
// class UDMFUtil {
//     static PropString(name:string, value:string, ignoreval:string = ""):string {
//         if (value == ignoreval) return "";
//         return name + " = \"" + value + "\";\n";
//     }
//     static PropInt(name:string, value:number, ignore:boolean = false, ignoreval:number = 0):string {
//         if (ignore && ignoreval == Math.floor(value)) return "";
//         return name + " = " + Math.floor(value).toString() + ";\n";
//     }
//     static PropFloat(name:string, value:number, ignore:boolean = false, ignoreval:number = 0):string {
//         if (ignore && ignoreval == value) return "";
//         return name + " = " + value.toString() + ";\n";
//     }
//     static PropBool(name:string, value:boolean, ignore:boolean = false, ignoreval:boolean = false):string {
//         if (ignore && ignoreval == value) return "";
//         return name + " = " + (value?"true":"false") + ";\n";
//     }
// }
//# sourceMappingURL=udmf.js.map