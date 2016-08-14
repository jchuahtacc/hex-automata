var grid = { };
var dRow = 120;
var dColX = 180;
var dColY = 180;
var offsetX = 0;
var offsetY = 0;

var Hex = function(row, col) {
    this.row = row;
    this.col = col;
}

var HexMap = function(svgSelector) {
    var radius = 60;
    var svg = d3.select(svgSelector);
    var hexString = "";

 
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

    HexMap.prototype.draw = function() {
        svg.select("path").remove();
        svg.selectAll("path")
            .data(this.toArray())
            .enter()
            .append("path")
            .attr("row", function(d) { return d.row; })
            .attr("col", function(d) { return d.col; })
            .attr("d", hexString)
            .attr("transform", translate)
            .attr("stroke", "black")
            .attr("fill", "none")
            .attr("stroke-width", 3);
    }

    this.setRadius(60);
}

document.addEventListener("DOMContentLoaded", function(event) {
    var map = new HexMap("#hexmap");
    d3.select("#hexmap").attr("width", 600).attr("height", 600);
    map.buildRect(5, 5);
});
