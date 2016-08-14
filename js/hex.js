
var Hex = function(row, col) {
    this.row = row;
    this.col = col;
    this.clickCount = 0;
    Hex.prototype.click = function() {
        console.log("click", this);
    }
    Hex.prototype.edgeClick = function(degree) {
        console.log(degree + " degree click", this);
    }
}

var HexMap = function(svgSelector) {
    var radius = 60;
    var svg = d3.select(svgSelector);
    var hexString = "";
    var dRow = 120;
    var dColX = 180;
    var dColY = 180;
    var offsetX = 0;
    var offsetY = 0;
    var edgeWidth = 10;
 
    function buildHexString() {
        var height = radius / 2 * Math.sqrt(3);
        var halfRad = radius / 2;
        return "M " + -halfRad + " " + -height + " L " + halfRad + " " + -height + " L " + radius + " 0 " + " L " + halfRad + " " + height + " L " + -halfRad + " " + height + " L " + -radius + " 0 Z"; 
    }

    function translate(d) {
        var translate = "translate(" + Math.floor(d.col * dColX + offsetX) + " " + Math.floor(d.row * dRow + d.col * dColY + offsetY) + ")";
        return translate;
    }

    HexMap.prototype.map = { };

    HexMap.prototype.neighbors = function(row, col) {
    }

    HexMap.prototype.toArray = function() {
        var hexes = [ ];
        for (var key in this.map) {
            hexes.push(this.map[key]);
        }
        return hexes;
    }

    HexMap.prototype.setRadius = function(radius) {
        this.radius = radius;
        dRow = radius * Math.sqrt(3);
        dColX = radius * 1.5;
        dColY = -radius / 2 * Math.sqrt(3);
        offsetX = radius;
        offsetY = radius / 2 * Math.sqrt(3);
        hexString = buildHexString();
        this.draw();
    }

    HexMap.prototype.setEdgeWidth = function(edgeWidth) {
        this.edgeWidth = edgeWidth;
        this.draw();
    }

    HexMap.prototype.buildRect = function(rows, cols) {
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < (i + 1) * 2 - 1 && j < cols; j++) {
                var key = j + "," + i;
                if (!(key in this.map)) {
                    this.map[key] = new Hex(i, j);
                }
            }
        }
        var row = rows;
        for (var i = 1; i < cols; i = i + 2) {
            for (var j = i; j < cols; j++) {
                var key = j + "," + row;
                if (!(key in this.map)) {
                    this.map[key] = new Hex(row, j);
                }
            }
            row = row + 1;
        }
        this.draw();
    }

    function makeTrapezoids() {
        var traps = [ ];
        if (radius > 15) {
            var rad = radius - edgeWidth;
            for (var deg = 0; deg < 360; deg = deg + 60) {
                var string = "M ";
                var cos = Math.cos(deg * Math.PI / 180);
                var sin = -Math.sin(deg * Math.PI / 180);
                string += Math.floor(cos * rad) + " " + Math.floor(sin * rad);
                string += " L " + Math.floor(cos * radius) + " " + Math.floor(sin * radius);
                var cos2 = Math.cos((deg + 60) * Math.PI / 180);
                var sin2 = -Math.sin((deg + 60) * Math.PI / 180);
                string += " L " + Math.floor(cos2 * radius) + " " + Math.floor(sin2 * radius);
                string += " L " + Math.floor(cos2 * rad) + " " + Math.floor(sin2 * rad) + " Z ";
                traps.push(string);
            }
        }
        return traps;
    }

    function makeInnerHex() {
        var rad = radius - edgeWidth;
        var string = "M " + rad + " 0 ";
        for (var deg = 60; deg < 360; deg = deg + 60) {
            string += "L " + Math.floor(Math.cos(deg * Math.PI / 180) * rad) + " " + Math.floor(Math.sin(deg * Math.PI / 180) * -rad) + " ";
        }
        string += "Z";
        return string;
    }

    HexMap.prototype.draw = function() {
        svg.select("path").remove();
        var groups = svg.selectAll("path")
            .data(this.toArray())
            .enter()
            .append("g");
        groups.append("path")
            .attr("row", function(d) { return d.row; })
            .attr("col", function(d) { return d.col; })
            .attr("d", hexString)
            .attr("transform", translate)
            .attr("stroke", "black")
            .attr("fill", "none")
            .attr("stroke-width", 3)
            .attr("pointer-events", "visible");
        var traps = makeTrapezoids();
        var innerHex = makeInnerHex();
        for (var index in traps) {
            groups.append("path")
                .attr("d", traps[index])
                .attr("transform", translate)
                .attr("stroke", "none")
                .attr("pointer-events", "visible")
                .attr("fill", "none")
                .attr("degree", function (d) { return Math.floor(index * 60 + 30); })
                .on("click", function(d, i) { d.edgeClick.apply(d, [Math.floor(parseInt(this.getAttribute("degree")))]); }); 
        }
        groups.append("path")
            .attr("d", innerHex)
            .attr("transform", translate)
            .attr("stroke", "none")
            .attr("pointer-events", "visible")
            .attr("fill", "none")
            .on("click", function(d, i) { d.click.apply(d); });
    }

    this.setRadius(60);
}

var map = null;

document.addEventListener("DOMContentLoaded", function(event) {
    map = new HexMap("#hexmap");
    d3.select("#hexmap").attr("width", 600).attr("height", 600);
    map.buildRect(5, 5);
});
