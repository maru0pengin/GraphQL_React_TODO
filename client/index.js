import React from "react";
import { render } from "react-dom";

var reactElement = <h2>こんにちは世界</h2>;

console.log(reactElement);

render(reactElement, document.getElementById("root"));
