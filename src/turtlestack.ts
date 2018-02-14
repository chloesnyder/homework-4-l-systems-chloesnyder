import Stack from "ts-data.stack";
import Turtle from './turtle';

const PI = Math.PI;
const deg2rad = PI / 180.0;


// Reference: https://cathyatseneca.gitbooks.io/3d-modelling-for-programmers/content/l-systems/index.html
class  TurtleStack
{
    stack: Stack<[Turtle]>;
   
    save(t: Turtle)
    {
        this.stack.push(t);
    }

    store() : Turtle
    {
        return this.stack.pop();
    }

}


export default TurtleStack;