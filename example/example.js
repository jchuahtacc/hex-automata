class ConwayHex extends Hex {
    constructor(json) {
        super(json);
        this.alive = false;
        if (json) {
            this.alive = json.alive;
        }
    }
    
    click() {
        this.alive = !this.alive;
        console.log("toggle", this);
        this.redraw();
    }

    dump() {
        var result = super.dump();
        result.alive = this.alive;
        return result;
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

function dump() {
    d3.select("#json").html(JSON.stringify(map.toJson()));
}

function load() {
    var dump = document.getElementById("json").value.trim().replace(/\s/g, ""); 
    this.map.fromJson(JSON.parse(dump), { "ConwayHex" : ConwayHex }); 
}

document.addEventListener("DOMContentLoaded", function(event) {
    map = new HexMap("#hexmap");
    map.radius = 40;
    map.edge = 5;
    map.hex = ConwayHex;
    d3.select("#hexmap").attr("width", 600).attr("height", 300);
    map.buildRect(3, 3);
});
