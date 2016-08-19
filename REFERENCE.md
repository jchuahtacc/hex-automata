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

### _renderEdge( dx, dy )_ returns String

A rendering callback for the region near each edge of the Hex. If _HexMap.renderEdges_ is true, _renderEdge_ will be called six times - once for each edge of the Hex. Each call will pass the _dx_ and _dy_ offset corresponding to the edge that is being rendered. (By default, _HexMap.renderEdges_ is false, for performance reasons.)

This callback should return HTML `svg` child elements that will render the edge. The region will automatically be rotated and translated so that the origin of the returned elements will coincide with the "leftmost" point of the line segment that represents the corresponding edge. Ascending y values of child elements will be closer to the center of the Hex.

### _renderHex( width, height )_ returns String

A rendering callback for the hexagon background. If _HexMap.renderHexes_ is true (which is the default), _renderHex_ will be called on each Hex. The _width_ and _height_ parameters represent the smallest rectangular region that completely encloses the Hex.

This callback should return HTML `svg` child elements that will render the background. The region will automatically be translated to the appropriate _HexMap_ coordinate and clipped to the Hex. Therefore, any pixels of child elements that would render at the "origin" of the background will be clipped, since they will be "above and to the left" of the visible Hex region.

### _draw( )_

Requests a redraw from the _HexMap_ that contains this Hex.

### _dump( )_ returns Object

A callback that should return an object containing any relevant state data that needs to be loaded, such as when a _constructor_ is called. The base class _dump( )_ method returns an object with _x_, _y_ and _type_ fields, where _type_ represents the name of the Hex's constructor.

_dump( )_ is called in the _HexMap.next( )_ function and the _HexMap.toJson( )_ function

### _next( neighbors )_

A callback that should return a new Hex that will occupy _this_ Hex's coordinate in the next state of the automaton. The _neighbors_ parameter will be an array with _dx_ and _dy_ properties to represent a neighboring Hex's offset, as well as a _hex_ property that contains a reference to the neighboring Hex.

## `HexMap` Class

### _HexMap ( svgSelector, [ properties ] )_

A constructor for _HexMap_. _svgSelector_ should be the DOM selector of the `<svg>` element that will be used for rendering. _properties_ is an optional Object dictionary that can be used to initialize _HexMap_'s properties.

### _HexMap.constructors_

A property containing a dictionary of constructors for Hex subclasses. By providing or setting _HexMap.constructors_, _HexMap_ can instantiate Hex subclasses when loading a _HexMap_ state using _HexMap.fromJson()_. Each entry is a String, constructor pair. The default value is `{ "Hex" : Hex }`. When providing a _constructors_ property during initialization, the `"Hex" : Hex` pair does not need to be provided.

### _HexMap.hex_

A property containing the default constructor to use when creating a Hex topology using _HexMap.buildRect()_. The default constructor is the constructor for the _Hex_ class.

### _HexMap.radius_

A property specifying the radius and segment length (in pixels) of each _Hex_ during rendering. The default value is `60`.

### _HexMap.edge_

A property speciying the edge thickness of _Hex.edgeClick_ mouse click zones, when _HexMap.edgeClicks_ is `true`. The default value is `10`.

### _HexMap.autodraw_

A property that determines if _HexMap.draw()_ should automatically be invoked whenever a property would cause the rendered _HexMap_ to change. For example, when _HexMap.radius_ or _HexMap.edge_ is assigned a new value, _HexMap.draw()_ would be invoked. Large _HexMaps_ can be quite slow to render. Therefore, setting _HexMap.autodraw_ to `false` would allow implementations of `hex-automata` to control when rendering occurs. The default value is `true`.   

### _HexMap.edgeClicks_

A property that determines if the region near each _Hex_ instance's edge should be clickable. Mouse clicks will generate a call to that Hex's _Hex.edgeClick(dx, dy)_ function. The call will be passed _dx_ and _dy_ offsets representing the edge that was clicked. In large _HexMaps_, there can be a significant performance penalty when rendering edge click zones. The default value is `false`.

### _HexMap.hexClicks_

A property that determines if each the interior of each _Hex_ instance should be clickable. Mouse clicks will generate a call to that Hex's _Hex.click()_ function. The default value is `true`.

### _HexMap.renderEdges_

A property that determines if a call to each _Hex_ instance's _Hex.renderEdge( dx, dy )_ function should be made. The _dx_, _dy_ offset representing the edge being rendered will be passed to the _Hex.renderEdge()_. In large _HexMaps_ there can be a significant performance penalty when rendering edges. The default value is `false`.

### _HexMap.renderHexes_

A property that determines if a call to each _Hex_ instance's _Hex.renderHex( width, height )_ function should be made. The _width_ and _height_ parameters are automatically calculated to represent a rectangle that will completely contain the _Hex_. The default is `true`.

### _HexMap.drawGrid_

A property that determines if each _Hex_ instance should render its _Hex_ coordinate and grid axes. This can be useful for debugging purposes. The default value is `false`.

### _HexMap.draw( )_

A function that redraws the `<svg>` element by re-rendering each instance of _Hex_.

### _HexMap.next( )_ returns Object

A function that creates a JSON object representing the next state of this automaton. _HexMap.next( )_ calls each _Hex_ instance's _Hex.next( neighbors )_ function. Each resulting _Hex_ generated has it's _Hex.dump( )_ function called. The object returned has key/value pairs where each key is an _"x,y"_ coordinate and its corresponding _Hex.dump( )_ result. This object can be loaded by passing it to a call of  _HexMap.fromJson( )_. 

### _HexMap.neighbors( x, y )_ returns Hex

A function that returns an array of _Hex_ instances surrounding the provided _x_, _y_ coordinate. Each array entry will be an object with fields _dx_, _dy_ representing the offset of the hex, and a field _hex_ with a reference to the _Hex_ neighbor.

### _HexMap.toArray( )_ return Array of Hex

A function that returns an array of all _Hex_ instances.

### _HexMap.buildRect( width, height )_

A function that initializes the _HexMap_ to a grid of Hexes with _width_ columns and _height_ rows. The rectangle will be visually similar to a rectangle, but the coordinates of each Hex will not follow a traditional orthognal coordinate pattern.

### _HexMap.get( x, y )_ returns Hex

A function that returns the _Hex_ instance at the specified coordinate.

### _HexMap.set( x, y, nullable hex )_

A function that sets the _Hex_ at the specified coordinate. If _hex_ is `null`, the _Hex_ at that coordinate will be deleted. If _HexMap.autodraw_ is true, _HexMap.draw( )_ will be invoked.

### _HexMap.toDegrees( dx, dy )_ returns Integer

A function that returns the degree facing of an edge at the specified _dx_, _dy_ offset. 0 degrees is considered the right vertex of the Hexagon. If _dx_ is 1 and _dy_ is 0, `30` will be returned.

### _HexMap.fromJson( json ) throws Error_

A function that loads the provided _json_, representing the state of a _HexMap_. _json_ must consist of any key, value pairs where the value is an initializer object that will be passed to the _Hex_ class or subclass constructor. The initialzer object must, at a minimum, contain a _Hex_ instance's _x_, _y_ coordinate, a _type_ field that contains a string naming the _Hex_ class or subclass. The initializer object will be passed to the constructor specified in the initializer's _type_ field.
If _HexMap.constructors_ has no property matching the _type_ field, an _Error_ will be thrown. If _HexMap.autodraw_ is true, _HexMap.draw( )_ will be invoked.

### _HexMap.toJson( )_ returns Object

A function that returns a _json_, where each key is an _"x,y"_ string of a coordinate, and each associated value is the object returned by _Hex.dump()_. The returned object can be loaded by passing it to  _HexMap.fromJson_.
