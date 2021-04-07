var M = require("../lib/geocomb-web.js");

/**
 * map orientation, changes where hexagons are placed
 * - ECEF (default): standard way of doing stuff, still pretty good
 * - dymaxion: good for icosahedron, there are no vertices on land, which means no pentagons
 * - NOTE: only ECEF is supported for hash generation
 */
export type MapOrientation = "dymaxion" | "ECEF";
/**
 * rotation method, changes how point coordinates are generated
 * - gnomonic (default): phex areas are smaller towards vertices, but phexes are more symmetrical
 * - quaternion: phex areas are more uniform, but phexes get distorted a bit more
 * - NOTE: only gnomonic is supported for hash generation
 */
export type RotationMethod = "gnomonic" | "quaternion";
/**
 * hash properties, stores point row & col for res on geocomb grid
 */
export class HashProperties {
  res!: number;
  row!: number;
  col!: number;
  private _mo;
  private _rm;

  get mo(): MapOrientation {
    return this._mo == M.MapOrientation.dymaxion ? "dymaxion" : "ECEF";
  }

  get rm(): RotationMethod {
    return this._rm == M.RotationMethod.quaternion ? "quaternion" : "gnomonic";
  }

  constructor(
    res: number,
    row: number,
    col: number,
    mo: MapOrientation | any,
    rm: RotationMethod | any
  ) {
    // rm and mo can be either strings, or emscripten enum types
    this.res = res;
    this.row = row;
    this.col = col;
    // need to check if ready for MO & RM enums
    if (!Icosahedron.isReady) {
      throw new Error("runtime not ready yet (geocomb-web)");
    }
    if (typeof mo == "string") {
      this._mo =
        mo === "dymaxion" ? M.MapOrientation.dymaxion : M.MapOrientation.ECEF;
    } else {
      this._mo =
        mo == M.MapOrientation.dymaxion
          ? M.MapOrientation.dymaxion
          : M.MapOrientation.ECEF;
    }
    if (typeof rm == "string") {
      this._rm =
        rm === "quaternion"
          ? M.RotationMethod.quaternion
          : M.RotationMethod.gnomonic;
    } else {
      this._rm =
        rm == M.RotationMethod.quaternion
          ? M.RotationMethod.quaternion
          : M.RotationMethod.gnomonic;
    }
  }
}

/**
 * Icosahedron class, used for hash generation
 */
export class Icosahedron {
  private _ico; // M.Icosahedron instance
  private _mo;
  private _rm;

  get mo(): MapOrientation {
    return this._mo == M.MapOrientation.dymaxion ? "dymaxion" : "ECEF";
  }

  get rm(): RotationMethod {
    return this._rm == M.RotationMethod.quaternion ? "quaternion" : "gnomonic";
  }

  /**
   * since geocomb-web runs on WebAssembly, need to wait for it to be ready
   * @returns whether runtime is ready for geocomb-web
   */
  static get isReady(): boolean {
    return !!M.Icosahedron;
  }

  /**
   * Icosahedron constructor
   * @param mapOrientation Icosahedron orientation on globe map
   * @param rotationMethod technique to use to rotate points
   */
  constructor(
    mapOrientation: MapOrientation = "ECEF",
    rotationMethod: RotationMethod = "gnomonic"
  ) {
    if (!Icosahedron.isReady) {
      throw new Error("runtime not ready yet (geocomb-web)");
    }

    this._mo =
      mapOrientation === "dymaxion"
        ? M.MapOrientation.dymaxion
        : M.MapOrientation.ECEF;
    this._rm =
      rotationMethod == "quaternion"
        ? M.RotationMethod.quaternion
        : M.RotationMethod.gnomonic;
    this._ico = new M.Icosahedron(this._mo, this._rm);
  }

  /**
   *
   * @param mapOrientation Icosahedron orientation on globe map
   * @param rotationMethod technique to use to rotate points
   * @returns Promise that resolves with new Icosahedron instance
   */
  static async onReady(
    mapOrientation: MapOrientation = "ECEF",
    rotationMethod: RotationMethod = "gnomonic"
  ): Promise<Icosahedron> {
    if (Icosahedron.isReady) {
      return new Icosahedron(mapOrientation, rotationMethod);
    } else {
      return M().then((instance: any) => {
        // bit hacky but library doesnt do anything too complicated, should be ok
        M = instance;
        return new Icosahedron(mapOrientation, rotationMethod);
      });
    }
  }

  /**
   * generates point on globe, for use with Icosahedron#hash()
   * @param lat point latitude
   * @param lon point longitude
   * @retunrs Point3
   */
  pointFromCoords(lat: number, lon: number): Point3 {
    return this._ico.pointFromCoords(lat, lon);
  }
  /**
   * generates hash for point
   * @param point point to hash
   * @param res geocomb grid resolution
   * @returns HashProperties for point on geocomb grid
   */
  hash(point: Point3, res: number): HashProperties {
    return this._ico.hash(point, res);
  }

  /**
   * parses hash, returning GPoint3 that's also phex center
   * @throws errors if invalid rotation methods or row or col numbers are provided
   * @param props hash properties
   * @returns GPoint3 that's also a phex center
   */
  parseHash(props: HashProperties): GPoint3 {
    const mo =
      props.mo === "dymaxion"
        ? M.MapOrientation.dymaxion
        : M.MapOrientation.ECEF;
    const rm =
      props.rm == "quaternion"
        ? M.RotationMethod.quaternion
        : M.RotationMethod.gnomonic;
    return this._ico.parseHash({
      res: props.res,
      row: props.row,
      col: props.col,
      mo: mo,
      rm: rm,
    });
  }
}

/**
 * Point class, used for storing locations
 */
export class Point3 {
  x: number;
  y: number;
  z: number;
  triNum: number;
  isPC: boolean;

  /**
   * Point3 constructor
   * @param x point's x coordinate
   * @param y point's y coordinate
   * @param z point's z coordinate
   */
  constructor(x: number, y: number, z: number, triNum = -1, isPC = false) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.triNum = triNum;
    this.isPC = isPC;
  }
}

/**
 * GPoint3 class, generated by Icosahedron, additionally stores row and col on geocomb grid for res
 */
export class GPoint3 extends Point3 {
  row!: number;
  col!: number;
  res!: number;

  private _mo;
  private _rm;

  get mo(): MapOrientation {
    return this._mo == M.MapOrientation.dymaxion ? "dymaxion" : "ECEF";
  }

  get rm(): RotationMethod {
    return this._rm == M.RotationMethod.quaternion ? "quaternion" : "gnomonic";
  }

  // side-note: pretty much same as HashProperties, only difference is super call for x,y,z coords
  /**
   *
   * @param x
   * @param y
   * @param z
   * @param res
   * @param row
   * @param col
   * @param mo
   * @param rm
   * @param triNum
   * @param isPC
   */
  constructor(
    x: number,
    y: number,
    z: number,
    res: number,
    row: number,
    col: number,
    mo: MapOrientation | any,
    rm: RotationMethod | any,
    triNum = -1,
    isPC = false
  ) {
    super(x, y, z, triNum, isPC);
    // rm and mo can be either strings, or emscripten enum types
    this.res = res;
    this.row = row;
    this.col = col;
    // need to check if ready for MO & RM enums
    if (!Icosahedron.isReady) {
      throw new Error("runtime not ready yet (geocomb-web)");
    }
    if (typeof mo == "string") {
      this._mo =
        mo === "dymaxion" ? M.MapOrientation.dymaxion : M.MapOrientation.ECEF;
    } else {
      this._mo =
        mo == M.MapOrientation.dymaxion
          ? M.MapOrientation.dymaxion
          : M.MapOrientation.ECEF;
    }
    if (typeof rm == "string") {
      this._rm =
        rm === "quaternion"
          ? M.RotationMethod.quaternion
          : M.RotationMethod.gnomonic;
    } else {
      this._rm =
        rm == M.RotationMethod.quaternion
          ? M.RotationMethod.quaternion
          : M.RotationMethod.gnomonic;
    }
  }
}
