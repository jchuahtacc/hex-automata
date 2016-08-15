class ConwayHex extends Hex {
    constructor(x, y) {
        super(x, y);
        this.alive = false;
    }
    
    click() {
        this.alive = !this.alive;
    }

}

var map = null;

document.addEventListener("DOMContentLoaded", function(event) {
/*
    map = new HexMap("#hexmap");
    d3.select("#hexmap").attr("width", 600).attr("height", 600);
    map.buildRect(2, 2);

    var cell = new Hex(4, 4);
    map.set(4, 4, cell);
    map.drawCell(4, 4);
    */
    var nums = [ 0, 1, 2, 3, 4];
    var nums2 = [5, 6, 7];
    var s1 = d3.select("body").selectAll("p").data(nums).enter().append("p").html(function(d) { return d; });
    var s2 = d3.select("body").selectAll("p").data(nums2).enter().append("p").html(function(d) { return d; });
    console.log("s1", s1);
    console.log("s2", s2);
    s1.append(s2);
});
