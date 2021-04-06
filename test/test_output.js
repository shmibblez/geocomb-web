const Module = require("../lib/geocomb-web.js");

Module["onRuntimeInitialized"] = (instance) => {
  console.log("Module.Icosahedron below");
  const ico = new Module.Icosahedron(
    Module.MapOrientation.ECEF,
    Module.RotationMethod.gnomonic
  );
  const point = ico.pointFromCoords(75, 75);
  console.log("point below");
  console.log(point);
  point.x = 9;
  const props = ico.hash(point, 7);
  console.log("hash properties below");
  console.log(props);
  const parsed = ico.parseHash(props);
  console.log("parsed hash below");
  console.log(parsed);
};
