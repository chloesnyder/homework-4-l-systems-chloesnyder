import {vec3, vec4} from 'gl-matrix';
import Drawable from '../rendering/gl/Drawable';
import {gl} from '../globals';
import * as fs from 'fs';
var OBJ = require('webgl-obj-loader');

class Mesh extends Drawable {
  indices: Uint32Array;
  positions: Float32Array;
  normals: Float32Array;
  center: vec4;

  constructor(center: vec3) {
    super(); // Call the constructor of the super class. This is required.
    this.center = vec4.fromValues(center[0], center[1], center[2], 1);
  }

  // Convert from vec3 to vec4, insert a 1 in the w position
  padMeshPos(positions : any) : Float32Array
  {
    var tempBufPos = new Array();
    for(var i = 0; i < positions.length; i++)
    {
      tempBufPos.push(positions[i]);
      if((i + 1) % 3 == 0)
      {
        tempBufPos.push(1.0);
      }
    }
    console.log(new Float32Array(tempBufPos));
    return new Float32Array(tempBufPos);
  }

  // convert from vec3 to vec4, insert a 0 in w postion
  padMeshNor(normals : any) : Float32Array
  {
    var tempBufNor = new Array();
    for(var i = 0; i < normals.length; i++)
    {
      tempBufNor.push(normals[i]);
      if((i + 1) % 3 == 0)
      {
        tempBufNor.push(0.0);
      }
    }
    console.log(new Float32Array(tempBufNor));
    return new Float32Array(tempBufNor);
  }

  createMeshFromObjectString(obj:string) {

   // console.log(obj);
    var mesh = new OBJ.Mesh(obj);
    OBJ.initMeshBuffers(gl, mesh);

    this.generateIdx();
    this.generatePos();
    this.generateNor();

    this.count = mesh.indices.length;  
    console.log(this.count);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
    console.log(new Uint32Array(mesh.indices));
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(mesh.indices), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufNor);
    gl.bufferData(gl.ARRAY_BUFFER, this.padMeshNor(mesh.vertexNormals), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
    gl.bufferData(gl.ARRAY_BUFFER, this.padMeshPos(mesh.vertices), gl.STATIC_DRAW);

    console.log(`Created mesh`);
  }

  create(){}
};

export default Mesh;