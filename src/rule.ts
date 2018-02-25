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

      if(currChar === "X")
       {
           //toReturn = "F[+X]F[-X]+X"
           toReturn = "F";//[+[*]]";
           console.log(toReturn);
       } else if (currChar === "F")
       {
            //toReturn = "FF";
           // toReturn = "[F[F*]]"
          // toReturn = "F[-&<F][<++&F]|F[-&>F][+&F*]";
          if(probability < .5) {
            toReturn = "[F<[F*^*]]";
          } else {
            toReturn = "F[-&<F][<++&F]|F[-&>F][+&F]"//"[F>[F*&*]]";
          }
            console.log(toReturn);
       }
     /*  if(currChar === "F")
       {
           toReturn = "[F][[F]F]";
       }*/


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