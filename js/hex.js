// Hex.js
//
// ECMAScript 6

class Hex {
    constructor(row, col) {
        this.row = row;
        this.col = col;
    }

    click() {
        console.log("click", this);
    }

    edgeClick(degree) {
        console.log(degree + " degree click", this);
    }
}

HexMap = function(svgSelector) {
    var _radius = 60;
    var _dRow = 120;
    var _dColX = 180;
    var _dColY = 180;
    var _offsetX = 0;
    var _offsetY = 0;
    var _edge = 10;
    var _map = { };
    var _traps = [ ];
    var _innerHex = "";
    var _svg = null;
    var _hex = Hex;

    function _buildHexString() {
        var height = _radius / 2 * Math.sqrt(3);
        var halfRad = _radius / 2;
        return "M " + -halfRad + " " + -height + " L " + halfRad + " " + -height + " L " + _radius + " 0 " + " L " + halfRad + " " + height + " L " + -halfRad + " " + height + " L " + -_radius + " 0 Z"; 
    }

    function _translate(d) {
        var translate = "translate(" + Math.floor(d.col * _dColX + _offsetX) + " " + Math.floor(d.row * _dRow + d.col * _dColY + _offsetY) + ")";
        return translate;
    }

    function _makeTrapezoids() {
        var traps = [ ];
        if (_radius > 15) {
            var rad = _radius - _edge;
            for (var deg = 0; deg < 360; deg = deg + 60) {
                var string = "M ";
                var cos = Math.cos(deg * Math.PI / 180);
                var sin = -Math.sin(deg * Math.PI / 180);
                string += Math.floor(cos * rad) + " " + Math.floor(sin * rad);
                string += " L " + Math.floor(cos * _radius) + " " + Math.floor(sin * _radius);
                var cos2 = Math.cos((deg + 60) * Math.PI / 180);
                var sin2 = -Math.sin((deg + 60) * Math.PI / 180);
                string += " L " + Math.floor(cos2 * _radius) + " " + Math.floor(sin2 * _radius);
                string += " L " + Math.floor(cos2 * rad) + " " + Math.floor(sin2 * rad) + " Z ";
                traps.push(string);
            }
        }
        return traps;
    }

    function _makeInnerHex() {
        var rad = this._radius - this._edge;
        var string = "M " + rad + " 0 ";
        for (var deg = 60; deg < 360; deg = deg + 60) {
            string += "L " + Math.floor(Math.cos(deg * Math.PI / 180) * rad) + " " + Math.floor(Math.sin(deg * Math.PI / 180) * -rad) + " ";
        }
        string += "Z";
        return string;
    }


    function _recompute() {
        _dRow = _radius * Math.sqrt(3);
        _dColX = _radius * 1.5;
        _dColY = -_radius / 2 * Math.sqrt(3);
        _offsetX = _radius;
        _offsetY = _radius / 2 * Math.sqrt(3);
        _hexString = _buildHexString();
        _traps = _makeTrapezoids();
        _innerHex = _makeInnerHex();
    }

    Object.defineProperty(HexMap, 'radius', {
        get : function() { return _radius; },
        set : function(val) { _radius = val; _recompute(); draw(); }
    });

    Object.defineProperty(HexMap, 'edge', {
        get : function() { return _edge; },
        set : function(val) { _edge = val; _recompute(); draw(); }
    });

    Object.defineProperty(HexMap, 'hex', {
        get : function() { return _hex; },
        set : function(val) { _hex = val; _recompute(); draw(); }
    });

    HexMap.prototype.neighbors = function(row, col) {
    }

    HexMap.prototype.toArray = function() {
        var hexes = [ ];
        for (var key in _map) {
            hexes.push(_map[key]);
        }
        return hexes;
    }

    HexMap.prototype.buildRect = function(rows, cols) {
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < (i + 1) * 2 - 1 && j < cols; j++) {
                var key = j + "," + i;
                if (!(key in _map)) {
                    _map[key] = new _hex(i, j);
                }
            }
        }
        var row = rows;
        for (var i = 1; i < cols; i = i + 2) {
            for (var j = i; j < cols; j++) {
                var key = j + "," + row;
                if (!(key in _map)) {
                    _map[key] = new _hex(row, j);
                }
            }
            row = row + 1;
        }
        this.draw();
    }
    HexMap.prototype.draw = function() {
        _svg.select("path").remove();
        var groups = _svg.selectAll("path")
            .data(this.toArray())
            .enter()
            .append("g");
        groups.append("path")
            .attr("row", function(d) { return d.row; })
            .attr("col", function(d) { return d.col; })
            .attr("d", _hexString)
            .attr("transform", _translate)
            .attr("stroke", "black")
            .attr("fill", "none")
            .attr("stroke-width", 3)
            .attr("pointer-events", "visible");
        for (var index in this._traps) {
            groups.append("path")
                .attr("d", traps[index])
                .attr("transform", _translate)
                .attr("stroke", "none")
                .attr("pointer-events", "visible")
                .attr("fill", "none")
                .attr("degree", function (d) { return Math.floor(index * 60 + 30); })
                .on("click", function(d, i) { d.edgeClick.apply(d, [Math.floor(parseInt(this.getAttribute("degree")))]); }); 
        }
        groups.append("path")
            .attr("d", this._innerHex)
            .attr("transform", _translate)
            .attr("stroke", "none")
            .attr("pointer-events", "visible")
            .attr("fill", "none")
            .on("click", function(d, i) { d.click.apply(d); });
    }

    _svg = d3.select(svgSelector);
    _recompute();
    this.draw();
}

var map = null;

document.addEventListener("DOMContentLoaded", function(event) {
    map = new HexMap("#hexmap");
    d3.select("#hexmap").attr("width", 600).attr("height", 600);
    map.buildRect(5, 5);
});
