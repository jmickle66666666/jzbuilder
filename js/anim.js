var Anim = /** @class */ (function () {
    function Anim(obj, valueName, targetValue, lerpSpeed, onComplete, onRender) {
        if (onComplete === void 0) { onComplete = null; }
        if (onRender === void 0) { onRender = null; }
        this.lerpSpeed = lerpSpeed;
        this.obj = obj;
        this.valueName = valueName;
        this.targetValue = targetValue;
        this.timer = 1.0;
        this.onComplete = onComplete;
        this.onRender = onRender;
        if (Anim.animators == null) {
            Anim.animators = new Array();
        }
        Anim.animators.push(this);
    }
    Anim.prototype.render = function () {
        if (this.onRender) {
            this.onRender();
        }
    };
    Anim.prototype.update = function () {
        this.obj[this.valueName] = this.lerp(this.obj[this.valueName], this.targetValue, this.lerpSpeed);
        this.timer = this.lerp(this.timer, 0, this.lerpSpeed);
        if (this.timer < 0.01) {
            if (this.onComplete) {
                this.onComplete();
            }
            Anim.remove(this);
        }
    };
    Anim.prototype.lerp = function (a, b, amt) {
        return (b * amt) + (a * (1 - amt));
    };
    Anim.prototype.cancel = function () {
        Anim.remove(this);
    };
    Anim.update = function () {
        if (this.animators == null)
            return;
        if (this.animators.length == 0)
            return;
        dirty = true;
        this.animators.forEach(function (a) { return a.update(); });
    };
    Anim.render = function () {
        if (this.animators == null)
            return;
        if (this.animators.length == 0)
            return;
        this.animators.forEach(function (a) { return a.render(); });
    };
    Anim.remove = function (anim) {
        var index = this.animators.indexOf(anim);
        if (index > -1) {
            this.animators.splice(index, 1);
        }
    };
    return Anim;
}());
//# sourceMappingURL=anim.js.map