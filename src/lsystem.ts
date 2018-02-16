import Turtle from './turtle';
import TurtleStack from './turtlestack';
import {vec3, vec4, mat3, mat4, quat} from 'gl-matrix';
import Drawable from './rendering/gl/Drawable';
import {gl} from './globals';

const PI = Math.PI;
const deg2rad = PI / 180.0;


// A class to create an LSystem. This class
// takes the final expanded string from Rule and maps the string to a function (moves the Turtle)

// When the string is fully parsed, call draw to send the final LSystem to a VBO
// Reference: http://interactivepython.org/courselib/static/thinkcspy/Strings/TurtlesandStringsandLSystems.html
class  LSystem extends Drawable
{
    indices: Uint32Array;
    positions: Float32Array;
    normals: Float32Array;
    center: vec4;

    turtleStack: TurtleStack;

    constructor()
    {
        super();
       // this.indices
    }

    create()
    {
        this.indices = new Uint32Array(this.turtleStack.indices);
        this.normals = new Float32Array(this.turtleStack.normals);
        this.positions = new Float32Array(this.turtleStack.positions);

        this.generateIdx();
        this.generatePos();
        this.generateNor();
    
        this.count = this.indices.length;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
    
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufNor);
        gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);
    
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
        gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);
    }

    // Parses the instruction string to tell the turtle how to move
    parseLSystem(ts: TurtleStack, instructions: string, angle: number, distance: number)
    {
        this.turtleStack = ts;
        var t = ts.restore();
        var depth = 0; // refers to number of times we have seen a [ before seeing a ]
        for(var i = 0; i < instructions.length; i++)
        {
            var rule = instructions.charAt(i);
            if(rule === "F")
            {
                t.move("forward", angle, distance);
            } else if (rule === "B")
            {
                t.move("backward", angle, distance);
            } else if (rule === "R") {
                t.move("right", angle, distance);
            } else if (rule === "L") {
                t.move("left", angle, distance);
            } else if (rule === "U") {
                t.move("up", angle, distance);
            } else if (rule === "D") {
                t.move("down", angle, distance);
            } else if (rule === "[") {
                // increment depth, pop turtle off stack and operate on it
                depth++;
                t = ts.restore();
            } else if (rule === "]") {
                // reset depth, push this turtle onto the stack
                depth--;
                ts.save(t);
            }
        }
        // create
        this.create();

    }


}

export default LSystem;