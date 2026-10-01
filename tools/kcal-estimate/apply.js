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

if (JSON.stringify(RECIPES) !== jsonText) {
  console.error('A RECIPES sor nem írható vissza bájtra azonosan (JSON.stringify eltér); leállok.');
  process.exit(1);
}

var filled = 0, kept = 0, protFilled = 0, protKept = 0;
Object.keys(RECIPES).forEach(function (ck) {
  Object.keys(RECIPES[ck]).forEach(function (slot) {
    RECIPES[ck][slot].forEach(function (r) {
      if (r.calories) { kept++; } else {
        r.calories = est.estimateRecipeCalories(r);
        filled++;
      }
      // Fehérje (g/adag): csak a hiányzó `proteinGrams` mezőt tölti ki, egész grammra kerekítve.
      if (r.proteinGrams === undefined || r.proteinGrams === null) {
        r.proteinGrams = est.estimateRecipeProtein(r);
        protFilled++;
      } else { protKept++; }
    });
  });
});

console.log('filled:', filled, 'kept existing:', kept);
console.log('protein filled:', protFilled, 'kept existing:', protKept);
if (est.PROT_CLAMPED.length) console.log('protein clamped (check by hand):', JSON.stringify(est.PROT_CLAMPED));

var newJson = JSON.stringify(RECIPES);
var newHtml = html.slice(0, start) + newJson + html.slice(end);
fs.writeFileSync(FILE, newHtml, 'utf8');
console.log('written', newHtml.length, 'bytes (was', html.length, ')');
