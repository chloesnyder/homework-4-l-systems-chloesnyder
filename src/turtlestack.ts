import Turtle from './turtle';
import {vec3, vec4, mat3, mat4, quat} from 'gl-matrix';

const PI = Math.PI;
const deg2rad = PI / 180.0;


// A stack keeping track of turtle states. Save pushes a turtle onto the stack, restore pops it off the stack
// and keeps track of that turtle's position and direction
class  TurtleStack
{
    stack: Turtle[];

    currPos: vec3;
    currDir: quat;
    currTurtle: Turtle;

   
    save(t: Turtle)
    {
        this.stack.push(t);
    }

    restore() : Turtle
    {
        this.currTurtle = this.stack.pop();
        this.currPos = this.currTurtle.getState()[0];
        this.currDir = this.currTurtle.getState()[1];
        return this.currTurtle;
    }

    getCurrPos() : vec3
    {
        return this.currPos;
    }

    getCurrDir() : quat
    {
        return this.currDir;
    }

    // TODO: draw the lsystem branches
    drawBranch()
    {

    }

    // TODO: draw leaf
    drawLeaf()
    {

    }

}

export default TurtleStack;