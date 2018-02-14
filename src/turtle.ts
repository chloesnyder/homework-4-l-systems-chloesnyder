import {vec3, vec4, mat3, mat4, quat} from 'gl-matrix';
import Stack from "ts-data.stack";
import { transformMat4 } from 'gl-matrix/src/gl-matrix/vec2';
import { rotateZ } from 'gl-matrix/src/gl-matrix/quat';

const PI = Math.PI;
const deg2rad = PI / 180.0;


// Reference: https://cathyatseneca.gitbooks.io/3d-modelling-for-programmers/content/l-systems/index.html
class  Turtle
{
    position: vec3 = vec3.create(); // position
    orientation: quat = quat.create(); // a global quaternion governing rotation of turtle direction
    direction: vec3 = vec3.create(); // the vector governing the direction the turtle is heading in

    depth: number = 1; // iteration number  
    
    state: [vec3, quat]; // the turtle's current position and orientation
    stack: Stack<[vec3, quat]>; // a stack of all turtle states that can be pushed and popped
    
    x_axis: vec3 = vec3.fromValues(1.0, 0.0, 0.0);
    y_axis: vec3 = vec3.fromValues(0.0, 1.0, 0.0);
    z_axis: vec3 = vec3.fromValues(0.0, 0.0, 1.0);


    constructor(pos: vec3, iter: number) {
        this.position = pos;
        this.direction = vec3.fromValues(0.0, 1.0, 0.0); // initially, turtle moves straight up
       
        this.depth = iter;
        this.stack = new Stack<[vec3, vec3]>();
        this.state = [this.position, this.orientation];
    }

    updateState()
    {
        this.state = [this.position, this.orientation];
    }

    // move the turtle forward a specific length
    moveForward(length: number)
    {
        var scaled = vec3.create();
        vec3.scale(scaled, this.direction, length);
        vec3.add(this.position, this.position, scaled); // is this the right order?
        this.updateState();
    }

    applyRotation()
    {
        this.direction = vec3.transformQuat(this.direction, this.direction, this.orientation); // is this the right order?
    }

    // Unsure about order of multiplication
    rotateAboutX(degree: number)
    {
        var q = quat.setAxisAngle(q, this.x_axis, degree * deg2rad);
        this.orientation = quat.multiply(this.orientation, q, this.orientation); // is this the right order?
        this.applyRotation();
    }

    rotateAboutY(degree: number)
    {
        var q = quat.setAxisAngle(q, this.y_axis, degree * deg2rad);
        this.orientation = quat.multiply(this.orientation, q, this.orientation); // is this the right order?
        this.applyRotation();
    }

    rotateAboutZ(degree: number)
    {
        var q = quat.setAxisAngle(q, this.z_axis, degree * deg2rad);
        this.orientation = quat.multiply(this.orientation, q, this.orientation); // is this the right order?
        this.applyRotation();  
    }

    getState() : [vec3, quat] 
    {
        return this.state;
    }

    getTurtle() : Turtle
    {
        return this;
    }

}


export default Turtle;