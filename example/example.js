const crowded = 4;
const lonely = 1;

class ConwayHex extends Hex {
    // A constructor that loads from json and sets any member variables
    constructor(json) {
        super(json);
        this.alive = false;
        if (json) {
            this.alive = json.alive;
        }
    }
    
    // Click listener. Toggles the "alive" state and requests a redraw    
    click() {
        this.alive = !this.alive;
        this.draw();
    }

    // An edgeClick listener that prints the offset of the edge
    // and this Hex.
    //
    // To see this example, add edgeClicks : true to the properties
    // initializer object.
    edgeClick(dx, dy) {
        console.log("Edge click, with offset " + dx, "," + dy, this);
    }

    // Serialization to JSON. Dump everything from the parent class
    // and add the "alive" member variable
    dump() {
        var result = super.dump();
        result.alive = this.alive;
        return result;
    }

    // Callback that should return a new cell representing
    // the state of this cell in the next generation
    // 
    // In this example, use Conway-esque rules based on
    // overcrowding or loneliness
    next(neighbors) {
        var neighborCount = 0;
        for (var i in neighbors) {
            // Get hex field of a neighbor entry
            var hex = neighbors[i].hex;
            // Test to see if it's alive
            if (hex instanceof ConwayHex && hex.alive) {
                neighborCount++;
            }
        }
        if (neighborCount <= lonely || neighborCount >= crowded) {
            return new ConwayHex({ alive : false });
        } else {
            return new ConwayHex({ alive : true });
        }
    }

    // Create a large rectangular background. The background is
    // transparent if the cell isn't "alive", and filled with
    // steel blue if the cell is "alive"
    renderHex(width, height) {
        var g = d3.select(document.createElement("g"));
        g.append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("fill", this.alive ? "steelblue" : "none");
        return g.html();
    }

    // Render a rainbow border around the Hexagon
    //
    // To see this example, add renderEdges : true to the properties
    // initializer object.
    renderEdge(dx, dy) {
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
            .attr("width", radius)
            .attr("height", edge)
            .attr("fill", fill);
        return g.html();
    }

 
}

var map = null;

// next button onClick event
//
// Creates the next state with a call to map.next()
// The new state is loaded into the HexMap.
// Additionally, it is output to the HTML textarea.
function next() {
    var nextState = map.next();
    map.fromJson(nextState);
    d3.select("#json").html(JSON.stringify(nextState, null, "\t"));
}

// load button onClick event
function load() {
    // Get the textaera contents, strip all whitespace
    var dump = document.getElementById("json").value.trim().replace(/\s/g, ""); 
    // Parse the text area contents as a Json
    this.map.fromJson(JSON.parse(dump)); 
}

// When document finishes loading, initialize the Hex Map
document.addEventListener("DOMContentLoaded", function(event) {
    const columns = 15;
    const rows = 10;
    const radius = Math.min(document.body.clientWidth * 0.6 / columns / 2, document.body.clientHeight * 1.0 / rows / 2);
    const edge = 5;

    // properties initializer object
    var properties = { 
        radius : radius,
        edge : edge,
        hex : ConwayHex,
        constructors : { "ConwayHex" : ConwayHex }
    };
    map = new HexMap("#hexmap", properties); 
    map.buildRect(columns, rows);
    map.draw();
});
