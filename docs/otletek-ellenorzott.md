# Ötletek nemzetközi receptoldalakról (újra, ellenőrzött oldalak alapján)

Szabályok: magyar oldalak (Nosalty, Mindmegette stb.) nem minta. Receptszöveget nem másoltam, csak funkciókat. Jelölés: **ellenőrzött** = a WebFetch-csel megnyitott oldalon láttam (URL megadva); **ismeretből** = nem tudtam megnyitni, nem ellenőriztem.

## Mit sikerült megnyitni (WebFetch)

| Oldal | Mit néztem | Ellenőrzött funkciók |
|---|---|---|
| RecipeTin Eats | főoldal + https://www.recipetineats.com/chicken-curry/ | menü: fogás, konyha, módszer (Quick & Easy, One Pot, Slow Cooker), diéta, alkalom; gyűjtemények („15 Minute Meals”, „Winter Warmers”); „My RecipeTin” mentés; receptoldalon: ugrás a recepthez, nyomtatás, megosztás, külön előkészítés/főzés/összes idő, adag, érintésre/ráhúzásra adagátváltó, Cook Mode (nem alszik el a kijelző), 5 csillagos értékelés és hozzászólások, lépésfotók, videó, több megjegyzés (helyettesítés, módszerváltás), „Make it your own” rész, tápérték adagonként, kapcsolódó receptek |
| Jamie Oliver | https://www.jamieoliver.com/ + https://www.jamieoliver.com/recipes/chicken-recipes/chicken-tikka-masala/ | gyűjtemények hozzávaló, fogás, speciális étrend, idő szerint („15/20 perces ételek”), családi ételek; diétajelvények (v, gf); mentés fiókkal; receptoldalon nehézségi szint („Not Too Tricky”), adag, idő, tápérték a napi szükséglet százalékában (kalória és fehérje) |
| King Arthur Baking | https://www.kingarthurbaking.com/recipes | 25+ gyűjtemény, szezonális válogatás („Fall Favorites”), „Make-Ahead Breakfast”, „Baking with Kids”, „Bake of the Week”, csillagos értékelés a kártyán, Recipe Box, hozzávaló-súlytáblázat. (Receptoldal 404 volt.) |
| Minimalist Baker | https://minimalistbaker.com/ | diétarövidítések (GF, VG, V, DF, NS) a címkéken, „What's In Season”, „Pick of the Week”, „Recent Reader Favorites”, tematikus összeállítások. (Receptoldal 404.) |
| Pinch of Yum | https://pinchofyum.com/ + https://pinchofyum.com/category/recipes/meal-prep | kategóriák számlálóval (Quick and Easy 501, Meal Prep 40, Instant Pot 38, Kid-Friendly), meal prep oldal alcsoportokkal (legjobbra értékelt / egészséges / vegetáriánus / könnyű), értékelés és vélemények száma a kártyán |
| Smitten Kitchen | https://smittenkitchen.com/ | címkék: olcsó, gyors, gyerekkedvenc, hétköznap; szezonális; „Popular Right Now”; „Cooking Conversions” oldal; archívum hónap szerint |
| Ottolenghi | https://ottolenghi.co.uk/recipes | szűrők: fogás, főhozzávaló, évszak/alkalom (Midweek, Weekend Projects, BBQ, Christmas), gyűjtemény (Easy, Vegetarian, Comfort); regisztráció: mentés + heti e-mail |
| Tasty | https://tasty.co/ | hétköznapi vacsorák gyűjtemény, szűrés hozzávaló/diéta/étkezés szerint, „What You're Making” (olvasók fotói), saját recept beküldése, tippek rovat. (Receptoldal 404.) |
| Cookpad (JP) | https://cookpad.com/ + bento keresés | hozzávaló szerinti keresés, népszerű hozzávalók/ételek, hetente frissülő kurált heti menü, „tsukurepo” (megfőztem + visszajelzés számláló a kártyán), finomított keresés: szűrés a „megfőzték” számra (1+/10+/100+/1000+) és kizárandó hozzávaló, bento-gyűjtemény stílusok szerint (onigiri, tamagoyaki, leveses üveg…) |

## Nem sikerült megnyitni (a szerszám tiltotta vagy 403)
BBC Good Food, Serious Eats, NYT Cooking, Allrecipes, Epicurious, Bon Appétit, Delish, Chefkoch, Marmiton (a letöltő nem engedte), Budget Bytes, Skinnytaste, Food52, The Kitchn (403), Yummly (átirányít a KitchenAid-re, időtúllépés). Ezek funkcióit csak ismeretből írom, kifejezetten jelölve.

## Már megvan az oldalon (ezért nem javaslom)
Napi ajánló, „Mi van itthon?” (hozzávaló-keresés, fotó a hűtőről), Könnyű sütik, Kedvenceim, Heti menü (előre főzés több napra), Bevásárlólista, Közeli boltok, Hasznos tanácsok, Alapok kezdőknek, Recept beküldése; adagátszámolás; nyomtatás; megosztás; kalória és fehérje a kártyán; intolerancia/kalóriacél/fehérjecél profilok; címkék (Kezdőknek is megy, Egyszerű, Nem kell főzni, Grillen is, Előkészítés szükséges, Hétvégi projekt, Munkába is vihető, Hosszú életért); idő- és étkezés-szűrő. **Főzés mód már tud:** kipipálható hozzávalók, koppintható lépések, lépés-időzítő (⏱, hangjelzés), kijelző ébrentartás. Ezért az időzítő/cook mode ötletet törölve.

## Rangsorolt ötletek

1. **Gyors gyűjtemény-gombok: „15 perces”, „30 perces”, „egy fazékban”** a keresőben (a `time` mezőből és kulcsszavakból; mellettük a találatok száma). Oldalak: RecipeTin Eats „15 Minute Meals”, „One Pot” (ellenőrzött, recipetineats.com); Jamie Oliver 15/20 perces gyűjtemények (ellenőrzött, jamieoliver.com); Pinch of Yum számlálós kategóriák (ellenőrzött). Miért: munka után 30 perc a valós keret; mosogatás is spórolás. Van-e már: időkorlát-szűrő van, kész gombok és „egy fazék” nincs. **S**
2. **Szezonális gyűjtemény a mai dátum szerint** (tavasz: spárga, saláták; nyár: lecsó, hideg levesek; ősz: tök, gomba; tél: káposzta, hüvelyes). Oldalak: Minimalist Baker „What's In Season”, King Arthur „Fall Favorites”, Ottolenghi évszak-szűrő, Smitten Kitchen (mind ellenőrzött). Miért: olcsóbb, friss, a magyar konyha szezonális. Van-e már: nincs. **M** (kulcsszavas jelölés + kézi átnézés)
3. **Kategória-sorok számlálóval és al-csoportokkal a „Munkába is vihető” köré** (legkönnyebb / egészséges / vegetáriánus / legolcsóbb / fagyasztható). Oldal: Pinch of Yum Meal Prep oldal (ellenőrzött); Cookpad bento-stílusok (ellenőrzött). Miért: az előre főzők így hamar találnak. Van-e már: a címke és a szűrő van, az al-csoportok nincsenek. **S**
4. **Diétajelvények a kártyán: vegetáriánus, tejmentes, gluténmentes, tojásmentes** (óvatos „becsült” felirattal). Oldalak: Minimalist Baker GF/VG/V/DF (ellenőrzött); Jamie Oliver v/gf jelvények (ellenőrzött). Miért: sok családban van korlátozás. Van-e már: intolerancia-szűrő van profilokhoz, látható jelvény nincs. **M** (a pontatlanság kockázat: a README óvatos fogalmazásához igazodni kell)
5. **Tápérték a napi szükséglet százalékában** (kalória és fehérje a profil célja alapján). Oldal: Jamie Oliver receptoldal (ellenőrzött). Miért: a `calories` és `proteinGrams` már megvan, a százalék érthetőbb. Van-e már: nyers szám van, százalék nincs. **S**
6. **Megfőztem-jelző és saját értékelés helyben mentve** (csillag, „legutóbb ekkor főztem”, kártyán megfőzések száma). Oldalak: Cookpad „tsukurepo” számláló és szűrés megfőzések száma szerint (ellenőrzött); RecipeTin Eats csillagok/hozzászólások (ellenőrzött); Tasty „What You're Making” (ellenőrzött, fotó). Miért: elkerüli, hogy ugyanaz jöjjön; szerver nélkül működik. Van-e már: Kedvencek van, értékelés/előzmény nincs. **M** (közös, mások által látott változat: **L**, szerver kell)
7. **Személyes jegyzet a recepthez** („kevesebb sót tettem”) helyben mentve. Oldal: RecipeTin Eats „Notes” és „Make it your own” szakasz (ellenőrzött); a jegyzet a felhasználóé lenne. Miért: családi változatok megőrzése. Van-e már: nincs. **S**
8. **„Make it your own” helyettesítési sor a receptek alján** (nincs tejföl: joghurt; nincs csirke: tofu/gomba). Oldal: RecipeTin Eats (ellenőrzött). Miért: kevesebb extra bolt. Van-e már: nincs; kézi tartalom, előbb a legnépszerűbb 100 receptre. **L**
9. **Alkalom-gyűjtemények: hétköznapi / hétvégi / ünnepi (karácsony, húsvét), grill, piknik**. Oldalak: Ottolenghi Midweek / Weekend Projects / BBQ / Christmas (ellenőrzött); RecipeTin Eats alkalmak (ellenőrzött). Miért: a hétvégi projekt címke már van, az ünnepi tervezés hiányzik. **M**
10. **Gyerekbarát gyűjtemény** („Kid-Friendly”, „Baking with Kids”). Oldalak: Pinch of Yum (ellenőrzött), Smitten Kitchen „kid favorites” (ellenőrzött), King Arthur „Baking with Kids” (ellenőrzött). Miért: családoknak. Van-e már: nincs. **S-M** (kulcsszó + kézi válogatás)
11. **Mértékegység-oldal / átváltó** (dkg, dl, evőkanál, csésze, sütőfokok) és hozzávaló-súlytáblázat (liszt, cukor, vaj). Oldalak: Smitten Kitchen „Cooking Conversions” (ellenőrzött); King Arthur hozzávaló-súlytáblázat (ellenőrzött). Miért: sok recept dkg-ban van, külföldi receptekhez kell. Van-e már: nincs. **S**
12. **Hozzávaló szerinti böngészés** (csirke, hal, tojás, tészta, rizs, hüvelyes, zöldség – kattintható sor). Oldalak: Ottolenghi főhozzávaló-szűrő (ellenőrzött); Jamie Oliver hozzávaló szerinti gyűjtemények (ellenőrzött); Cookpad népszerű hozzávalók (ellenőrzött). Miért: kevesebb gépelés, mint a kereső. Van-e már: a „Mi van itthon?” kereső szöveges. **S**
13. **Témás heti menük** („halas hét”, „olcsó hét”, „gyors hét”, „hüvelyes hét”) a heti menü generátorában. Oldal: Cookpad hetente frissülő kurált heti menü (ellenőrzött). Miért: a tervezés egy kattintás. Van-e már: heti menü generálás van, téma-előbeállítás nincs. **M**
14. **Heti menü kimentése naptárba (.ics) vagy e-mail-vázlatba**. Oldal: Ottolenghi heti e-mail (ellenőrzött); RecipeTin Eats hírlevél (ellenőrzött). Miért: nincs fiók nélkül is megkapja a telefon. Van-e már: nyomtatás van, naptár/e-mail nincs. **S-M**
15. **Nehézségi jelzés három fokozattal** (könnyű / közepes / ráérős), a meglévő címkékből levezetve. Oldal: Jamie Oliver „Not Too Tricky” (ellenőrzött). Miért: kezdőknek biztonság. Van-e már: „Kezdőknek is megy” és „Egyszerű” van, de két fokozat; három fokozatú felirat új. **S**
16. **„Népszerű most” / „Olvasói kedvencek” sáv a Kedvencek és megfőztem adatokból** (helyi). Oldalak: Smitten Kitchen „Popular Right Now”, Minimalist Baker „Recent Reader Favorites” (ellenőrzött). Miért: gyors ötlet. Van-e már: Napi ajánló van; ez saját előzményből menne. **M**
17. **Szűrés „legalább X-szer megfőzték” / rejtés, amit már megcsináltál** (a megfőztem-adatból). Oldal: Cookpad finomított keresés (ellenőrzött). Miért: friss ötlet kell. **S** (a 6. ötletre épül)
18. **Költség-kategória adagonként** (olcsó / közepes / drágább). Oldal: Budget Bytes (ismeretből, nem sikerült megnyitni). Miért: a magyar háztartásban a pénz számít. **M**
19. **Fagyasztható jelzés + tárolási idő a kártyán**. Oldalak: Skinnytaste Meal Prep, BBC Good Food batch cooking (ismeretből, nem nyílt meg). Miért: hétvégén többnapra főzőknek. Van-e már: a `keepsWell` és a lépésben szereplő hűtőidő van, fagyasztás nincs. **M**
20. **„Ugrás a recepthez” és nyomtatás-barát nézet** — megvan nyomtatás; ugrás nem kell (nincs blogszöveg). Elvetve.

Törölve ezekből: időzítők és cook mode (megvan), magyar oldalakról származó ötletek, Serious Eats / Epicurious / NYT „kiegészítő” ötletek, amiket nem tudtam ellenőrizni.

## Top 10 (érték / munka)
1. Gyors gyűjtemény-gombok (15/30 perces, egy fazékban) — #1
2. Szezonális gyűjtemény — #2
3. Meal prep al-csoportok számlálóval — #3
4. Mértékegység-oldal — #11
5. Tápérték a napi szükséglet százalékában — #5
6. Megfőztem-jelző és saját értékelés — #6
7. Személyes jegyzet — #7
8. Hozzávaló szerinti böngészés — #12
9. Témás heti menük — #13
10. Gyerekbarát és alkalom-gyűjtemények — #10, #9
