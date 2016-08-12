
function test() {
    var chart = d3.select(".chart").attr("width", 600).attr("height", 600);
    var hexbin = d3.hexbin().size([600, 600]).radius(20);
    chart.append("path").attr("d", function(d) { console.log("hello"); return "M300,300" + hexbin.hexagon(); });
}

document.addEventListener("DOMContentLoaded", function(event) {
    test();
});
