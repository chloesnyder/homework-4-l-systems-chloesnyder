import Turtle from './turtle';
import {vec3, vec4, mat3, mat4, quat} from 'gl-matrix';

const PI = Math.PI;
const deg2rad = PI / 180.0;


// A stack keeping track of turtle states. Save pushes a turtle onto the stack, restore pops it off the stack
// and keeps track of that turtle's position and direction
// every time you see F, put a cylinder in

class  TurtleStack
{
    stack: Turtle[];

    currPos: vec3;
    currDir: vec3;
    currTurtle: Turtle;

    constructor()
    {
       // Instantiate stack with 1 turtle at the origin, moving straight up the Y axis
        this.currPos = vec3.fromValues(0.0, 0.0, 0.0);
        this.currDir = vec3.fromValues(0.0, 1.0, 0.0);
        this.currTurtle = new Turtle(this.currPos, 0); 
        this.stack = [this.currTurtle];

    }
   
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

    getCurrDir() : vec3
    {
        return this.currDir;
    }

    // TODO: draw the lsystem branches
    // Doesn't actually "draw" the cylinder, just moves it to the right place for the final VBO to draw all at once
    drawBranch()
    {

    }

    // TODO: draw leaf
    // Doesn't actually "draw" the leaf, just moves it to the right place for the final VBO to draw all at once
    drawLeaf()
    {

    }

}

export default TurtleStack;