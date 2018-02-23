import Turtle from './turtle';
import {vec3, vec4, mat3, mat4, quat} from 'gl-matrix';
import Mesh from './geometry/Mesh';
import * as fs from 'fs';

var OBJ = require('webgl-obj-loader');
const PI = Math.PI;
const deg2rad = PI / 180.0;


// A stack keeping track of turtle states. Save pushes a turtle onto the stack, restore pops it off the stack
// and keeps track of that turtle's position and direction
// every time you see F, put a cylinder in

class  TurtleStack
{
    stack: Turtle[] = new Array();
    indices: Array<number> = new Array();
    positions: Array<number> = new Array();
    normals: Array<number> = new Array();
    currTurtle: Turtle;

    branchMesh: Mesh;
    branchIdx: Array<number> = new Array();
    branchPos: Array<Array<number>>= new Array<Array<number>>();
    branchNor: Array<Array<number>>= new Array<Array<number>>();

    constructor(t: Turtle)
    {
       // Instantiate stack with 1 turtle at the origin, moving straight up the Y axis
        this.currTurtle = t;
        this.save(this.currTurtle);

        //instantiate an instance of branch
        this.branchMesh = new Mesh(vec3.fromValues(0, 0, 0));
        this.branchMesh.loadBuffers(this.readTextFile('src/objs/cube.obj'));

        var t_branchPos =  this.branchMesh.getTempPos();
        var t_branchNor =  this.branchMesh.getTempNor();
        this.branchIdx =  this.branchMesh.getTempIndices();
     
        // convert into an array of "vec4s"
        for(var i = 0; i < this.branchIdx.length; i++)
        {
            this.branchNor.push([t_branchNor[i * 3], t_branchNor[i * 3 + 1], t_branchNor[i * 3 + 2], 0]);
            this.branchPos.push([t_branchPos[i * 3], t_branchPos[i * 3 + 1], t_branchPos[i * 3 + 2], 0]);
        }

    }
   
    save(t: Turtle)
    {
        this.stack.push(t);
    }

    restore() : Turtle
    {
        this.currTurtle = this.stack.pop();
        this.drawBranch(); // store turtle VBOs in global VBO list
        console.log("restore");
        return this.currTurtle;
    }


    //https://stackoverflow.com/questions/14446447/how-to-read-a-local-text-file
    readTextFile(file: string) : string
    {
        var text = "";
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", file, false);
        rawFile.onreadystatechange = function ()
        {
            if(rawFile.readyState === 4)
            {
                if(rawFile.status === 200 || rawFile.status == 0)
                {
                    var allText = rawFile.responseText;
                    text = allText;
                }
            }
        }
        rawFile.send(null);
        return text;
    }

    // TODO: draw the lsystem branches
    // Doesn't actually "draw" the cylinder, just moves it to the right place for the final VBO to draw all at once
    drawBranch()
    {
        var currBranchIdx = new Array();
        var currBranchNor = new Array();
        var currBranchPos = new Array();

        var currPos = this.currTurtle.getPosition();
        var currRot = this.currTurtle.getOrientation();
        var currTrans = mat4.create();
        mat4.fromRotationTranslation(currTrans, currRot, vec3.fromValues(currPos[0], currPos[1], currPos[2]));

        // transform branch positions based on possition of the turtle
        for(var i = 0; i < this.branchPos.length; i++)
        {
            var transPositions = vec4.fromValues(this.branchPos[i][0], this.branchPos[i][1], this.branchPos[i][2], 1.0);
            var transNormals = vec4.create();

            //transform brach pos based on current transformation (rotation and position) of turtle
            transPositions = vec4.transformMat4(transPositions, transPositions, currTrans);
            //rotate normals based on current turtle rotation
            var mat4Rot =  mat4.create();
            mat4.fromQuat(mat4Rot, currRot);
            transNormals = vec4.transformMat4(transNormals, this.branchNor[i], mat4Rot);
            
            // flatten into a temp VBO to append to final array
            currBranchNor.push(transNormals[0]);
            currBranchNor.push(transNormals[1]);
            currBranchNor.push(transNormals[2]);
            currBranchNor.push(transNormals[3]);
            currBranchPos.push(transPositions[0]);
            currBranchPos.push(transPositions[1]);
            currBranchPos.push(transPositions[2]);
            currBranchPos.push(transPositions[3]);
        }

        currBranchIdx = this.branchIdx;
        this.indices.concat(currBranchIdx);
        this.normals.concat(currBranchNor);
        this.positions.concat(currBranchPos);
        console.log("drew a branch");

    }

    // TODO: draw leaf
    // Doesn't actually "draw" the leaf, just moves it to the right place for the final VBO to draw all at once
    drawLeaf()
    {

    }

}

export default TurtleStack;