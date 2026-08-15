const fs = require('fs');
let content = fs.readFileSync('pages/signin.jsx', 'utf8');

const inputRegex = /<input([^>]*?)type="password"([^>]*?)\/>/g;
const match = content.match(inputRegex);
console.log(match ? match.length : 0);
