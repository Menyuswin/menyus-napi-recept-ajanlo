var fs = require('fs');
var DB = require('./db.js');

var UNIT_WORDS = "kg|dkg|g|dl|cl|l|ml|db|lap|evőkanál|ek\\.?|teáskanál|tk\\.?|kávéskanál|csipet|szelet|gerezd|fej|szál|szem|csokor|adag|marék|köteg|kanál";
var QUANTITY_RE = new RegExp("^((?:\\d+[\\d.,]*|½|¼|¾)(?:\\s*[-–]\\s*\\d+[\\d.,]*)?\\s*(?:kis|közepes|nagy)?\\s*(?:" + UNIT_WORDS + ")?)\\s+(.+)$", "i");

function splitIngredientLine(line) {
  var m = line.match(QUANTITY_RE);
  if (m) return { qty: m[1].trim(), name: m[2].trim() };
  return { qty: "", name: line.trim() };
}

var WEIGHT_UNITS = { g: 1, dkg: 10, kg: 1000 };
var VOLUME_UNITS = { ml: 1, dl: 100, l: 1000, evőkanál: 15, "ek": 15, "ek.": 15, kanál: 15, teáskanál: 5, tk: 5, "tk.": 5, "kávéskanál": 5, csipet: 1 };
var FRACTION_CHARS = { "½": 0.5, "¼": 0.25, "¾": 0.75 };
var COUNT_UNIT_DEFAULT_G = { db: 80, lap: 20, fej: 100, gerezd: 5, szelet: 25, szál: 10, szem: 5, csokor: 30, köteg: 50, marék: 30, adag: 150 };

function parseSingleNumber(tok) {
  var t = tok.trim().toLowerCase();
  if (FRACTION_CHARS[t] !== undefined) return FRACTION_CHARS[t];
  var n = parseFloat(t.replace(",", "."));
  return isNaN(n) ? null : n;
}

function parseQuantityPhrase(phrase) {
  if (!phrase) return null;
  var s = phrase.trim();
  var unitMatch = s.match(new RegExp("(" + UNIT_WORDS + ")\\s*$", "i"));
  var unit = unitMatch ? unitMatch[1].toLowerCase().replace(/\.$/, "") : null;
  var numPart = unit ? s.slice(0, unitMatch.index).trim() : s;
  numPart = numPart.replace(/\b(kis|közepes|nagy)\b/gi, "").trim();
  if (!numPart) return unit ? { value: 1, unit: unit } : null;
  var rangeMatch = numPart.match(/^([\d.,½¼¾]+)\s*[-–]\s*([\d.,]+)$/);
  var value = rangeMatch ? parseSingleNumber(rangeMatch[2]) : parseSingleNumber(numPart);
  if (value === null) return unit ? { value: 1, unit: unit } : null;
  return { value: value, unit: unit };
}

// Sűrűség (g/ml) folyékony/ömlesztett mértékegységek grammra váltásához.
var DENSITY = [
  { kw: ["porcukor"], g: 0.6 },
  { kw: ["liszt"], g: 0.55 },
  { kw: ["zsemlemorzsa", "morzsa"], g: 0.45 },
  { kw: ["kakaópor"], g: 0.5 },
  { kw: ["cukor"], g: 0.85 },
  { kw: ["rizs"], g: 0.85 },
  { kw: ["méz"], g: 1.4 },
  { kw: ["olaj", "zsír"], g: 0.92 },
  { kw: ["szójaszósz", "ecet"], g: 1.05 },
  { kw: ["tejszín", "tejföl", "tej"], g: 1.03 }
];
function findDensity(name) {
  var lower = name.toLowerCase();
  for (var i = 0; i < DENSITY.length; i++) {
    if (DENSITY[i].kw.some(function (k) { return lower.indexOf(k) !== -1; })) return DENSITY[i].g;
  }
  return 1.0;
}

function findDbEntry(name) {
  var lower = name.toLowerCase();
  for (var i = 0; i < DB.length; i++) {
    if (DB[i].kw.some(function (k) { return lower.indexOf(k) !== -1; })) return DB[i];
  }
  return null;
}

var UNMATCHED = {};

var EMBEDDED_WEIGHT_RE = /(\d+(?:[.,]\d+)?)\s*(kg|dkg|g)-os\b/i;

function estimateLineGrams(qtyPhrase, name) {
  // Néha a súly a hozzávaló NEVÉBE ágyazva szerepel, nem a vezető
  // mennyiségben (pl. "1 db kb. 1 kg-os T-bone steak") — ilyenkor ez a
  // beágyazott súly megbízhatóbb, mint egy "1 db"-re alkalmazott
  // általános darab-alapértelmezés.
  var embedded = name.match(EMBEDDED_WEIGHT_RE);
  if (embedded) {
    var n = parseFloat(embedded[1].replace(",", "."));
    return n * WEIGHT_UNITS[embedded[2].toLowerCase()];
  }
  // "2 cm-es darab gyömbér" — a "2" hosszt jelöl, nem darabszámot.
  if (/^cm\b/i.test(name)) return 10;
  // "..., 24 vékony szeletre vágva" / "8-10 darabra vágva" vágási utasítás, nem mennyiség.
  if (/^(\S+\s+)?(darabra|szeletre|részre|cikkre|kockára|csíkra|karikára)\b/i.test(name)) return 0;
  // "20 percig áztatva", "1 órára beáztatva" — idő, nem mennyiség.
  if (/^(percig|percre|órán|órára|órát|napig)\b/i.test(name)) return 0;
  var parsed = parseQuantityPhrase(qtyPhrase);
  if (!parsed) {
    // Nincs mennyiség megadva (pl. "só ízlés szerint", "olaj a sütéshez").
    // Sütéshez/kenéshez olajnál/zsírnál/vajnál ez a valóságban jelentősen
    // hozzáad a kalóriákhoz (serpenyőben jellemzően 1-2 evőkanálnyi), ezért
    // ott nagyobb, egyébként (fűszerek, ízlés szerinti tételek) kis fix
    // értékkel becsülünk.
    var lower = name.toLowerCase();
    if (/olaj|zsír|vaj/.test(lower) && /sütéshez|kenéshez|kikenéshez|bundázáshoz|forgatáshoz/.test(lower)) return 15;
    return 5;
  }
  var unit = parsed.unit || "db"; // "2 tojás" -> nincs explicit egység, db értendő
  // "1 konzerv (40 dkg) paradicsom", "2 konzerv (egyenként 40 dkg) bab" — a zárójeles súly darabonként értendő.
  if (!WEIGHT_UNITS[unit] && !VOLUME_UNITS[unit]) {
    var packed = name.match(/^(?:konzerv|doboz|csomag|üveg|tasak)\s*\([^)\d]*?(\d+(?:[.,]\d+)?)\s*(kg|dkg|g)\b/i);
    if (packed) return parsed.value * parseFloat(packed[1].replace(",", ".")) * WEIGHT_UNITS[packed[2].toLowerCase()];
  }
  if (WEIGHT_UNITS[unit] !== undefined) return parsed.value * WEIGHT_UNITS[unit];
  if (VOLUME_UNITS[unit] !== undefined) return parsed.value * VOLUME_UNITS[unit] * findDensity(name);
  // darab-alapú egységek
  var entry = findDbEntry(name);
  var perUnitG = (entry && entry.unitG && entry.unitG[unit]) || COUNT_UNIT_DEFAULT_G[unit] || 50;
  return parsed.value * perUnitG;
}

function parseServings(text) {
  var m = String(text || "").match(/^(?:kb\.\s*)?(\d+)(?:\s*-\s*\d+)?\s*([^\s(]+)?/);
  if (!m) return null;
  return { count: parseInt(m[1], 10) };
}

// Néhány recept egy tömbelemben, vesszővel felsorolva több hozzávalót ad
// meg, gyakran egy "a X-hez:" alcím-előtaggal (pl. "a palacsintához: 2 db
// tojás, 3 dl tej, 15 dkg liszt, csipet só, olaj a sütéshez"). Ha ezt
// egyetlen sorként kezelnénk, a splitIngredientLine csak az első
// mennyiséget (2 db) és a TELJES maradékot "névként" fogná be, a tej/
// liszt/olaj mennyisége (és jelentős kalóriatartalma) némán elveszne.
// Ezért minden sort vessző mentén darabokra bontunk, miután levágtuk az
// esetleges "…:" alcím-előtagot; a rosszul szétvágott, mennyiség nélküli
// töredékek (pl. egy leíró jelző) ártalmatlanok maradnak, mert a
// mennyiség nélküli ág amúgy is csak kis, fix értéket számol.
function expandIngredientLine(line) {
  var withoutLabel = line.replace(/^[^,:]{1,40}:\s*/, "");
  // Csak a zárójelen kívüli és nem két számjegy közötti vesszőnél vágunk:
  // "2,5 dl tej" tizedesvessző, "burgonya (fele lisztes, fele piros)" egy tétel.
  var parts = [], cur = "", depth = 0;
  for (var i = 0; i < withoutLabel.length; i++) {
    var ch = withoutLabel[i];
    if (ch === "(") depth++;
    else if (ch === ")") depth = Math.max(0, depth - 1);
    if (ch === "," && depth === 0 && !(/\d/.test(withoutLabel[i - 1] || "") && /\d/.test(withoutLabel[i + 1] || ""))) { parts.push(cur); cur = ""; continue; }
    cur += ch;
  }
  parts.push(cur);
  return parts.map(function (s) { return s.trim(); }).filter(Boolean);
}

function estimateRecipeCalories(recipe) {
  var totalKcal = 0;
  recipe.ingredients.forEach(function (rawLine) {
    expandIngredientLine(rawLine).forEach(function (line) {
      var parsed = splitIngredientLine(line);
      var grams = estimateLineGrams(parsed.qty, parsed.name);
      var entry = findDbEntry(parsed.name);
      if (!entry) {
        var key = parsed.name.toLowerCase();
        UNMATCHED[key] = (UNMATCHED[key] || 0) + 1;
      }
      var kcal100 = entry ? entry.kcal : 60; // ismeretlen hozzávaló -> szerény alapérték
      totalKcal += grams * kcal100 / 100;
    });
  });
  var serv = parseServings(recipe.servings);
  var count = serv && serv.count ? serv.count : 4;
  var perServing = totalKcal / count;
  // Józanész-korlát: egy edzésbeli hibás egység-becslés (pl. "20 db" apró
  // csokireszelék-rúd) könnyen irreális végeredményt adhat egyetlen
  // receptnél. Mivel 734 receptet nem lehet mind kézzel ellenőrizni, a
  // nyilvánvalóan valószínűtlen tartományon kívüli értéket a legközelebbi
  // hihető határra szorítjuk — ez csak védőháló, a normál receptek túlnyomó
  // többségénél sosem lép közbe.
  var clamped = Math.max(80, Math.min(1600, perServing));
  var wasClamped = Math.abs(clamped - perServing) > 1;
  var result = Math.round(clamped / 10) * 10;
  if (wasClamped) CLAMPED.push({ title: recipe.title, raw: Math.round(perServing), clamped: result });
  return result;
}

var CLAMPED = [];

module.exports = { estimateRecipeCalories: estimateRecipeCalories, UNMATCHED: UNMATCHED, CLAMPED: CLAMPED, splitIngredientLine: splitIngredientLine };
