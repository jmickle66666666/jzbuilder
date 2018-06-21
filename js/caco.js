var el = document.getElementById("cacodemon");
var xmov = 0;
var ymov = 0;
var xpos = 0;
var ypos = 0;
console.log(el);
var cacotic = function (e) {
    xpos += xmov;
    ypos += ymov;
    el.style.top = ypos.toString() + "px";
    el.style.left = xpos.toString() + "px";
    if (Math.random() < 0.01)
        cacodir();
};
var cacodir = function () {
    xmov = (Math.random() * 10.0) - 5.0;
    ymov = (Math.random() * 10.0) - 5.0;
};
cacodir();
window.setInterval(cacotic, 30);
//# sourceMappingURL=caco.js.map