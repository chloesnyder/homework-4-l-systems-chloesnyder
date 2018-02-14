import {vec3, vec4, mat3, mat4, quat} from 'gl-matrix';
//import Stack from "ts-data.stack";


const PI = Math.PI;
const deg2rad = PI / 180.0;

// Reference: https://cathyatseneca.gitbooks.io/3d-modelling-for-programmers/content/l-systems/index.html
// A class representing a turtle. The turtle has a position, orientation, and a depth. Position and orientation
class  Turtle
{
    position: vec3 = vec3.create(); // position
    orientation: quat = quat.create(); // a global quaternion governing rotation of turtle direction
    direction: vec3 = vec3.create(); // the vector governing the direction the turtle is heading in
    depth: number = 1; // iteration number    
    state: [vec3, quat]; // the turtle's current position and orientation
    
    x_axis: vec3 = vec3.fromValues(1.0, 0.0, 0.0);
    y_axis: vec3 = vec3.fromValues(0.0, 1.0, 0.0);
    z_axis: vec3 = vec3.fromValues(0.0, 0.0, 1.0);


    constructor(pos: vec3, iter: number) {
        this.position = pos;
        this.direction = vec3.fromValues(0.0, 1.0, 0.0); // initially, turtle moves straight up
       
        this.depth = iter;
        this.state = [this.position, this.orientation];
    }

    // Move a turtle by specifying a direction to rotate the turtle, degree to rotate by, and how far to move forward
    move(direction: string, degree: number, length: number)
    {
        if(direction === "right")
        {
            this.rotateAboutY(degree);
        } else if (direction === "left")
        {
            this.rotateAboutY(-degree);
        } else if (direction === "down")
        {
            this.rotateAboutZ(-degree);
        } else if (direction === "up")
        {
            this.rotateAboutZ(degree);
        } else if (direction === "forward")
        {
            this.rotateAboutX(degree);
        } else if (direction === "backward")
        {
            this.rotateAboutX(-degree);
        }

        this.moveForward(length);
        this.updateState();
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