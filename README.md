# geocomb-web

welcome to geocomb-web, this project is a wrapper around geocomb-cpp so it can be used from web browsers or any platform that can run WebAssembly. It can convert locations to uniquiely identifiable hexagons for given resolutions, and vice versa.

## how it works
geocomb generates points on the geocomb grid, which depends on 3 things: resolution, map orientation, and rotation method. The geocomb grid is broken up into rows and columns.

The points on a geocomb grid (`GPoint3`) store resolution, row, and column.

Based on some pretty nice relationships, hexagons/pentagons (phex, phexes) can be generated from points on a geocomb grid based on point row and col numbers, and this is how locations are stored: given a point, geocomb finds the phex that contains it for a given resolution, map orientation, and rotation method, and returns the `HashProperties` of that phex. `HashProperties` pretty much just contains info about a phex's center point, from which a phex or point can later be generated.

This means that geocomb can be used to store locations with hexagons, instead of traditional methods like geohashing which depend on rectangles. An other benefit is hexagons closely approximate circles, which can come in handy for findng locations within a certain distance from other locations (burger restaurants within 5 km or something like that)

Aside from this, `emscripten` is awesome, it allows easy binding of c++ code to javascript, and geocomb-web probably wouldn't exist without it. If you're planning on using it make sure to read the docs...let's just say it was a long day

## install

`npm install geocomb-web --save`

# usage

## Phase 1: convert coordinates to hash properties

### 1. import

```
import { HashProperties, Icosahedron, Point3, GPoint3 } from "geocomb";
```

or

```
const geocomb = require("geocomb");
const Icosahedron = geocomb.Icosahedron;
const Point3 = geocomb.Point3;
const GPoint3 = geocomb.GPoint3;
const HashProperties = geocomb.HashProperties;
```

### 2. create Icosahedron object
```
// ┏→ map orientation (default is "ECEF")
// ┃ rotation method (default is "gnomonic") ←┓
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓     ┗━━━┓
const ico = await Icosahedron.onReady("ECEF", "gnomonic");
```
you may be wondering "hold on, `await` to create an object?", and that's the thing, since geocomb-web depends on WebAssembly, it needs to do some setup in order to run code. Make sure to either `await` here, or make sure `Icosahedron.isReady` returns true before using anything from this package. `Icosahedron` & other classes depend on some stuff that's loaded along with the runtime.

### 3. create point from coordinates
```
const lat = 71; // latitude  (must be in range [-90, 90])
const lon = 27; // longitude (must be in range [-180, 180])
const point = ico.pointFromCoords(lat, lon);
```

### 4. get geocomb hash properties for point (specifies hexagon location on geocomb grid for resolution)

```
const props = ico.hash(point, res);
```

hash properties store:
- rm - rotation mathod
- mo - map orientation
- res - resolution
- row - phex row
- col - phex column

### 5. figure out way to store hash properties (sorry for this one lol)
geocomb doesn't have a default hash encoder/decoder yet

## Phase 2: convert hash properties back to coordinates

### 1. convert however you store hash properties to hash properties obj
you're on your own here, but it'll probably look something like this:

```
const props = functionThatConvertsObjToHashProperties(yourObj);
```

whatever is inside that function is your secret sauce

### 2. re-create icosahedron
in order to parse a hash, you need an icosahedron so, once again:

```
const ico = new Icosahedron("ECEF", "gnomonic");
```

Note: icosahedron `map orientation` and `rotation method` will override hash property `map orientation` and `rotation method`. This will most likely be fixed in an upcoming update, but for now just make sure to be consistent.

### 3. parse hash
```
const parsedPoint = ico.parseHash(props);
```

### 4. celebrate
that's pretty much it for storing and recovering locations. The returned point, `parsedPoint`, is a phex center for the given resolution.

# what's next?
ok, now that we've got a native (c++) and web version of geocomb, now all that's left is to make a dart/flutter package that allows running this baby on all platforms. Will probably use dart::ffi for android & ios, and try to hook up to web somehow since it doesn't support dart::ffi yet. Coming soon to package managers near you...(most likely)