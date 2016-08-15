class ConwayHex extends Hex {
    constructor(x, y) {
        super(x, y);
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
    map.hex = ConwayHex;
    d3.select("#hexmap").attr("width", 600).attr("height", 600);
    map.buildRect(5, 5);
});
