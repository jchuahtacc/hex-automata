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
        this.redraw();
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
    map.fromJson(map.next(), { "ConwayHex" : ConwayHex });
}

// load button onClick event
function load() {
    // Get the textaera contents, strip all whitespace
    var dump = document.getElementById("json").value.trim().replace(/\s/g, ""); 
    // Parse the text area contents as a Json, provide the Json along with 
    // a constructor dictionary to the fromJson function
    this.map.fromJson(JSON.parse(dump), { "ConwayHex" : ConwayHex }); 
}

// When document finishes loading, initialize the Hex Map
document.addEventListener("DOMContentLoaded", function(event) {
    map = new HexMap("#hexmap");
    map.radius = 40;
    map.edge = 5;
    map.hex = ConwayHex;
    d3.select("#hexmap").attr("width", 600).attr("height", 300);
    map.buildRect(3, 3);
});
