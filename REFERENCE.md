# `hex-automata` Class Documentation

## `Hex` Class

### Functions

### _constructor( [ json ] )_

Class constructor.

_json_ is an object containing any state variables. In the base class, it may contain this Hex's _x_ and _y_ coordinate. Any subclasses should load additional state variables. _constructor_ is called when _fromJson_ is called, with each entry in the JSON object passed to _fromJson_ being sent to the _constructor_ matching that cell's class.

### _click( )_

A mouse click callback. If _HexMap.hexClicks_ is true, any user click on the interior of a Hex will call it's _click()_ method.

### _edgeClick( dx, dy )_

A mouse click callback for the region near each edge of the Hex. If _HexMap.edgeClicks_ is true, any user click near the an edge of a Hex will call the _edgeClick_ function, with parameters _dx_ and _dy_ representing the offset bordering the edge that was clicked. (By default, _HexMap.edgeClicks_ is false, for performance reasons.)

### _renderEdge( dx, dy )_

A rendering callback for the region near each edge of the Hex. If _HexMap.renderEdges_ is true, _renderEdge_ will be called six times - once for each edge of the Hex. Each call will pass the _dx_ and _dy_ offset corresponding to the edge that is being rendered. (By default, _HexMap.renderEdges_ is false, for performance reasons.)

This callback should return HTML `svg` child elements that will render the edge. The region will automatically be rotated and translated so that the origin of the returned elements will coincide with the "leftmost" point of the line segment that represents the corresponding edge. Ascending y values of child elements will be closer to the center of the Hex.

### _renderHex( width, height )_

A rendering callback for the hexagon background. If _HexMap.renderHexes_ is true (which is the default), _renderHex_ will be called on each Hex. The _width_ and _height_ parameters represent the smallest rectangular region that completely encloses the Hex.

This callback should return HTML `svg` child elements that will render the background. The region will automatically be translated to the appropriate _HexMap_ coordinate and clipped to the Hex. Therefore, any pixels of child elements that would render at the "origin" of the background will be clipped, since they will be "above and to the left" of the visible Hex region.

### _draw( )_

Requests a redraw from the _HexMap_ that contains this Hex.

### _dump( )_

A callback that should return an object containing any relevant state data that needs to be loaded, such as when a _constructor_ is called. The base class _dump( )_ method returns an object with _x_, _y_ and _type_ fields, where _type_ represents the name of the Hex's constructor.

_dump( )_ is called in the _HexMap.next( )_ function and the _HexMap.toJson( )_ function

### _next( neighbors )_

A callback that should return a new Hex that will occupy _this_ Hex's coordinate in the next state of the automaton. The _neighbors_ parameter will be an array with _dx_ and _dy_ properties to represent a neighboring Hex's offset, as well as a _hex_ property that contains a reference to the neighboring Hex.