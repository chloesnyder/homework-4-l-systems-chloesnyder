import Turtle from './turtle';
import {vec3, vec4, mat3, mat4, quat} from 'gl-matrix';
import Square from './geometry/Square';

const PI = Math.PI;
const deg2rad = PI / 180.0;


// A stack keeping track of turtle states. Save pushes a turtle onto the stack, restore pops it off the stack
// and keeps track of that turtle's position and direction
// every time you see F, put a cylinder in

class  TurtleStack
{
    stack: Turtle[];

    currPos: vec4;
    currDir: vec4;
    currTurtle: Turtle;

    indices: Uint32Array;
    positions: Float32Array;
    normals: Float32Array;
    center: vec4;

    constructor()
    {
       // Instantiate stack with 1 turtle at the origin, moving straight up the Y axis
        this.currPos = vec4.fromValues(0.0, 0.0, 0.0, 1.0);
        this.currDir = vec4.fromValues(0.0, 1.0, 0.0, 0.0);
        this.currTurtle = new Turtle(this.currPos, 0); 
        this.stack = [];

        this.indices = new Uint32Array(0);
        this.positions = new Float32Array(0);
        this.normals = new Float32Array(0);

    }
   
    save(t: Turtle)
    {
        this.stack.push(t);
        console.log("jesus saves");
    }

    restore() : Turtle
    {
        this.currTurtle = this.stack.pop();
        this.currPos = this.currTurtle.state[0];
        this.currDir = this.currTurtle.state[1];
        this.drawBranch(); // store turtle VBOs in global VBO list
        console.log("restore");
        return this.currTurtle;
    }

    getCurrPos() : vec4
    {
        return this.currPos;
    }

    getCurrDir() : vec4
    {
        return this.currDir;
    }

    // TODO: draw the lsystem branches
    // Doesn't actually "draw" the cylinder, just moves it to the right place for the final VBO to draw all at once
    drawBranch()
    {
        // for now, representing with a square
        var currBranch = new Square(vec3.fromValues(this.currPos[0], this.currPos[1], this.currPos[2])); // update this to be an obj that takes in position, rotation, 
      //  currBranch.create();

        // append this branch's indices to the global index array
        var a_indices = this.indices;
        var b_indices = currBranch.indices;
        var c_indices = new Uint32Array(a_indices.length + b_indices.length);
        c_indices.set(a_indices);
        c_indices.set(b_indices, a_indices.length);
        this.indices = c_indices;

        // append this branch's positions to the global index array
        var a_pos = this.positions;
        var b_pos = currBranch.positions;
        var c_pos = new Float32Array(a_pos.length + b_pos.length);
        c_pos.set(a_pos);
        c_pos.set(b_pos, a_pos.length);
        this.positions = c_pos;

        // append this branch's normals to the global index array
        var a_norm = this.normals;
        var b_norm = currBranch.normals;
        var c_norm = new Float32Array(a_norm.length + b_norm.length);
        c_norm.set(a_norm);
        c_norm.set(b_norm, a_norm.length);
        this.normals = c_norm;

       // currBranch.destory();
        console.log("drew a branch");

    }

    // TODO: draw leaf
    // Doesn't actually "draw" the leaf, just moves it to the right place for the final VBO to draw all at once
    drawLeaf()
    {

    }

}

export default TurtleStack;