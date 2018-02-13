import {vec3, vec4, mat3, mat4} from 'gl-matrix';
import Stack from "ts-data.stack";
import { transformMat4 } from 'gl-matrix/src/gl-matrix/vec2';

const PI = Math.PI;
const deg2rad = PI / 180.0;
// NEED TO DO npm install ts-data.stack
class  Turtle
{
    pos: vec3 = vec3.create(); // position
    orientation: vec3 = vec3.create(); //rotation
    depth: number = 1; // iteration number
     // create a stack of <vec3, vec3> which are the <position, orientation> pair of the turtle at each [string defininig turtle position] 
    state: [vec3, vec3];
    stack: Stack<[vec3, vec3]>;
    forward: vec3;
    left: vec3;
    up: vec3;

    



    constructor(position: vec3, orient: vec3, iter: number) {
        this.pos = position;
        this.orientation = orient;
        this.depth = iter;
        this.stack = new Stack<[vec3, vec3]>();
        this.state = [position, orient];

        // may need to change these from 660
        this.forward = vec3.fromValues(1.0, 0.0, 0.0);
        this.up = vec3.fromValues(0.0, 0.0, 1.0);
        this.left = vec3.fromValues(0.0, 1.0, 0.0);
    }

    // move the turtle forward a specific length
    moveForward(length: number)
    {
        var scaled = vec3.create();
        vec3.scale(scaled, this.forward, length);
        vec3.add(this.pos, this.pos, scaled);
    }

    rotateUp(degree: number)
    {
        var mat = mat4.fromZRotation(mat, degree * deg2rad);
        var world2local;// = transformMat4()
      //  vec3.


       //vec3.rotateZ(this.up, this.up, vec3.fromValues(0,0,0), degree * deg2rad);
       //vec3.rotateY(this.left, this.left, vec3.fromValues(0,0,0),degree * deg2rad);
       //vec3.rotateX(this.forward, this.forward, vec3.fromValues(0, 0, 0), degree * deg2rad);
    }

    rotateLeft(degree: number)
    {
       // vec3.rotateZ(this.up, this.up, vec3.fromValues(0,0,0), degree * deg2rad);
       // vec3.rotateY(this.left, this.left, vec3.fromValues(0,0,0),degree * deg2rad);
       // vec3.rotateX(this.forward, this.forward, vec3.fromValues(0, 0, 0), degree * deg2rad);
    }



}

export default Turtle;