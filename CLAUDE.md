# Napi receptajánló – útmutató a fejlesztéshez

Magyar nyelvű napi receptajánló oldal (GitHub: Menyuswin/menyus-napi-recept-ajanlo, ág: `main`). Egyetlen `index.html` (JS és CSS bent), angol változat (`?lang=en`), nincs build lépés. Részletes leírás: `README.md`.

## Szabályok
- **Commit és push csak a felhasználó jóváhagyásával**, minden alkalommal külön. Válaszok, szövegek magyarul.
- A meglévő recepteket **nem írjuk át** („Ne minden receptet írd át, csak legyenek ilyenek is”): új recept bővít, a jelölések (címkék) új mezők.
- Pácolási idő **nem számít bele** az összidőbe (külön `marinate` mező).
- Nagy képcsomagot **60 fájlos commitokban** pusholj, az egyben küldött 240 kép megszakadt.
- Magyar receptoldalakat (Nosalty, Mindmegette) nem használunk mintának; receptszöveget nem másolunk, csak szabad licencű forrást (Wikibooks CC BY-SA, forrásmegjelöléssel).
- Fogalmazás: egyszerű, tárgyszerű magyar. A kalória, a költség, a diéta jelölése mindig „becsült”.

## Adat (`index.html`)
- Az összes recept egy sorban: `  var RECIPES = {...};` (konyha → hely → tömb). Csak `JSON.stringify`-jal írd vissza, mást ne változtass a soron. Ne nyomtasd ki egészben.
- Konyhák: polish, southslavic, hungarian, italian, greek, french, american, indian, chinese, japanese. Helyek: `breakfast`, `lunch`, `dinner` (a napi és heti menü csak ezeket használja) és `sweet` (Könnyű sütik fül, külön).
- Azonosító: `konyha--slug(cím)`, a slug: NFD, ékezetek le, `œ`→`oe`, nem betű/szám → `-`.
- Mezők: `title, time, servings, marinate?, ingredients, steps, noCook, easy, keepsWell?, lunchbox?, longevity?, freezable?, source?, image?, calories, proteinGrams`. A hozzávalók sora mennyiséggel kezdődik (kivéve „só, bors”).
- Jelenleg 1370 recept (1170 étkezési + 200 süti). A „Hosszú életért (longevity)” címke szabálya a README-ben van (kulcsszavas, 178 recept). A „Fagyasztható” címke (`freezable`, 400 recept) szabálya is a README-ben van: típus a címből, kizáró szavak erősebbek; a tárolási szöveg a címből számolódik (`FREEZE_KINDS`).
- Kalória és fehérje: `node tools/kcal-estimate/apply.js` csak a hiányzó `calories` és `proteinGrams` (becsült g/adag, mind a 1370 recept) mezőt tölti ki; a becslő kézzel javítható. „Magas fehérjetartalmú” címke és gomb (180 recept): `isHighProtein()` az `index.html`-ben, nincs kézi jelölés; küszöb a README-ben.

## Angol változat
- `i18n/en-ui.js`: kulcs = a magyar felületi szöveg. Új magyar szöveghez angol is kell; ellenőrzés: `node tools/i18n-check.js` (0 hiányzó, 1370/1370 recept).
- `i18n/en-recipes.js`: receptfordítások azonosító szerint, egy generáló szkripttel készült (a munkamenet ideiglenes mappájából; újrafordításhoz szkriptet kell írni az `en/batch-*.json` mintára).

## Képek
- Canva-ban generált, 800×600 WebP, `img/receptek/<konyha>-<slug>.webp`, a recept `image` mezője erre mutat.
- A munka **szünetel** (Canva-kvóta). Kb. 781 recepthez van kép, kb. 589-hez (353 étkezési, 200 süti, 36 longevity) még nincs. Folytatás: a felhasználó emlékeztető memóriájában (`project_napi_image_job.md`) és a `napi-image-job/` mappában vannak a listák és a szkriptek. Sonnet alügynökkel érdemes végezni, 3–5 képet egyszerre.

## Tesztek
- Nincs hivatalos tesztkészlet; a munkamenetekben jsdom-os szkriptek futottak (oldalbetöltés, szűrők, fülek, angol oldal, i18n). Új funkciónál hasonló tesztet írj, és futtasd az `i18n-check`-et.

## Ötletek
- A nemzetközi receptoldalak alapján összeállított ötletlista (29 ötlet, ellenőrzött és ismeretből jelölve): a repóban: `docs/otletek-ellenorzott.md` (19 ellenőrzött) és `docs/otletek-eredeti-23.md` (archív). Elkészült: magas fehérjetartalmú gyűjtemény és fehérjebecslés, fagyasztható jelzés, gyors idő- és edénygombok, mértékegység-átváltó, „Munkába is vihető” alcsoportok, heti tápérték, „Nálam van” chipek, maradék gombok, napi szükséglet %, alapanyag szerinti böngészés, témás heti menük (9 téma, tartalék szabállyal; `WEEK_THEMES` az `index.html`-ben).
- Még nincs meg (példák): diétajelvények, költségkategória, „megfőztem” jelző, személyes jegyzet, szezonális gyűjtemény, gyerekbarát gyűjtemény, naptárba mentés.
