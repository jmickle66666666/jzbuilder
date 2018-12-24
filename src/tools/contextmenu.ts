class ContextMenu implements ITool {
    name:string = "menu";
    selectKey:string = "none";

    items:Array<MenuItem>;
    position:Vertex;
    width:number;

    static fillColor:string = Color.rgbToHex(0.2,0.2,0.2);
    static selectFillColor:string = Color.rgbToHex(0.4,0.4,0.4);
    static textColor:string = Color.rgbToHex(1,1,1);
    static itemSpacing:number = 26;

    public constructor (position:Vertex, ...items:Array<MenuItem>) {
        this.position = position;
        this.items = items;
        dirty = true;
        this.width = 0;
        this.items.forEach(i => {
            this.width = Math.max(this.width, i.label.length * 8);
        })
        this.width += 8;
    }

    public onMouseDown(e:MouseEvent) {
        if (e.button == 0) {
            let index = this.getMouseItemIndex();
            if (index != -1) {
                if (this.items[index].onClick) {
                    this.items[index].onClick();
                    Tool.defaultTool();
                }
            } else {
                Tool.defaultTool();
            }
        }
    }

    public onRender() {
        let pos:Vertex = mainCanvas.posToView(this.position);

        mainCanvas.ctx.fillStyle = ContextMenu.fillColor;
        mainCanvas.ctx.fillRect(pos.x, pos.y, this.width, ContextMenu.itemSpacing * this.items.length);

        let index = this.getMouseItemIndex();
        if (index != -1) {
            mainCanvas.ctx.fillStyle = ContextMenu.selectFillColor;
            mainCanvas.ctx.fillRect(pos.x, pos.y + this.getMouseItemIndex() * ContextMenu.itemSpacing, this.width, ContextMenu.itemSpacing);
        }

        mainCanvas.ctx.textAlign = "left";
        mainCanvas.ctx.textBaseline = "bottom";
        mainCanvas.ctx.font = "16px Ubuntu Mono";
        mainCanvas.ctx.fillStyle = ContextMenu.textColor;

        for (let i = 0; i < this.items.length; i++) {
            let m:MenuItem = this.items[i];
            mainCanvas.ctx.fillText(m.label, pos.x + 4, pos.y + ((i+0.8) * ContextMenu.itemSpacing));
        }
    }

    public getMouseItemIndex():number {
        if (Input.mousePos.x < this.position.x) return -1;
        if (Input.mousePos.y < this.position.y) return -1;
        if (Input.mousePos.y >= this.position.y + (this.items.length * ContextMenu.itemSpacing)) return -1;
        if (Input.mousePos.x >= this.position.x + this.width) return -1;

        return Math.floor((Input.mousePos.y - this.position.y) / ContextMenu.itemSpacing);
    }

    public static create(...items:Array<MenuItem>) {
        Tool.changeTool(
            new ContextMenu(
                Input.mousePos,
                ...items
            )
        );
    } 
}

class MenuItem {
    label:string;
    onClick:Function;
    public constructor (label:string, onClick:Function) {
        this.label = label;
        this.onClick = onClick;
    }
}