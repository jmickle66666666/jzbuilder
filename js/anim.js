var Anim = /** @class */ (function () {
    function Anim(obj, valueName, targetValue, lerpSpeed) {
        this.lerpSpeed = lerpSpeed;
        this.obj = obj;
        this.valueName = valueName;
        this.targetValue = targetValue;
        this.timer = 1.0;
        if (Anim.animators == null) {
            Anim.animators = new Array();
        }
        Anim.animators.push(this);
    }
    Anim.prototype.update = function () {
        this.obj[this.valueName] = this.lerp(this.obj[this.valueName], this.targetValue, this.lerpSpeed);
        this.timer = this.lerp(this.timer, 0, this.lerpSpeed);
        if (this.timer < 0.01) {
            Anim.remove(this);
        }
    };
    Anim.prototype.lerp = function (a, b, amt) {
        return (b * amt) + (a * (1 - amt));
    };
    Anim.update = function () {
        if (this.animators == null)
            return;
        if (this.animators.length == 0)
            return;
        dirty = true;
        this.animators.forEach(function (a) { return a.update(); });
    };
    Anim.remove = function (anim) {
        var index = this.animators.indexOf(anim);
        if (index > -1) {
            this.animators.splice(index, 1);
        }
    };
    Anim.create = function (obj, valueName, targetValue, lerpSpeed) {
        new Anim(obj, valueName, targetValue, lerpSpeed);
    };
    return Anim;
}());
//# sourceMappingURL=anim.js.map