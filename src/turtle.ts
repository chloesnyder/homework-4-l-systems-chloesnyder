import {vec3, vec4, mat3, mat4, quat} from 'gl-matrix';


const PI = Math.PI;
const deg2rad = PI / 180.0;

// Reference: https://cathyatseneca.gitbooks.io/3d-modelling-for-programmers/content/l-systems/index.html
// A class representing a turtle. The turtle has a position, orientation, and a depth. Position and orientation
class  Turtle
{
    position: vec4 = vec4.create(); // position
    orientation: quat = quat.create(); // a global quaternion governing rotation of turtle direction
    direction: vec4 = vec4.create(); // the vector governing the direction the turtle is heading in 
    state: [vec4, vec4]; // the turtle's current position and orientation
    
    x_axis: vec3 = vec3.fromValues(1.0, 0.0, 0.0);
    y_axis: vec3 = vec3.fromValues(0.0, 1.0, 0.0);
    z_axis: vec3 = vec3.fromValues(0.0, 0.0, 1.0);


    constructor(pos: vec4, or: quat) {
        this.position = pos;
        this.orientation = or;
        this.direction = vec4.fromValues(0.0, 1.0, 0.0, 0.0); // initially, turtle moves straight up
       
        this.state = [this.position, this.direction];
    }

    getPosition() : vec4
    {
        return this.position;
    }

    getOrientation() : quat
    {
        return this.orientation;
    }

    getDirection() : vec4
    {
        return this.direction;
    }

    // Move a turtle by specifying a direction to rotate the turtle, degree to rotate by, and how far to move forward
    move(direction: string, degree: number, length: number)
    {
        if(direction === "TR")
        {
            this.rotateAboutX(degree);
            console.log("turn right");
        } else if (direction === "TL")
        {
            this.rotateAboutX(-degree);
            console.log("turn left");
        } else if (direction === "PL")
        {
            this.rotateAboutZ(-degree);
            console.log("pitch left");
        } else if (direction === "PR")
        {
            this.rotateAboutZ(degree);
            console.log("pitch right");
        } else if (direction === "RR") {
            this.rotateAboutY(degree);
            console.log("roll right");
        } else if (direction === "RL") {
            this.rotateAboutY(-degree);
            console.log("roll left");
        } else if (direction === "forward")
        {
           this.moveForward(length);
            console.log("forward");
        } else if (direction === "backward")
        {
            this.moveForward(-length);
            console.log("backward");
        }
        this.updateState();
    }

    updateState()
    {
        this.state = [this.position, this.direction];
    }

    // move the turtle forward a specific length
    static scaled = vec4.create();
    moveForward(length: number)
    {
        vec4.scale(Turtle.scaled, this.direction, length);
        vec4.add(this.position, this.position, Turtle.scaled); // is this the right order?
    }

    applyRotation()
    {
        this.direction = vec4.transformQuat(this.direction, this.direction, this.orientation); // is this the right order?
    }

    // Unsure about order of multiplication
    static q = quat.create();
    rotateAboutX(degree: number)
    {
        quat.setAxisAngle(Turtle.q, this.x_axis, degree * deg2rad);
        this.orientation = quat.multiply(this.orientation, this.orientation, Turtle.q); // is this the right order?
        this.applyRotation();
    }

    rotateAboutY(degree: number)
    {
        quat.setAxisAngle(Turtle.q, this.y_axis, degree * deg2rad);
        this.orientation = quat.multiply(this.orientation, this.orientation, Turtle.q); // is this the right order?
        this.applyRotation();
    }

    rotateAboutZ(degree: number)
    {
        quat.setAxisAngle(Turtle.q, this.z_axis, degree * deg2rad);
        this.orientation = quat.multiply(this.orientation, this.orientation, Turtle.q); // is this the right order?
        this.applyRotation();  
    }


}


export default Turtle;