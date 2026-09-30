#!/usr/bin/env node
// Az angol változat ellenőrzése, függőség nélkül: node tools/i18n-check.js
// - receptek: van-e fordítás minden recepthez, és egyezik-e a hozzávalók/lépések száma (ha nem, az oldal magyarul mutatja);
// - felület: minden t("...") kulcs és statikus HTML-szöveg szerepel-e az i18n/en-ui.js-ben.
// Kilépési kód 1, ha hiányzik valami.
var fs = require("fs"), path = require("path"), vm = require("vm");
var root = path.join(__dirname, "..");
var html = fs.readFileSync(path.join(root, "index.html"), "utf8");

var sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, "i18n/en-ui.js"), "utf8"), sandbox);
vm.runInNewContext(fs.readFileSync(path.join(root, "i18n/en-recipes.js"), "utf8"), sandbox);
var UI = sandbox.window.I18N_EN_UI || {}, TR = sandbox.window.I18N_EN_RECIPES || {};
var has = function (o, k) { return Object.prototype.hasOwnProperty.call(o, k); };

// Receptek — ugyanaz az azonosító, mint a recipeId() az index.html-ben.
var line = html.split("\n").find(function (l) { return l.trimStart().indexOf("var RECIPES = ") === 0; });
var RECIPES = JSON.parse(line.trim().replace(/^var RECIPES = /, "").replace(/;\s*$/, ""));
function slugify(s) {
  return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/œ/g, "oe").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
var missing = [], mismatch = [], ids = {};
Object.keys(RECIPES).forEach(function (ck) {
  Object.keys(RECIPES[ck]).forEach(function (meal) {
    RECIPES[ck][meal].forEach(function (r) {
      var id = ck + "--" + slugify(r.title);
      ids[id] = true;
      var e = TR[id];
      if (!e) { missing.push(id + "  (" + r.title + ")"); return; }
      var why = [];
      if (!e.ingredients || e.ingredients.length !== r.ingredients.length) why.push("hozzávalók " + (e.ingredients || []).length + " / " + r.ingredients.length);
      if (!e.steps || e.steps.length !== r.steps.length) why.push("lépések " + (e.steps || []).length + " / " + r.steps.length);
      if (r.marinate && !e.marinate) why.push("hiányzik a marinate");
      if (why.length) mismatch.push(id + ": " + why.join(", "));
    });
  });
});
var orphans = Object.keys(TR).filter(function (id) { return !ids[id]; });

// Felület
var keys = {};
function add(k, exact) { if (!exact) k = k.trim(); if (k && /[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]/.test(k)) keys[k] = true; }
var scripts = [], m, re = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g;
while ((m = re.exec(html))) scripts.push(m[1]);
var js = scripts.join("\n");
var reT = /[^\w.]t\("((?:[^"\\]|\\.)*)"/g;
while ((m = reT.exec(js))) add(JSON.parse('"' + m[1] + '"'), true); // t() keresi pontosan, szóközökkel együtt
var body = html.slice(html.indexOf("<body"), html.lastIndexOf("</body>"))
  .replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "").replace(/<!--[\s\S]*?-->/g, "");
var decode = function (s) { return s.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#10;/g, "\n"); };
body.split(/<[^>]+>/).forEach(function (s) { add(decode(s)); });
var reA = /\s(?:placeholder|aria-label|title|alt)="([^"]*)"/g;
while ((m = reA.exec(body))) add(decode(m[1]));
var uiMissing = Object.keys(keys).filter(function (k) { return !has(UI, k); });

var total = Object.keys(ids).length;
console.log("Receptek: " + (total - missing.length) + " / " + total + " lefordítva");
function list(title, arr) { if (arr.length) { console.log("\n" + title + " (" + arr.length + "):"); arr.forEach(function (x) { console.log("  " + x); }); } }
list("Nincs angol fordítás", missing);
list("Eltérő szerkezet (magyarul jelenik meg)", mismatch);
list("Fordítás, amelyhez már nincs recept (átnevezett cím?)", orphans);
console.log("Felület: " + Object.keys(keys).length + " szöveg, " + uiMissing.length + " hiányzik az i18n/en-ui.js-ből");
list("Hiányzó felületi szövegek", uiMissing);
process.exit(missing.length || mismatch.length || uiMissing.length ? 1 : 0);
