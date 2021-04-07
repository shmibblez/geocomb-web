const Module = require("../lib/geocomb-web.js");

// console.time("runtime init");

// IMPORTANT: below works when compiled without MODULARIZE=1 flag (works when MODULARIZE=0)

console.log("module below");
console.log(Module.Icosahedron);

function doStuff() {
  Module["onRuntimeInitialized"] = (instance) => {
    // console.timeEnd("runtime init");

    // console.log(Module)

    try {
      const ico = new Module.Icosahedron();

      const lat = 47;
      const lon = 47;
      const res = 777;

      const point = ico.pointFromCoords(lat, lon);
      // console.log(`point:\n  x: ${point.x}\n  y: ${point.y}\n  z: ${point.z}\n`);

      const props = ico.hash(point, res);
      // console.log(
      //   `hash properties:\n  rm: ${props.rm}\n  mo: ${props.mo}\n  res: ${props.res}\n  row: ${props.row}\n  col: ${props.col}`
      // );
      // console.log(props);
      const parsed = ico.parseHash(props);
      // console.log("parsed hash below");
      // console.log(parsed);

      console.log(`hash: e|g|${props.res}|${props.row}|${props.col}`);
    } catch (e) {
      console.error(Module.getExceptionMessage(e));
    }
  };
}

// setTimeout(doStuff, 5000);
doStuff();
