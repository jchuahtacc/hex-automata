// Hex.js
//
// ECMAScript 6

// Hexes
//
// The hex coordinate system uses a skewed x, y coordinates, where increasing whole values of y are
// visually are below the previous value of y, and increasing values of x are above and to the right
// of the previous value of x.
class Hex {
    constructor() {
    }

    // Callback when the interior of a hexagon is clicked
    click() {
        console.log("click", this);
    }

    // Callback when the edge of a hexagon is clicked
    // dx and dy represent the offset of the hex bordering
    // the edge that was clicked
    edgeClick(dx, dy) {
        console.log("edge click " + dx +"," + dy, this);
    }

    // A callback that returns the HTML of svg elements representing a hex edge.
    // dx and dy are the offset representing the edge being rendered.
    // For example, if dx and dy are both 1, the lower right edge is being rendered
    // width represents the width of a hex edge
    // height represents the height of a hex edge
    renderEdge(dx, dy, width, height) {
        var g = d3.select(document.createElement("g"));
        var pair = dx + "," + dy;
        var fill = "";
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

    // A callback that returns the HTML of svg elements representing the hexagon body
    // The HTML of the region returned will be rendered as a rectangle, with a
    // width = radius * 2 and height = radius * Math.sqrt(3)
    // The resulting group will be rendered and clipped to the surrounding hexagon
    renderHex(radius) {
        var g = d3.select(document.createElement("g"));
        g.append("rect")
            .attr("width", radius * 2)
            .attr("height", radius * Math.sqrt(3))
            .attr("fill", "steelblue");
        return g.html();
    }
    
    // Asks the map containing this hex to redraw it
    redraw() {
        if (this.map) {
            this.map.draw();
        }
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
    var _trapezoid = "";
    var _innerHex = "";
    var _svg = null;
    var _hex = Hex;

    // Build outside hex path
    function _buildHexString() {
        var height = _radius / 2 * Math.sqrt(3);
        var halfRad = _radius / 2;
        return "M " + -halfRad + " " + -height + " L " + halfRad + " " + -height + " L " + _radius + " 0 " + " L " + halfRad + " " + height + " L " + -halfRad + " " + height + " L " + -_radius + " 0 Z"; 
    }

    // Build translation for a hex from hex coordinate to screen position
    function _translate(d) {
        var translate = "translate(" + Math.floor(d.x * _dColX + _offsetX) + " " + Math.floor(d.y * _dRow + d.x * _dColY + _offsetY) + ")";
        return translate;
    }

    // Build trapezoid path for edge click detection
    function _makeTrapezoid() {
        return "M 0 " + _edge + " L " + Math.floor(_edge / 2.2) + " 0 L " + Math.floor(_radius - _edge / 2.2) + " 0 L " + _radius + " " + _edge + " Z "; 
    }

    // Build inside hex path for center click detection
    function _makeInnerHex() {
        var rad = _radius - _edge;
        var string = "M " + rad + " 0 ";
        for (var deg = 60; deg < 360; deg = deg + 60) {
            string += "L " + Math.floor(Math.cos(deg * Math.PI / 180) * rad) + " " + Math.floor(Math.sin(deg * Math.PI / 180) * -rad) + " ";
        }
        string += "Z";
        return string;
    }

    // Force recomputation of constants, upon edge or radius changes
    function _recompute() {
        _dRow = _radius * Math.sqrt(3);
        _dColX = _radius * 1.5;
        _dColY = -_radius / 2 * Math.sqrt(3);
        _offsetX = _radius;
        _offsetY = _radius / 2 * Math.sqrt(3);
        _hexString = _buildHexString();
        _trapezoid = _makeTrapezoid();
        _innerHex = _makeInnerHex();
    }

    // radius property, radius or edge length of hexagon
    Object.defineProperty(HexMap.prototype, 'radius', {
        get : function() { return _radius; },
        set : function(val) { _radius = val; _recompute(); this.draw(); }
    });

    // edge property, interior width of hexagon for click detection or edge rendering
    Object.defineProperty(HexMap.prototype, 'edge', {
        get : function() { return _edge; },
        set : function(val) { _edge = val; _recompute(); this.draw(); }
    });

    // hex property, prototype of hexes for building new hex maps
    Object.defineProperty(HexMap.prototype, 'hex', {
        get : function() { return _hex; },
        set : function(val) { _hex = val; _recompute(); this.draw(); }
    });

    // Returns an array of neighboring cells
    // Each array element is an object with fields "dx" and "dy" representing
    // the offset of the neighbor and field "hex" containing the neighbor
    HexMap.prototype.neighbors = function(x, y) {
        var result = [];
        for (var i in _offsets) {
            var hex = this.get(_offsets[i].dx, _offsets[i].dy);
            if (hex) {
                result.push({ dx : _offsets[i].dx, dy : _offsets[i].dy, hex : hex});
            }
        }
        return result;
    }

    // Returns an array of all hexes
    HexMap.prototype.toArray = function() {
        var hexes = [ ];
        for (var key in _map) {
            hexes.push(_map[key]);
        }
        return hexes;
    }

    // Initializes a rectangular configuration for the hex map, using the specified hex prototype
    HexMap.prototype.buildRect = function(width, height) {
        for (var i = 0; i < height; i++) {
            for (var j = 0; j < (i + 1) * 2 - 1 && j < width; j++) {
                this.set(j, i, new _hex());
            }
        }
        var y = height;
        for (var i = 1; i < width; i = i + 2) {
            for (var j = i; j < width; j++) {
                this.set(j, y, new _hex());
            }
            y = y + 1;
        }
        this.draw();
    }
    
    // Returns a hex in the map, or undefined if an invalid coordinate was specified
    HexMap.prototype.get = function(x, y) {
        var key = x + "," + y;
        if (key in _map) {
            return _map[key];
        } else {
            return undefined;
        }
    }

    // Sets a map cell to the given hex
    HexMap.prototype.set = function(x, y, hex) {
        var key = x + "," + y;
        if (hex) {
            hex.x = x;
            hex.y = y;
            hex.map = this;
            _map[key] = hex;
        } else {
            console.log("deleted!");
            delete _map[key];
        }
        this.draw();
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

    // Given an offset, returns the degree facing of the offset
    // For example, if dx is 1 and dy is 0, 30 degrees is returned
    HexMap.prototype.offsetToDegrees = function(dx, dy) {
        return _offsetDict[dx + ","+ dy];
    }

    HexMap.prototype.toJson = function() {
        var result = JSON.parse(JSON.stringify(_map));
        for (var cell in result) {
            delete result[cell].map;
            result[cell].type = _map[cell].constructor.name;
        }
        return result;
    }

    // Re-renders the SVG of the hex map
    HexMap.prototype.draw = function() {
         //Clear previous svg elements
        _svg.select("defs").remove();
        _svg.append("defs")
            .append("clipPath")
            .attr("id", "hexPath")
            .append("path")
            .attr("d", _hexString);

        // Create data binding 
        var dataSelect = _svg.selectAll("g")
            .data(this.toArray(), function(d) { return d; });

        // On new data element, create a group representing the hex
        // and merge it
        dataSelect
            .enter()
            .append("g")
            .attr("x", function(d) { return d.x; })
            .attr("y", function(d) { return d.y; })
            .attr("transform", _translate)
            .attr("clip-path", "url(#hexPath)")
            .append("path")
            .attr("d", _hexString)
            .attr("stroke", "black")
            .attr("fill", "none")
            .attr("stroke-width", 3)
            .attr("pointer-events", "visible")
            .merge(dataSelect);

        // If data is missing, remove the associated element
        dataSelect.exit().remove();

        // Take all the groups are currently in the HexMap and decorate them...
        var groups = _svg.selectAll("g");

        // Render hexagon background
        groups.append("g")
            .attr("transform", "translate(" + -_radius + " " + Math.floor(-_radius / 2 * Math.sqrt(3)) + " ) ")
            .html(function(d) { return d.renderHex(_radius); });

        // Render Hex edges
        for (var i in _offsets) {
            groups.append("g")
                .attr("transform", "rotate(" + Math.floor(-1 * (90 + this.offsetToDegrees(_offsets[i].dx, _offsets[i].dy))) + ") translate(" + -_radius / 2 + " " + -_dColY + ") translate(0 " + -_edge + ")")
                .attr("dx", _offsets[i].dx)
                .attr("dy", _offsets[i].dy)
                .html(function(d) { return d.renderEdge(parseInt(this.getAttribute("dx")), parseInt(this.getAttribute("dy")), _radius, _edge); });
        }

        // Render click listener group
        var clickGroup = groups.append("g");

        // Render edge click regions
        for (var i in _offsets) {
            clickGroup.append("path")
                .attr("blah", "blah")
                .attr("d", _trapezoid)
                .attr("transform", "rotate(" + Math.floor(-1 * (90 + this.offsetToDegrees(_offsets[i].dx, _offsets[i].dy))) + ") translate(" + -_radius / 2 + " " + -_dColY + ") translate(0 " + -_edge + ")")
                .attr("fill", "none")
                .attr("dx", _offsets[i].dx)
                .attr("dy", _offsets[i].dy)
                .attr("pointer-events", "visible")
                .on("click", function(d, i) { d.edgeClick( parseInt(this.getAttribute("dx")), parseInt(this.getAttribute("dy")) ); });
        }

        // Render inside hex click region
        clickGroup.append("path")
            .attr("d", _innerHex)
            .attr("stroke", "none")
            .attr("pointer-events", "visible")
            .attr("fill", "none")
            .on("click", function(d, i) { d.click.apply(d); });
           
    }

    _svg = d3.select(svgSelector);
    _recompute();
    this.draw();
}
