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

    depth: number;

    branchMesh: Mesh;
    branchIdx: Array<number> = new Array();
    branchPos: Array<Array<number>>= new Array<Array<number>>();
    branchNor: Array<Array<number>>= new Array<Array<number>>();
    branchCount: number;

    leafMesh: Mesh;
    leafIdx: Array<number> = new Array();
    leafPos: Array<Array<number>>= new Array<Array<number>>();
    leafNor: Array<Array<number>>= new Array<Array<number>>();
    leafCount: number;

    iterScale: number;

    constructor(t: Turtle)
    {
       // Instantiate stack with 1 turtle at the origin, moving straight up the Y axis
        this.currTurtle = t;
        this.save(this.currTurtle);

        //instantiate an instance of branch
        this.branchMesh = new Mesh(vec3.fromValues(0, 0, 0));
        this.branchMesh.loadBuffers(this.readTextFile('src/objs/cylinder.obj'));

        var t_branchPos =  this.branchMesh.getTempPos();
        var t_branchNor =  this.branchMesh.getTempNor();
        var t_branchIdx =  this.branchMesh.getTempIndices();

        // for some reason, branchIdx.length return 1
        this.branchCount = this.branchMesh.getCount();
        var numBranchVerts = t_branchPos.length / 4.0;
     
        // convert into an array of "vec4s"
        for(var i = 0; i < numBranchVerts; i++)
        {
            this.branchNor.push([t_branchNor[i * 4], t_branchNor[i * 4 + 1], t_branchNor[i * 4 + 2], 0.0]);
            this.branchPos.push([t_branchPos[i * 4], t_branchPos[i * 4 + 1], t_branchPos[i * 4 + 2], 1.0]);
        }

        //offset indices
        for(var j = 0; j < this.branchCount; j++)
        {
            this.branchIdx.push(t_branchIdx[j]);
        }

        // instance of leaf
        this.leafMesh = new Mesh(vec3.fromValues(0, 0, 0));
        this.leafMesh.loadBuffers(this.readTextFile('src/objs/sphere.obj'));

        var t_leafPos = this.leafMesh.getTempPos();
        var t_leafNor = this.leafMesh.getTempNor();
        var t_leafIdx = this.leafMesh.getTempIndices();

        this.leafCount = this.leafMesh.getCount();
        var numLeafVerts = t_leafPos.length / 4.0;

        for (var i = 0; i < numLeafVerts; i++)
        {
            this.leafNor.push([t_leafNor[i * 4], t_leafNor[i * 4 + 1], t_leafNor[i * 4 + 2], 0.0]);
            this.leafPos.push([t_leafPos[i * 4], t_leafPos[i * 4 + 1], t_leafPos[i * 4 + 2], 1.0]);
        }

        for(var j = 0; j < this.leafCount; j++)
        {
            this.leafIdx.push(t_leafIdx[j]);
        }

        this.count = 0;
        this.depth = 0;
        this.iterScale = 0;
    }
   
    save(t: Turtle)
    {
        this.stack.push(t);
    }

    restore() : Turtle
    {
        var t = this.stack.pop();
        this.currTurtle = new Turtle(vec4.clone(t.position), quat.clone(t.orientation));
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
    static drawBranch__transNormals = vec4.create();
    static drawBranch__mat4Rot =  mat4.create();
    drawBranch()
    {
        var currBranchNor = new Array();
        var currBranchPos = new Array();
        var currBranchIdx = new Array();

        var currPos = this.currTurtle.getPosition();
        var currRot = this.currTurtle.getOrientation();
        quat.normalize(currRot, currRot);
       // vec4.normalize(currPos, currPos);
        var currTrans = mat4.create();
        // scale it based on depth
        var scale =  1.0 / (this.depth + 1);
        mat4.fromRotationTranslationScale(currTrans, currRot, vec3.fromValues(currPos[0], currPos[1], currPos[2]), vec3.fromValues(.5 * scale, scale, .5 * scale));
        console.log(scale);

        // transform branch positions based on possition of the turtle
        for(var i = 0; i < this.branchPos.length; i++)
        {

            var transPositions = vec4.fromValues(this.branchPos[i][0], this.branchPos[i][1], this.branchPos[i][2], 1.0);
            var transNormals = TurtleStack.drawBranch__transNormals;

            //transform brach pos based on current transformation (rotation and position) of turtle
            transPositions = vec4.transformMat4(transPositions, transPositions, currTrans);
            //rotate normals based on current turtle rotation
            var mat4Rot =  TurtleStack.drawBranch__mat4Rot;
            mat4.fromQuat(mat4Rot, currRot);
            transNormals = vec4.transformMat4(transNormals, this.branchNor[i], mat4Rot);
            
            // flatten into a temp VBO to append to final array
            currBranchNor.push(transNormals[0]);
            currBranchNor.push(transNormals[1]);
            currBranchNor.push(transNormals[2]);
            currBranchNor.push(0.0);
            currBranchPos.push(transPositions[0]);
            currBranchPos.push(transPositions[1]);
            currBranchPos.push(transPositions[2]);
            currBranchPos.push(1.0);

        }

        for(var j = 0; j < this.branchCount; j++)
        {
            var offset = Math.floor(this.positions.length / 4.0); // offset by vertex count
            currBranchIdx.push(this.branchIdx[j] + offset); 
        }

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
        // need to translate to end of the branch
        var currLeafNor = new Array();
        var currLeafPos = new Array();
        var currLeafIdx = new Array();

        var scale =  1.0 / (this.depth + 1);

        var currPos = this.currTurtle.getPosition();
        var x = vec4.create();
        vec4.add(currPos, currPos, vec4.multiply(x, vec4.fromValues(1.0, 2.0, 1.0, 1.9), this.currTurtle.getDirection()));
        var currRot = this.currTurtle.getOrientation();
        quat.normalize(currRot, currRot);
        vec4.normalize(currPos, currPos);
        var currTrans = mat4.create();
        // scale it based on depth
     
        mat4.fromRotationTranslationScale(currTrans, currRot, vec3.fromValues(currPos[0], currPos[1], currPos[2]), vec3.fromValues(.5 * scale, .5 * scale, .5 * scale));

        // transform branch positions based on possition of the turtle
        for(var i = 0; i < this.leafPos.length; i++)
        {

            var transPositions = vec4.fromValues(this.leafPos[i][0], this.leafPos[i][1], this.leafPos[i][2], 1.0);
            var transNormals = vec4.create();

            //transform brach pos based on current transformation (rotation and position) of turtle
            transPositions = vec4.transformMat4(transPositions, transPositions, currTrans);
            //rotate normals based on current turtle rotation
            var mat4Rot =  mat4.create();
            mat4.fromQuat(mat4Rot, currRot);
            transNormals = vec4.transformMat4(transNormals, this.leafNor[i], mat4Rot);
            
            // flatten into a temp VBO to append to final array
            currLeafNor.push(transNormals[0]);
            currLeafNor.push(transNormals[1]);
            currLeafNor.push(transNormals[2]);
            currLeafNor.push(0.0);
            currLeafPos.push(transPositions[0]);
            currLeafPos.push(transPositions[1]);
            currLeafPos.push(transPositions[2]);
            currLeafPos.push(1.0);

        }

        for(var j = 0; j < this.leafCount; j++)
        {
            var offset = Math.floor(this.positions.length / 4.0); // offset by vertex count
            currLeafIdx.push(this.leafIdx[j] + offset); 
        }

        this.normals = this.normals.concat(currLeafNor);
        this.positions = this.positions.concat(currLeafPos);
        this.indices = this.indices.concat(currLeafIdx);

        this.count += this.leafCount;
        console.log("drew a leaf");
    }

}

export default TurtleStack;