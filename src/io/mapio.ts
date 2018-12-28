class MapIO {

    static profile:boolean = true;
    static timer;

    static serialize(data:MapData):string {

        if (MapIO.profile) {
            MapIO.timer = Util.timer("serialize");
        }

        let ident:string = "JZB02";

        let sectors = [];
        data.sectors.forEach(s => {
            sectors.push(s.serializable());
        });

        let output = JSON.stringify({
            ident : ident,
            sectors : sectors
        });
        
        if (MapIO.profile) {
            MapIO.timer.stop();
        }

        return output;
    }


    static deserialize(data:string):MapData {
        
        if (MapIO.profile) {
            MapIO.timer = Util.timer("unserialize");
        }

        let output:MapData = new MapData();
        output.sectors.length = 0;

        let dataObject = JSON.parse(data);

        if (dataObject.ident == null) {
            console.error("Couldn't find ident");
        }

        if (dataObject.ident != "JZB02") {
            console.error("Incorrect version. Expected JZB02, got "+dataObject.ident);
        }

        dataObject.sectors.forEach(s => {
            output.sectors.push(Sector.deserialize(s));
        });

        output.updateEdgePairs();

        if (MapIO.profile) {
            MapIO.timer.stop();
        }

        return output;
    }
}