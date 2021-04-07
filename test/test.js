const geocomb = require("../lib/index.js");
const Icosahedron = geocomb.Icosahedron;
const HashProperties = geocomb.HashProperties;

async function doStuff() {
  console.log("Icosahedron.isReady(): " + Icosahedron.isReady);

  const ico = await Icosahedron.onReady("ECEF", "gnomonic");
  console.log("awaited icosahedron, obj: " + ico);

  console.log("Icosahedron.isReady: " + Icosahedron.isReady);

  const lat = 47;
  const lon = 47;
  const res = 777;
  const point = ico.pointFromCoords(lat, lon);
  console.log("created point, point below");
  console.log(point);

  let props = ico.hash(point, res);
  console.log("props below");
  console.log(props);

  // just checking if still works with emscripten
  props = new HashProperties(
    props.res,
    props.row,
    props.col,
    "ECEF",
    "gnomonic"
  );

  console.log("props after reset below");
  console.log(props);
  console.log(`props.mo: ${props.mo}, props.rm: ${props.rm}`);

  const parsed = ico.parseHash(props);
  console.log(
    `parsed point:\n  x: ${parsed.x}\n  y: ${parsed.y}\n  z: ${parsed.z}\n  row: ${parsed.row}\n  col: ${parsed.col}`
  );
  console.log(parsed);
}

doStuff();
