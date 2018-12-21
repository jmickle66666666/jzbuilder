class Anim {

    public lerpSpeed:number;
    public obj:Object;
    public valueName:string;

    public targetValue:number;
    public timer:number;
    public onComplete:Function;
    public onRender:Function;

    public constructor (obj:Object, valueName:string, targetValue:number, lerpSpeed:number, onComplete:Function = null, onRender:Function = null) {
        this.lerpSpeed = lerpSpeed;
        this.obj = obj;
        this.valueName = valueName;
        this.targetValue = targetValue;
        this.timer = 1.0;
        this.onComplete = onComplete;
        this.onRender = onRender;

        if (Anim.animators == null) {
            Anim.animators = new Array<Anim>();
        }

        Anim.animators.push(this);
    }

    public render():void {
        if (this.onRender) {
            this.onRender();
        }
    }

    public update():void {
        this.obj[this.valueName] = this.lerp(this.obj[this.valueName], this.targetValue, this.lerpSpeed);
        this.timer = this.lerp(this.timer, 0, this.lerpSpeed);
        if (this.timer < 0.01) {
            if (this.onComplete) {
                this.onComplete();
            }
            Anim.remove(this);
        }
    }

    private lerp(a:number, b:number, amt:number) {
        return (b * amt) + (a * (1-amt));
    }

    public cancel() {
        Anim.remove(this);
    }

    // STATIC

    public static animators:Array<Anim>;

    public static update() {

        if (this.animators == null) return;
        if (this.animators.length == 0) return;

        dirty = true;

        this.animators.forEach(a => a.update());
    }

    public static render() {
        if (this.animators == null) return;
        if (this.animators.length == 0) return;
        this.animators.forEach(a => a.render());
    }

    public static remove(anim:Anim) {
        let index = this.animators.indexOf(anim);
        if (index > -1) {
            this.animators.splice(index, 1);
        }
    }
}