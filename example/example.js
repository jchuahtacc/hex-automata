class ConwayHex extends Hex {
    constructor(x, y) {
        super(x, y);
        this.alive = false;
    }
    
    click() {
        this.alive = !this.alive;
    }

    renderHex(radius) {
        var g = d3.select(document.createElement("g"));
        g.append("rect")
            .attr("width", radius * 2)
            .attr("height", radius * Math.sqrt(3))
            .attr("fill", this.alive ? "steelblue" : "none");
        return g.html();
    }
}

var map = null;

document.addEventListener("DOMContentLoaded", function(event) {

    map = new HexMap("#hexmap");
    d3.select("#hexmap").attr("width", 600).attr("height", 600);
    map.buildRect(2, 2);
    map.redrawCell(1, 1);
/*
    var nums = [ 2, 3, 4, 5 ];

    function update(nums) {
        var select = d3.select("body").selectAll("div").data(nums);
        select.enter().append("div").append("p").html(function(d) { console.log(d); return d; }).merge(select);
        d3.select("body").selectAll("div").append("p").html(function(d) { return "p2 " + d; });        
    }
    update(nums);
    */
});
