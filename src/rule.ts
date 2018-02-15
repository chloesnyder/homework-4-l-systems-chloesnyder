import {vec3, vec4, mat3, mat4, quat} from 'gl-matrix';

const PI = Math.PI;
const deg2rad = PI / 180.0;


// A class representing rules. This is the class that 
// takes the initial string and expands it to its final string
// This class processes the initial axiom string,
// and expands it into a longer string based on a set of rules
// the string is expanded for a given number of iterations
//http://interactivepython.org/courselib/static/thinkcspy/Strings/TurtlesandStringsandLSystems.html
class  Rule
{

    constructor() {}

    // TODO: come up with actual rules
    // The rules stating how to expand the original string
    applyRules(ch: number, str: string, iter: number) : string
    {
        // eventually modify this so that iteration matters, i.e. later iterations = more flowers?
        // TODO: flowers

       var currChar = str.charAt(ch);
       var toReturn = "";
       var probability = Math.random();

        // change character based on some probability depending on the number iteration we are at
        if(currChar === "F")
        {
            if(probability < .5)
            {
                toReturn = "FF";
            } else {
                toReturn = "FRU";
            }
           
        } else if (currChar === "B") {
            if(probability < .5)
            {
                toReturn = "BB";
            } else {
                toReturn = "BLD";
            }

        } else if (currChar === "U") {
            if(probability < .5)
            {
                toReturn = "L";
            } else {
                toReturn = "R";
            }

        } else if (currChar === "D") {
            if(probability < .5)
            {
                toReturn = "L";
            } else {
                toReturn = "R";
            }
        } else if (currChar === "R") {
            if(probability < .5)
            {
                toReturn = "F";
            } else {
                toReturn = "B";
            }
        } else if (currChar === "L") {
            if(probability < .5)
            {
                toReturn = "F";
            } else {
                toReturn = "B";
            }
        }

        return toReturn;
    }

    // Process initial string and expand based on rules
    processString(oldStr: string, iter: number) : string
    {
        var newstr = "";
        for(var ch = 0; ch < oldStr.length; ch++)
        {
            newstr = newstr + this.applyRules(ch, oldStr, iter);
        }
        return newstr;
    }

    createLSystem(numIters: number, axiom: string) : string
    {
      var startString = axiom;
      var endString = "";
      for(var i = 0; i < numIters; i++)
      {
        endString = this.processString(startString, i);
        startString = endString;
      }
      return endString;
    }
    
}

export default Rule;