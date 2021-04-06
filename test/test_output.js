const Module = require("../lib/geocomb-web.js");

Module["onRuntimeInitialized"] = (instance) => {
  console.log("runtime initialized, instance below");
  console.log(instance);
  console.log("runtime initialized, Module below");
  console.log(Module);
  console.log("Module.Icosahedron below");
  const ico = new Module.Icosahedron(
    Module.MapOrientation.ECEF,
    Module.RotationMethod.gnomonic
  );
  console.log(ico.pointFromCoords(75, 75));
};
