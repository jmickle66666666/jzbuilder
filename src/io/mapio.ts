class MapIO {

    static profile:boolean = false;
    static timer;

    static serialize(data:MapData):string {

        if (MapIO.profile) {
            MapIO.timer = Util.timer("serialize");
        }

        let output:string = "JZB01\n";
        data.sectors.forEach(s => {
            output += MapIO.serializeSector(s) + "\n";
        });
        
        if (MapIO.profile) {
            MapIO.timer.stop();
        }

        return output;
    }

    static serializeSector(sector:Sector):string {
        let output:string = "s(";
        for (let i = 0; i < sector.edges.length; i++) {
            output += MapIO.serializeEdge(sector.edges[i]);
        }
        return output;
    }

    static serializeEdge(edge:Edge):string {
        return "e("+MapIO.serializeVertex(edge.start)+MapIO.serializeVertex(edge.end)+")";
    }

    static serializeVertex(vertex:Vertex):string {
        return "v(" +vertex.x + "," + vertex.y + ")";
    }


    static unserialize(data:string):MapData {
        
        if (MapIO.profile) {
            MapIO.timer = Util.timer("unserialize");
        }

        let output:MapData = new MapData();
        output.sectors.length = 0;
        let lines:Array<string> = data.split('\n');
        if (lines[0] != "JZB01") {
            console.error("Incorrect version. Expected JZB01, got "+lines[0]);
            return null;
        }

        for (let i = 1; i < lines.length; i++) {
            output.sectors.push(MapIO.unserializeSector(lines[i]));
        }

        output.updateEdgePairs();

        if (MapIO.profile) {
            MapIO.timer.stop();
        }

        return output;
    }

    static unserializeSector(data:string):Sector {

        let output:Sector = new Sector();

        // s(e(v(1,1)v(1,1))e(v(1,1)v(1,1))e(v(1,1)v(1,1)))

        let edges:Array<string> = data.split('e');

        // s( (v(1,1)v(1,1)) (v(1,1)v(1,1)) (v(1,1)v(1,1)))

        for (let i = 1; i < edges.length; i++) {
            output.edges.push(MapIO.unserializeEdge(edges[i]));
        }

        output.update();
        return output;
    }  

    static unserializeEdge(data:string):Edge {
        // (v(1,1)v(1,1))...

        let vs:Array<string> = data.split('v');

        // ( (1,1) (1,1))...
        let e:Edge = new Edge(MapIO.unserializeVertex(vs[1]), MapIO.unserializeVertex(vs[2]));
        // console.log(e);
        return e;
    }

    static unserializeVertex(data:string):Vertex {
        let output : Vertex = new Vertex(0, 0);
        let commaIndex:number = data.indexOf(',');
        output.x = Number(data.substr(1, commaIndex - 1));
        output.y = Number(data.substr(commaIndex + 1, data.indexOf(')') - commaIndex - 1));
        return output;
    }
}