var fs = require('fs');
var path = require('path');
var est = require('./estimate.js');

var FILE = path.resolve(__dirname, '..', '..', 'index.html');
var html = fs.readFileSync(FILE, 'utf8');
var marker = 'var RECIPES = ';
var start = html.indexOf(marker) + marker.length;
var end = html.indexOf(';\n', start);
var jsonText = html.slice(start, end);
var RECIPES = JSON.parse(jsonText);

var filled = 0, kept = 0;
Object.keys(RECIPES).forEach(function (ck) {
  Object.keys(RECIPES[ck]).forEach(function (slot) {
    RECIPES[ck][slot].forEach(function (r) {
      if (r.calories) { kept++; return; }
      r.calories = est.estimateRecipeCalories(r);
      filled++;
    });
  });
});

console.log('filled:', filled, 'kept existing:', kept);

var newJson = JSON.stringify(RECIPES);
var newHtml = html.slice(0, start) + newJson + html.slice(end);
fs.writeFileSync(FILE, newHtml, 'utf8');
console.log('written', newHtml.length, 'bytes (was', html.length, ')');
