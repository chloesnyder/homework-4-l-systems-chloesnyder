import Turtle from './turtle';
import {vec3, vec4, mat3, mat4, quat} from 'gl-matrix';

const PI = Math.PI;
const deg2rad = PI / 180.0;


// A class to create an LSystem. This class processes the initial axiom string,
// and expands it into a longer string based on a set of rules
// the string is expanded for a given number of iterations
//http://interactivepython.org/courselib/static/thinkcspy/Strings/TurtlesandStringsandLSystems.html
class  LSystem
{

    // TODO: come up with actual rules
    // The rules stating how to expand the original string
    applyRules(ch: number, str: string) : string
    {
       var currChar = str.charAt(ch);
       var toReturn = "";
       if(currChar === 'SOME CHAR')
       {
            toReturn = "some other char to replace"
       } else if (currChar === 'SOME OTHER CHAR') {
            toReturn = "some other char to replace"
       } else {
           toReturn = currChar; // no rules to apply so keep char
       }
        return toReturn;
    }

    // Process initial string and expand based on rules
    processString(oldStr: string) : string
    {
        var newstr = "";
        for(var ch = 0; ch < oldStr.length; ch++)
        {
            newstr = newstr + this.applyRules(ch, oldStr);
        }
        return newstr;
    }

    createLSystem(numIters: number, axiom: string) : string
    {
      var startString = axiom;
      var endString = "";
      for(var i = 0; i < numIters; i++)
      {
        endString = this.processString(startString);
        startString = endString;
      }
      return endString;
    }
}

export default LSystem;