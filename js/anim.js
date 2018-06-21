var Anim = /** @class */ (function () {
    function Anim() {
    }
    Anim.update = function () {
        if (Anim.animLines.length == 0) {
            return;
        }
        console.log("h");
        for (var i = 0; i < Anim.animLines.length; i++) {
            Anim.animLines[i].tick();
        }
        Anim.clearDeadAnims();
        mainCanvas.redraw();
    };
    Anim.clearDeadAnims = function () {
        for (var i = 0; i < Anim.animLines.length; i++) {
            if (Anim.animLines[i].dead) {
                Anim.animLines.splice(i, 1);
                Anim.clearDeadAnims();
                break;
            }
        }
    };
    Anim.addLine = function (l) {
        Anim.animLines.push(new CreateLineAnim(l));
    };
    return Anim;
}());
var CreateLineAnim = /** @class */ (function () {
    function CreateLineAnim(line) {
        this.width = 1.0;
        this.color = "FFFFFF";
        this.alpha = 1.0;
        this.dead = false;
        this.line = line;
    }
    CreateLineAnim.prototype.getColorString = function () {
        return "rgb(255,255,255," + this.alpha.toString() + ")";
        var a = (this.alpha * 256).toString(16);
        if (a.length == 1)
            a = "0" + a;
        return this.color + a;
    };
    CreateLineAnim.prototype.tick = function () {
        this.alpha = lerp(this.alpha, 0, 0.8);
        this.width = lerp(this.width, 20.0, 0.5);
        if (this.alpha < 0.01)
            this.dead = true;
    };
    return CreateLineAnim;
}());
Anim.animLines = new Array();
window.setInterval(Anim.update, 1000 / 60);
console.log("is here?");
//# sourceMappingURL=anim.js.map