const fs = require('fs');
const babel = require('@babel/core');
const code = fs.readFileSync('pages/School/SchoolSignup.jsx', 'utf-8');
const ast = babel.parse(code, {
  presets: ['@babel/preset-react'],
  filename: 'SchoolSignup.jsx'
});
let found = false;
babel.traverse(ast, {
  JSXOpeningElement(path) {
    if (path.node.name.name === "") {
      console.log("Empty tag found at line", path.node.loc.start.line);
      found = true;
    }
  }
});
if (!found) console.log("No empty tags found.");
