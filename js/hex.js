// Hex.js
//
// ECMAScript 6

// Hexes
//
// The hex coordinate system uses a skewed x, y coordinates, where increasing whole values of y are
// visually are below the previous value of y, and increasing values of x are above and to the right
// of the previous value of x.
class Hex {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    click() {
        console.log("click", this);
    }

    edgeClick(degree) {
        console.log(degree + " degree click", this);
    }

    // A callback that returns the HTML of svg elements representing a hex edge.
    // dx and dy are the offset representing the edge being rendered.
    // For example, if dx and dy are both 1, the lower right edge is being rendered
    // width represents the width of a hex edge
    // height represents the height of a hex edge
    renderEdge(dx, dy, width, height) {
        var g = d3.select(document.createElement("g"));
        var fill = "steelblue";
        var pair = dx + "," + dy;
        switch(pair) {
            case "1,0" : fill = "red"; break;
            case "0,-1" : fill = "orange"; break;
            case "-1,-1" : fill = "yellow"; break;
            case "-1,0" : fill = "green"; break;
            case "0,1" : fill = "blue"; break;
            case "1,1" : fill = "purple"; break;
        }
        g.append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("fill", fill);
        return g.html();
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
        var translate = "translate(" + Math.floor(d.x * _dColX + _offsetX) + " " + Math.floor(d.y * _dRow + d.x * _dColY + _offsetY) + ")";
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

    HexMap.prototype.buildRect = function(width, height) {
        for (var i = 0; i < height; i++) {
            for (var j = 0; j < (i + 1) * 2 - 1 && j < width; j++) {
                var key = j + "," + i;
                if (!(key in _map)) {
                    _map[key] = new _hex(j, i);
                }
            }
        }
        var y = height;
        for (var i = 1; i < width; i = i + 2) {
            for (var j = i; j < width; j++) {
                var key = j + "," + y;
                if (!(key in _map)) {
                    _map[key] = new _hex(j, y);
                }
            }
            y = y + 1;
        }
        this.draw();
    }
    
    HexMap.prototype.get = function(x, y) {
        var key = x + "," + y;
        if (key in _map) {
            return _map[key];
        } else {
            return undefined;
        }
    }

    HexMap.prototype.set = function(x, y, hex) {
        var key = x + "," + y;
        _map[key] = hex;
    }

    var _offsetDict = { 
        "1,0" : 30,
        "0,-1" : 90,
        "-1,-1" : 150,
        "-1,0" : 210,
        "0,1" : 270,
        "1,1" : 330
    };

    var _offsets = [ { dx : 1, dy : 0 }, { dx : 0, dy : -1 }, { dx : -1, dy : -1 }, { dx : -1, dy: 0 }, { dx : 0, dy : 1 }, { dx : 1, dy : 1 }];

    HexMap.prototype.offsetToDegrees = function(dx, dy) {
        return _offsetDict[dx + ","+ dy];
    }

    HexMap.prototype.draw = function() {
        _svg.select("path").remove();
        var groups = _svg.selectAll("path")
            .data(this.toArray())
            .enter()
            .append("g")
        groups.attr("transform", _translate);
        groups.append("path")
            .attr("x", function(d) { return d.x; })
            .attr("y", function(d) { return d.y; })
            .attr("d", _hexString)
            .attr("stroke", "black")
            .attr("fill", "none")
            .attr("stroke-width", 3)
            .attr("pointer-events", "visible");
        for (var index in this._traps) {
            groups.append("path")
                .attr("d", traps[index])
                .attr("stroke", "none")
                .attr("pointer-events", "visible")
                .attr("fill", "none")
                .attr("degree", function (d) { return Math.floor(index * 60 + 30); })
                .on("click", function(d, i) { d.edgeClick.apply(d, [Math.floor(parseInt(this.getAttribute("degree")))]); }); 
        }


        for (var i in _offsets) {
            groups.append("g")
                .attr("transform", "rotate(" + Math.floor(-1 * (90 + this.offsetToDegrees(_offsets[i].dx, _offsets[i].dy))) + ") translate(" + -_radius / 2 + " " + -_dColY + ") translate(0 " + -_edge + ")")
                .html(function(d) { return d.renderEdge(_offsets[i].dx, _offsets[i].dy, _radius, _edge); });
        }

        groups.append("path")
            .attr("d", this._innerHex)
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
    var hex = map.get(1, 1);
});
