# Kalória-becslő szkript

Hozzávaló-alapú, offline kcal/adag becslést ad azoknak a recepteknek,
amelyeknek még nincs `calories` mezője (a meglévőket sosem írja felül).

## Használat

```
node apply.js
```

Beolvassa a repo gyökerében lévő `index.html`-t, a `var RECIPES = {...}`
tömböt, minden `calories` nélküli receptnél kiszámolja és beírja a
becsült értéket, majd visszaírja a fájlt. Új recepték hozzáadása után
egyszerűen futtatható újra — a már meglévő `calories` mezőket kihagyja.

## Hogyan működik (`estimate.js`)

1. Minden hozzávaló-sort (`recipe.ingredients`) vessző mentén szétbont
   (néhány recept egy tömbelemben több hozzávalót sorol fel, pl.
   `"a töltelékhez: 2 db tojás, 3 dl tej, 15 dkg liszt"`), és levágja az
   esetleges `"...:"` alcím-előtagot.
2. Minden darabból mennyiséget+egységet+nevet bont (ugyanaz a minta, mint
   az app saját bevásárlólista-összesítőjében).
3. Grammra vált: súly-egységek közvetlenül, térfogat-egységek egy
   hozzávalónkénti sűrűség-táblával (`DENSITY`), darabszám-egységek
   (db/fej/gerezd/szelet/szál/szem/csokor/köteg/marék/adag) egy
   hozzávalónkénti jellemző súllyal (`db.js` `unitG` mezője, ahol van;
   különben `COUNT_UNIT_DEFAULT_G` alapértelmezés).
4. Egy kb. 200 hozzávalót lefedő, kulcsszó-egyezéses (substring, a
   legspecifikusabb kulcsszótól az általánosig rendezve) kcal/100g
   adatbázisból (`db.js`) megszorozza és összegzi.
5. Elosztja a recept adagszámával (`servings` mezőből kinyerve).
6. Az eredményt egy [80, 1600] kcal/adag tartományra szorítja, hogy egy
   szokatlan megfogalmazás (pl. mennyiség nélküli vagy a névbe ágyazott
   súlyú hozzávaló) se adhasson nyilvánvalóan irreális végeredményt.

## Ha bővíteni kell

Új konyha/recept hozzáadása után a `node apply.js` újrafuttatása
automatikusan kitölti az új receptek kalóriaértékét. Ha a `db.js`
adatbázisban egy gyakori hozzávaló hiányzik (ismeretlen hozzávalóknál a
becslés egy szerény 60 kcal/100g alapértéket használ, ami alulbecsülhet),
érdemes előbb futtatni egy gyors diagnosztikát a hiányzó kulcsszavakról —
lásd a `estimate.js` `UNMATCHED` exportját (egy kis segédszkripttel
kilistázható, melyik hozzávaló-nevek nem találtak egyezést egyszer sem).

**Korlátok** (lásd a fő README "Kalóriaérték minden receptnél" szakaszát
is): ez tájékoztató, hozzávaló-alapú becslés, nem konyhai
mérlegpontosságú vagy laboratóriumi adat. Kb. a receptek 5%-ánál lépett
közbe a [80, 1600] tartomány-korlát — ezeknél a becslés kevésbé
megbízható (gyakran mennyiség nélkül felsorolt, vagy szokatlanul
megfogalmazott hozzávalók miatt).
