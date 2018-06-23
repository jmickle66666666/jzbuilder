class Anim {
    public static animLines:Array<CreateLineAnim>;

    public static update():void {
        if (Anim.animLines.length == 0) {
            return;
        }

        console.log("h");

        for (let i = 0; i < Anim.animLines.length; i++) {
            Anim.animLines[i].tick();
        }

        Anim.clearDeadAnims();

        mainCanvas.redraw();
    }

    public static clearDeadAnims():void {
        for (let i = 0; i < Anim.animLines.length; i++) {
            if (Anim.animLines[i].dead) {
                Anim.animLines.splice(i, 1);
                Anim.clearDeadAnims();
                break;
            }
        }
    }

    public static addLine(l:Line) {
        Anim.animLines.push(new CreateLineAnim(l));
    }
}

class CreateLineAnim {
    public width:number = 1.0;
    public line:Line;
    public color:string = "FFFFFF";
    public alpha:number = 1.0;
    public dead:boolean = false;

    public constructor(line:Line) {
        this.line = line;
    }

    public getColorString():string {
        return "rgb(255,255,255,"+this.alpha.toString()+")";
    }

    public tick():void {
        this.alpha = lerp(this.alpha, 0, 0.8);
        this.width = lerp(this.width, 20.0, 0.5);
        if (this.alpha < 0.01) this.dead = true;
    }
}

Anim.animLines = new Array<CreateLineAnim>();

window.setInterval(Anim.update, 1000/60);
console.log("is here?");
