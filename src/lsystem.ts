import Turtle from './turtle';
import TurtleStack from './turtlestack';
import {vec3, vec4, mat3, mat4, quat} from 'gl-matrix';

const PI = Math.PI;
const deg2rad = PI / 180.0;


// A class to create an LSystem. This class
// takes the final expanded string from Rule and maps the string to a function (moves the Turtle)

// When the string is fully parsed, call draw to send the final LSystem to a VBO
// Reference: http://interactivepython.org/courselib/static/thinkcspy/Strings/TurtlesandStringsandLSystems.html
class  LSystem
{
    constructor()
    {
        
    }

    draw()
    {

    }

    // Parses the instruction string to tell the turtle how to move
    parseLSystem(ts: TurtleStack, instructions: string, angle: number, distance: number)
    {
        var t = new Turtle(vec3.fromValues(0.0, 0.0, 0.0), 0); // initially start turtle at position 0
        ts.save(t);
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

        // draw when done parsing
        this.draw();

    }


}

export default LSystem;