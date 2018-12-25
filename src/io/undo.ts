class Undo {
    static stack:Array<string> = new Array<string>();

    static addState():void {
        Undo.stack.push(MapIO.serialize(mapData));
    }

    static undo():void {
        if (Undo.stack.length > 0) {
            mapData = MapIO.unserialize(Undo.stack.pop());
        }

        dirty = true;
    }
}