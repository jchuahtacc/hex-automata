class ConwayHex extends Hex {
    constructor(x, y) {
    
    }
}

var map = null;

document.addEventListener("DOMContentLoaded", function(event) {
    map = new HexMap("#hexmap");
    d3.select("#hexmap").attr("width", 600).attr("height", 600);
    map.buildRect(5, 5);
});
