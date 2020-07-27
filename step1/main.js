import {
    ToyReact,
    Component
} from "./ToyReact.js";

class MyComponent extends Component{
    render(){
        return <div>
            <div>hellow</div>
            <div>world!</div>
            <div>{true}</div>
            <div>{this.children}</div> 
        </div>
    }
    //{this.children} 传进来的其实是数组
}

let a = <MyComponent name='a' id="ida">
    <div>1</div>
</MyComponent>

ToyReact.render(
    a,
    document.body
);

 /* let a = <div name='a' id="ida">
    <span>hellow</span>
    <span>world</span>
    <span>!</span>
</div>

 var a = ToyReact.createElement("div", {
    name: "a",
    id: "ida"
  }, 
  ToyReact.createElement("span", null, "hellow"), 
  ToyReact.createElement("span", null, "world"), 
  ToyReact.createElement("span", null, "!"));
  document.body.appendChild(a);
*/