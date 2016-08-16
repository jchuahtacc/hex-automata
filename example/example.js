class ConwayHex extends Hex {
    constructor() {
        super();
        this.alive = false;
    }
    
    click() {
        this.alive = !this.alive;
        console.log("toggle", this);
        this.redraw();
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
    map.radius = 30;
    map.edge = 5;
    map.hex = ConwayHex;
    d3.select("#hexmap").attr("width", 1900).attr("height", 1050);
    map.buildRect(4, 4);
    console.log(JSON.stringify(map.toJson()));
});
