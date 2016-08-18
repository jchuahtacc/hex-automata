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

    // Serialization to JSON. Dump everything from the parent class
    // and add the "alive" member variable
    dump() {
        var result = super.dump();
        result.alive = this.alive;
        return result;
    }

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

// dump button onClick event
function dump() {
    d3.select("#json").html(JSON.stringify(map.toJson()));
}

function next() {
    map.fromJson(map.next());
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
    map = new HexMap("#hexmap", { radius : 40, edge: 5, constructors : { "ConwayHex" : ConwayHex } });
    map.hex = ConwayHex;
    d3.select("#hexmap").attr("width", 600).attr("height", 300);
    map.buildRect(3, 3);
    map.draw();
});
