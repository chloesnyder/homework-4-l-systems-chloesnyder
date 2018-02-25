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
    count: number;
    currTurtle: Turtle;

    branchMesh: Mesh;
    branchIdx: Array<number> = new Array();
    branchPos: Array<Array<number>>= new Array<Array<number>>();
    branchNor: Array<Array<number>>= new Array<Array<number>>();
    branchCount: number;

    constructor(t: Turtle)
    {
       // Instantiate stack with 1 turtle at the origin, moving straight up the Y axis
        this.currTurtle = t;
        this.save(this.currTurtle);

        //instantiate an instance of branch
        this.branchMesh = new Mesh(vec3.fromValues(0, 0, 0));
        this.branchMesh.loadBuffers(this.readTextFile('src/objs/cube.obj'));

        var t_branchPos =  this.branchMesh.getTempPos();
      //  console.log(t_branchPos);
        var t_branchNor =  this.branchMesh.getTempNor();
     //   console.log(t_branchNor);
        var t_branchIdx =  this.branchMesh.getTempIndices();
      //  console.log(t_branchIdx);

        // for some reason, branchIdx.length return 1
        this.branchCount = this.branchMesh.getCount();
        var numVerts = t_branchPos.length / 4.0;
     
        // convert into an array of "vec4s"
        for(var i = 0; i < numVerts; i++)
        {
            this.branchNor.push([t_branchNor[i * 4], t_branchNor[i * 4 + 1], t_branchNor[i * 4 + 2], 0.0]);
            this.branchPos.push([t_branchPos[i * 4], t_branchPos[i * 4 + 1], t_branchPos[i * 4 + 2], 1.0]);
        }

        //offset indices
        for(var j = 0; j < this.branchCount; j++)
        {
            this.branchIdx.push(t_branchIdx[j]);
        }

        console.log(this.branchNor);
      //  console.log(this.branchPos);
       // console.log(this.branchIdx);

        this.count = 0;
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
        var currBranchNor = new Array();
        var currBranchPos = new Array();
        var currBranchIdx = new Array();

        var currPos = this.currTurtle.getPosition();
        var currRot = this.currTurtle.getOrientation();
        var currTrans = mat4.create();
        mat4.fromRotationTranslation(currTrans, currRot, vec3.fromValues(currPos[0], currPos[1], currPos[2]));

        // transform branch positions based on possition of the turtle
        for(var i = 0; i < this.branchPos.length; i++)
        {
            currBranchNor.push(this.branchNor[i][0]);
            currBranchNor.push(this.branchNor[i][1]);
            currBranchNor.push(this.branchNor[i][2]);
            currBranchNor.push(0.0);

            currBranchPos.push(this.branchPos[i][0]);
            currBranchPos.push(this.branchPos[i][1]);
            currBranchPos.push(this.branchPos[i][2]);
            currBranchPos.push(1.0);
        /*    var transPositions = vec4.fromValues(this.branchPos[i][0], this.branchPos[i][1], this.branchPos[i][2], 1.0);
            var transNormals = this.branchNor[i];//vec4.create();

            //transform brach pos based on current transformation (rotation and position) of turtle
         //   transPositions = vec4.transformMat4(transPositions, transPositions, currTrans);
            //rotate normals based on current turtle rotation
        //    var mat4Rot =  mat4.create();
        //    mat4.fromQuat(mat4Rot, currRot);
         //   transNormals = vec4.transformMat4(transNormals, this.branchNor[i], mat4Rot);
            
            // flatten into a temp VBO to append to final array
            currBranchNor.push(transNormals[0]);
            currBranchNor.push(transNormals[1]);
            currBranchNor.push(transNormals[2]);
            currBranchNor.push(0.0);
            currBranchPos.push(transPositions[0]);
            currBranchPos.push(transPositions[1]);
            currBranchPos.push(transPositions[2]);
            currBranchPos.push(1.0);
           // console.log(currBranchPos);*/
        }

        for(var j = 0; j < this.branchCount; j++)
        {
            var offset = Math.floor(this.count / 4.0);
         //   console.log(offset);
            currBranchIdx.push(this.branchIdx[j] + offset); // or some reason index array pushes entire array instead of a single number. Look at how I'm setting indices again.
        }

       // this.indices = this.indices.concat(this.branchIdx);
        this.normals = this.normals.concat(currBranchNor);
        this.positions = this.positions.concat(currBranchPos);
        this.indices = this.indices.concat(currBranchIdx);

        // update count for overall mesh
        this.count += this.branchCount;
  
        console.log("drew a branch");

    }

    // TODO: draw leaf
    // Doesn't actually "draw" the leaf, just moves it to the right place for the final VBO to draw all at once
    drawLeaf()
    {

    }

}

export default TurtleStack;