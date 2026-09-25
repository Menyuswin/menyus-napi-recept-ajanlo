# Napi recept ajánló

Egyoldalas alkalmazás: minden nap ajánl egy-egy **reggelit, ebédet és
vacsorát**, kilenc konyha közül válogatva — olasz, francia, amerikai,
lengyel, délszláv, görög, magyar, indiai és kínai. Minden recept magyarul
jelenik meg, igény szerint
személyre szabva (kor, testsúly, nem, ételintolerancia, fehérjecél). Nincs
build-lépés, nincs backend — statikus oldal, ami a böngészőből közvetlenül
hív külső, ingyenes API-kat.

## Adatforrás

Eredetileg nem volt egyetlen ingyenes adatbázis sem, amely mind a hét
konyhát pontosan, magyarul lefedte volna, ezért az oldal két forrást
kevert: élő Spoonacular-recepteket és kézzel írt recepteket. Mára a
kézzel írt oldal annyira kibővült (dokumentum-feldolgozás és webes
kutatás útján), hogy **minden konyha minden étkezése kézzel írt** —
élő Spoonacular-hívás jelenleg nincs az oldalon. Az élő-lekérdezés kódja
(proxy, fordítás, kalória-/fehérjecél-küldés a Spoonacularnak) a helyén
maradt, dormant állapotban — ha egy `curatedSlots` beállítást
visszaállítanál, vagy egy nyolcadik konyhát adnál hozzá élőben, azonnal
újra működne, de jelen állapotban egyetlen kártya sem hívja.

- **Francia** — 40 kézzel írt reggeli (tartine-ok, croissant, pain au
  chocolat, brioche, kouign-amann, madeleine, œufs cocotte, omlettek,
  croque-monsieur/-madame, quiche, crêpe, galette, pain perdu), 107
  kézzel írt ebéd (salade lyonnaise, velouté-k, quiche-k és sós piték,
  jambon-beurre és társai, hajdinagalette-ek, gratinek, œufs mimosa,
  terrine-ek és pástétomok, aligot, socca, choucroute stb. — webes
  kutatás alapján) és 20 kézzel írt vacsora (Ratatouille, Coq au Vin,
  Boeuf Bourguignon, Cassoulet, Duck Confit, Bouillabaisse stb.), magyar
  nyelven. `curatedSlots: ["breakfast", "lunch", "dinner"]`.
- **Olasz** — mindhárom étkezés kézzel írt. A vacsora (20 recept: Spaghetti
  alla Carbonara, Risotto ai Funghi, Ossobuco alla Milanese, Lasagne al
  Forno, Saltimbocca, Porchetta stb.) volt meg először; a reggeli (15:
  cornetti, crostata di frutta, maritozzo, torta della nonna, granita di
  mandorla con brioche stb.) és az ebéd (15: spaghetti al pomodoro,
  amatriciana, pesto alla Genovese, pasta alla Norma, risotto alla
  Milanese, focaccia Genovese stb.) webes kutatás alapján összeállítva
  készült el utólag. `curatedSlots: ["breakfast", "lunch", "dinner"]`,
  nincs élő Spoonacular-hívás ennél a konyhánál sem.
- **Amerikai** — mindhárom étkezés (reggeli, ebéd, vacsora) kézzel írt,
  15-15 klasszikus amerikai recepttel (amerikai palacsinta, cheeseburger,
  BLT, déli sült csirke, pulled pork, barbecue-csirke, hálaadási
  pulykamell, jambalaya stb.), becsült kalóriaértékkel.
  `curatedSlots: ["breakfast", "lunch", "dinner"]`, nincs élő
  Spoonacular-hívás ennél a konyhánál.
- **Görög** — szintén mindhárom étkezés kézzel írt, 15-15 hiteles görög
  recepttel (webes kutatás alapján összeállítva): reggelire pl. görög
  joghurt mézzel, sztrapatszada, bugatsa, tiropita, koulouri, loukoumades;
  ebédre horiatiki saláta, tzatziki, szpanakopita, fakész és fasolada
  leves, dolmadesz, csirkés szuvlaki, melitzanoszaláta; vacsorára
  muszaka, pasztíció, gemísztá, sztifádó, kleftikó, gyros, citromos-
  oregánós sült bárány/csirke, garidesz szaganaki, youvetsi.
  `curatedSlots: ["breakfast", "lunch", "dinner"]`, nincs élő
  Spoonacular-hívás ennél a konyhánál sem.
- **Indiai** — mindhárom étkezés kézzel írt, 15-15 hiteles indiai recepttel
  (webes kutatás alapján összeállítva): reggelire pl. poha, upma, idli
  szambárral, uttapam, aloo paratha, dhokla, thepla; ebédre dal fry, chana
  masala, rajma, aloo gobi, palak paneer, szambár, rasam, paneer tikka;
  vacsorára Butter Chicken, Chicken Biryani, Rogan Josh, Dal Makhani,
  Tandoori Chicken, Chicken Korma, Saag Gosht. `mode: "curated"` — ez és a
  kínai konyha eleve sosem volt Spoonacularon élőben, nincs `curatedSlots`
  mező, csak a korábbi lengyel/délszláv/magyar mintát követi.
- **Kínai** — szintén mindhárom étkezés kézzel írt, 15-15 hiteles kínai
  recepttel (webes kutatás alapján összeállítva): reggelire pl. congee,
  youtiao, baozi, jianbing, xiaolongbao, cheung fun, mantou; ebédre wonton
  leves, chow mein, jangzsoui sült rizs, dan dan noodles, zhajiangmian,
  jiaozi, gőzölt hal; vacsorára Kung Pao Chicken, Mapo Tofu, Peking Duck,
  Hong Shao Rou, Char Siu, General Tso's Chicken. `mode: "curated"`.
- **Lengyel, délszláv, magyar** — kézzel, magyarul írt recept-készlet marad.
  A Spoonacularban ugyanis nincs ezekre a régiókra bontott kategória —
  mindhármat egy általános "kelet-európai" csoportba sorolná —, ezért itt a
  saját válogatás pontosabb és megbízhatóbb, mint amit egy élő API adna. A
  magyar konyha egy 1920-as évekbeli magyar háztartási könyv,
  Bánffyhunyadi Hunyady Erzsébet *A jó házi konyha* (MEK) átnézésével bővült
  179 receptre. A lengyel és délszláv konyhához nem volt feldolgozható,
  szabadon elérhető digitalizált könyv, ezért ezt a két konyhát hiteles,
  ténylegesen létező fogásokkal bővítettük tovább (56, illetve 57 recept) —
  a délszláv "gyűjtőkonyha" szándékosan vegyes: szerb, horvát, bosnyák,
  szlovén, macedón és bolgár eredetű ételeket is tartalmaz.

### Spoonacular-hozzáférés (jelenleg nincs használatban)

Mivel minden konyha minden étkezése kézzel írt, jelenleg **egyetlen
kártya sem** hív élő Spoonacular-adatot — ez a szakasz azért maradt meg,
mert a kód (proxy, fordítás) még mindig a helyén van, és bármikor
visszakapcsolható, ha egy `curatedSlots`-ot visszaállítanál, vagy egy
nyolcadik konyhát élőben adnál hozzá. Amíg ez nem történik meg, a
látogatóknak semmit nem kell beállítaniuk. Aktív állapotban az oldal egy
megosztott proxyn (Cloudflare Worker) keresztül érné el az API-t, a
kulcs kizárólag a Worker
titkos változójában él, egyetlen látogató böngészőjébe sem kerül. (Korábban
a Beállításokban saját kulcsot is meg lehetett adni; ez a lehetőség
megszűnt, a böngészőkben maradt régi kulcsokat az oldal törli.)

**Fontos, amit tudni érdemes (ha valaha újra aktiválnád)**: a Spoonacular
ingyenes kerete (kb. 150 pont/nap) az összes látogató között oszlik meg.
A proxy gyorsítótára sokat spórol, de nagy forgalomnál a keret egy nap
alatt elfogyhat — ilyenkor az oldal jelzi, hogy a mai közös keret
elfogyott, és aznapra csak a kézzel írt (jelenleg: az összes) konyha
ajánlása működik. Egy publikus repóba sosem szabad közvetlenül beleírni
a kulcsot — a GitHub kulcsvadász botjai percek-órák alatt megtalálják és
ellopják.

### Megosztott API-proxy (az oldal tulajdonosának szól — jelenleg nem kell hozzá, ha nem aktiválsz élő konyhát)

Élő konyhákhoz egy ingyenes [Cloudflare Workers](https://workers.cloudflare.com/)
proxy kell — ez egy apró háttérszolgáltatás, ami a Te
kulcsoddal egészíti ki a kéréseket, mielőtt továbbküldi a Spoonacularnak,
így a kulcs sosem kerül a böngészőbe. A proxy kódja a repóban van:
[`spoonacular-proxy-worker.js`](./spoonacular-proxy-worker.js).

Lépésről lépésre (kb. 5-10 perc, nem igényel programozói tudást):

1. Regisztrálj egy ingyenes fiókot a [dash.cloudflare.com](https://dash.cloudflare.com/sign-up) oldalon (ha még nincs).
2. A bal oldali menüben válaszd a **Workers & Pages**-t, majd kattints a **Create** / **Create Worker** gombra.
3. Adj neki egy nevet (pl. `napirecept-proxy`), és hozd létre — Cloudflare generál egy alapértelmezett kódot.
4. A Worker szerkesztőjében (Edit code / Quick edit) **töröld ki** az alapértelmezett kódot, és **másold be helyette** a repóban lévő [`spoonacular-proxy-worker.js`](./spoonacular-proxy-worker.js) fájl teljes tartalmát, majd mentsd/telepítsd (**Save and deploy**).
5. Menj a Worker **Settings → Variables and Secrets** (vagy régebbi felületen **Environment Variables**) menüpontjára, és adj hozzá egy új változót:
   - Név: `SPOONACULAR_API_KEY`
   - Érték: a saját, ingyenes Spoonacular API-kulcsod
   - Típus: **Secret** (titkosított, ha van ilyen választási lehetőség — így a Cloudflare felületén sem látszik utólag)
   - Mentsd el (Save / Deploy).
   - *Opcionális, de ajánlott — gyorsítótár:* a bal menüben **Storage & Databases → Workers KV → Create** (vagy **Create instance**), név pl. `napirecept-cache`. Utána a Worker oldalán **Bindings → Add binding → KV namespace**: a változó neve (Variable name) legyen pontosan `RECIPE_CACHE`, a tároló a most létrehozott `napirecept-cache`. Így ugyanazt a lekérdezést 6 órán belül a Worker a tárolóból szolgálja ki, és nem fogy vele a Spoonacular napi kerete. Enélkül is működik, csak gyorsabban fogy a keret.
6. A Worker oldalán megjelenik egy URL, valami ilyesmi: `https://napirecept-proxy.<a-te-cloudflare-felhasználóneved>.workers.dev`. Másold ki ezt a linket.
7. Nyisd meg az `index.html` fájlt, keresd meg ezt a sort:
   ```js
   var SHARED_PROXY_BASE = "";
   ```
   és írd be közé az idézőjelek közé a 6. lépésben kimásolt URL-t (a végén perjel nélkül), pl.:
   ```js
   var SHARED_PROXY_BASE = "https://napirecept-proxy.pelda-felhasznalo.workers.dev";
   ```
8. Mentsd el, commitold és push-old a változtatást a `main` ágra (ha nem magad csinálod, kérd meg, akitől a fejlesztést kéred, hogy tegye meg).

A jelenlegi, működő proxy címe:
`https://napirecept-proxy.nyugatioldalon.workers.dev` (a KV-gyorsítótárral
együtt be van állítva). Ha a Worker kódja a repóban változik, az új
tartalmat a Cloudflare szerkesztőjébe is be kell másolni és telepíteni.

## Személyre szabás

A Beállítások panelen felvehetsz **célszemélyeket** (pl. családtagokat):
név, kor, testsúly, nem, fehérjedús étrend igénye, napi kalóriacél,
ételintolerancia (tejtermék, tojás, glutén, földimogyoró stb.). A "Kinek
főzöl ma?" chipek közül mindig egy aktív — az oldal az ő adatai szerint
szűr, amíg másikra nem váltasz (vagy "Mindenkinek / nincs profil"-ra, ami
kikapcsolja a szűrést).

Az alábbi négy szűrő leírása kitér arra is, hogyan viselkedne egy élő
(Spoonacular-os) konyhánál/étkezésnél — jelenleg ilyen nincs (lásd
"Adatforrás" fent), úgyhogy a gyakorlatban mindenhol a kézzel írt ág fut:

- **Intolerancia**: élő (Spoonacular-os) konyhánál/étkezésnél az API
  saját, pontos szűrője érvényesülne. A kézzel írt recepteknél (jelenleg
  mindenhol) az oldal a hozzávalók szövegében keres kulcsszavakat (pl.
  "tej", "liszt", "dió") — ez **tájékoztató jellegű becslés**, nem
  klinikai pontosságú. Ha a kiválasztott intoleranciának egy adott
  konyhánál/étkezésnél nincs biztonságos találata, az oldal ezt jelzi, és
  **nem** kínál helyette esetleg nem biztonságos alternatívát. Súlyos
  allergia esetén mindig olvasd el magad is a hozzávalókat.
- **Inzulinrezisztencia**: az intoleranciák között külön jelölhető, de
  nem összetevő-szűrőként működik. Az élő konyháknál az oldal
  étkezésenkénti szénhidrát- és cukorplafont küld a Spoonacularnak (a
  gyakori napi ~160 g szénhidrátos IR-étrendből a 25/40/35%-os elosztással:
  reggeli max. 40 g, ebéd 64 g, vacsora 56 g szénhidrát, és étkezésenként
  max. 15 g cukor). A kézzel írt recepteknél kiesnek a hozzáadott cukrot,
  mézet, lekvárt, szirupot, csokoládét tartalmazó fogások, és az oldal
  előnyben részesíti azokat, amelyekben nincs gyors felszívódású köret
  (kenyér, péksütemény, rizs, burgonya, tészta, nokedli stb.) — ha ilyen
  nincs, a többi közül választ. Ez is tájékoztató becslés, nem orvosi
  vagy dietetikusi étrend.
- **Fehérjecél**: a testsúlyból és a "fehérjedús" jelölésből az oldal egy
  ökölszabály-alapú napi fehérjecélt számol (kb. 1,2–1,6 g/ttkg, korfüggő
  szorzóval), amit reggeli/ebéd/vacsora között 25/40/35%-ban oszt szét, és
  ez adja a Spoonacular-lekérdezés fehérje-paraméterét. Ez tájékoztató
  becslés, nem orvosi tanács.
- **Kalóriacél**: nem kötelező mező — ha megadod a napi kalóriacélodat
  (kcal), az oldal ugyanazzal a 25/40/35%-os elosztással étkezésenkénti
  célt számol, és egy tág (a cél 60-140%-át lefedő) tartományt küld a
  Spoonacularnak, hogy ne szűkítse túlságosan a választékot. A kártyákon,
  ha az API adott tápérték-adatot, megjelenik a becsült kalória- és
  fehérjeérték is.
- **Fontos korlát**: a kalória- és fehérjecél kizárólag élő
  Spoonacular-szeletnél érvényesülne, mert csak a Spoonacular ad
  tápérték-adatot — jelenleg tehát ez a két szűrő sehol nem hat (kivéve
  a kártyákon megjelenő, dokumentum-alapú becsült kcal-értéket, ahol
  a forrás ezt megadta, pl. az amerikai konyhánál).

## Hogyan válogat

A mai dátumból (az év hányadik napja) az alkalmazás determinisztikusan
kiválaszt 3 különböző konyhát — egyet reggelire, egyet ebédre, egyet
vacsorára —, úgy, hogy egy hét alatt mind a 9 konyha egyenlő eséllyel
előkerüljön. Ugyanaznap újratöltve ugyanazt az ajánlást mutatja, éjfélkor
változik. A „Másik ötletet ebből a konyhából” gomb ugyanabból a konyhából
kínál egy másik fogást, dátum-váltás nélkül is.

Minden étkezés-kártya fejlécében egy kis legördülő menüvel felül is
bírálható, melyik konyhából kérsz ajánlást aznapra ("Automatikus" vagy
bármelyik a kilenc konyha közül) — ez a választás konyhánként/étkezésenként
külön localStorage-ban megjegyződik, amíg vissza nem állítod
"Automatikus"-ra.

A "Napi ajánló" fülön, a jelölőnégyzetek alatt, és a "Heti menü" fülön,
a hét-navigáció alatt is megjelenik egy jól látható gombsor ("Konyhák
(több is kiválasztható)") — a két hely ugyanazt az állapotot mutatja és
vezérli. Egy vagy több konyhára kattintva a napi automatikus rotáció (és
a heti menü is) onnantól csakis a kiválasztott konyhák közül választ
mindhárom étkezésnél; "Automatikus (mind)"-ra visszaállítva újra mind a
kilenc konyha jöhet. Ez a szűrés (localStorage: `napi-recept-cuisine-filter`)
a napi alap-rotáció készletét szűkíti, ezért egy adott étkezésre a kártyán
külön beállított konyha (lásd fent) továbbra is felülbírálja azt.

Két jelölőnégyzet is szűri az ajánlást (localStorage-ban megjegyezve):

- **„Egyszerűbb recepteket szeretnék”** — rövid elkészítési idejű, kevesebb
  hozzávalós recepteket részesít előnyben (a kézzel írt recepteknél az
  "Egyszerű" jelölés alapján; élő konyhánál/étkezésnél a Spoonacular
  `maxReadyTime` paraméterén keresztül működne).
- **„Reggelire és vacsorára nem kell mindenáron főtt étel”** — ebédnél nem
  számít, de reggelinél és vacsoránál olyan fogásokat hoz előre, amikhez nem
  kell tűzhely vagy sütő.

Ha egy adott konyhához/étkezéshez épp nincs a szűrésnek megfelelő találat,
az oldal ezt jelzi ("Újra" gombbal), nem kínál helyette esetleg nem
megfelelő alternatívát.

## Heti menü

A "Heti menü" fülön egy teljes naptári hét (hétfőtől vasárnapig) ajánlása
állítható össze egyszerre — mind a 21 étkezésre (7 nap × reggeli/ebéd/
vacsora). A hét nyilakkal lapozható előre-hátra, bármely múltbeli vagy
jövőbeli hétre; az "Aktuális hét" gomb visszaugrik a mai naphoz.

Minden nap automatikusan **hétköznap**, **hétvége** vagy **ünnepnap**
típusba sorolódik:

- Az ünnepnapokat egy beépített, minden évre kiszámított magyar hivatalos
  munkaszüneti nap-naptár jelöli (újév, márc. 15., nagypéntek,
  húsvétvasárnap/-hétfő, május 1., pünkösdvasárnap/-hétfő, aug. 20.,
  okt. 23., mindenszentek, karácsony és másnapja).
- Szombat/vasárnap (ha nem esik ünnepre) automatikusan hétvége, a többi nap
  hétköznap.
- Bármelyik nap típusa kézzel felülbírálható (pl. ha szabadnapot vagy
  családi eseményt szeretnél ünnepnapként kezelni).

A nap típusa befolyásolja az ajánlást: **hétköznapra** a rendszer
automatikusan az "Egyszerűbb" szűrőnek megfelelő, gyorsabb fogásokat
részesíti előnyben (az "Egyszerű" címkés tételeket; élő
Spoonacular-szeletnél rövidebb elkészítési idővel működne);
**ünnepnapra** ezzel ellentétben kifejezetten a nem "Egyszerű" jelölésű,
különlegesebb fogásokat hozza előre. Élő Spoonacular-szeletnél a
Spoonacular nem jelezne "ünnepi" jelleget, ott ünnepnapon csak az
időkorlát oldódna fel — ez a korlát jelenleg egyetlen konyhánál/
étkezésnél sem érvényesül, mert nincs élő szelet.

Minden nap minden étkezéséhez ugyanaz a kis konyhaválasztó legördülő
tartozik, mint a napi ajánlóban — ez a heti nézetben dátumhoz és
étkezéshez kötve, külön jegyződik meg (localStorage). A heti nézet a
Beállításokban kiválasztott profil intolerancia-, kalória- és
fehérjeszűrését, valamint a globális "Egyszerűbb"/"Nem kell főzni"
kapcsolókat is figyelembe veszi, ugyanúgy, mint a napi ajánló.

### Bevásárlólista

A "Heti menü" fül alján egy gombbal összeállítható a betöltött heti
étkezések hozzávalóiból egy bevásárlólista, boltrészlegek szerint
csoportosítva (zöldség-gyümölcs, hús/hal, tejtermék/tojás, pékáru/tészta,
fűszer/egyéb). Minden tétel elején egy **megközelítő, felfelé kerekített
összmennyiség** áll (pl. "≈ fél kg cukor", "≈ 1 liter étkezési olaj",
"≈ 6 db tojás") — ez a tétel azonos mértékegységű (súly: g/dkg/kg;
űrtartalom: ml/dl/l/evőkanál/teáskanál; darab: db) előfordulásait adja
össze, és egy vásárláskor kényelmes méretre kerekíti (pl. negyed/fél/
háromnegyed/egész kg vagy liter). A pontos, recepteként külön szereplő
mennyiségek zárójelben, "részletesen" jelöléssel követik, így bármikor
ellenőrizhető, miből jött ki az összeg.

Néhány gyakori hozzávalónál (liszt, cukor, porcukor, só, zsemlemorzsa,
rizs, kakaópor, méz, olaj, ecet, tej/tejszín/tejföl, víz) az oldal egy
átlagos sűrűség-becslés alapján a kanalas/deciliteres és a
dekás/grammos bejegyzéseket is **egyetlen összeggé vonja össze** — pl.
"20 dkg liszt" + "1 evőkanál liszt" egy tételként jelenik meg, mert kb.
10 g/evőkanál átváltással ugyanabba a súly-összegbe kerül. Minden ilyen
hozzávalónak van egy "természetes" egysége (folyadékoknál — olaj, víz,
tej — térfogat; száraz/ömlesztett anyagoknál — liszt, cukor, só —
súly), és mindig erre vált át. Ez **csak közelítés** (nem konyhai
mérlegpontosságú sűrűségadat), a zárójeles "részletesen" rész mindig
mutatja a pontos, eredeti bejegyzéseket. Amit nem ismerünk fel
(pl. ismeretlen nevű vagy különleges hozzávaló), ott — mint korábban —
csak az azonos mértékegység-típusú (súly/térfogat/darab) bejegyzések
adódnak össze, a különbözőek külön maradnak. Olyan hozzávalóknál, ahol
a recept nem ad explicit mértékegységet (pl. "1 hagyma" darabszám
nélkül), nincs összesítés, csak a részletes felsorolás. A lista
nyomtatható is (a nyomtatási nézet elrejti a navigációt és a
vezérlőket).

### Boltkereső

**Fontos, amit tudni érdemes**: egyik magyar élelmiszerlánc sem biztosít
szabadon elérhető, valós idejű ár- vagy akció-API-t, ezért az oldal
**nem mutat és nem is talál ki valós árakat vagy akciókat** — ez
megtévesztő lenne. Ehelyett a böngésző helymeghatározása (engedélykéréssel)
vagy egy kézzel megadott város/irányítószám/cím alapján az
[OpenStreetMap](https://www.openstreetmap.org) nyilvános, ingyenes
Nominatim (geokódolás) és Overpass (helyadat-lekérdezés) API-jával
megkeresi a 3 km-es körzeten belüli élelmiszerboltokat, feltünteti a nevüket,
címüket és távolságukat, és ahol felismeri az üzletláncot (Tesco, SPAR,
Lidl, Aldi, Penny, CBA, Auchan, Coop, Príma, Reál), közvetlenül a lánc
saját, hivatalos aktuális-akciók oldalára linkel, hogy Te magad
megnézhesd a valódi árakat. Ismeretlen/független boltokhoz csak
útvonaltervezés-link jár (Google Maps). Az OpenStreetMap adatbázisa
önkéntesek által karbantartott, ezért egy-egy kisebb bolt hiányozhat
vagy pontatlan lehet benne.

## Hasznos tanácsok háziasszonyoknak és háziuraknak

A második fül gyakorlati háztartási tanácsokat gyűjt össze —
háztartásszervezés, vendéglátás, terítés, tálalás és néhány konyhai
fogás —, valamint két klasszikus magyar sütemény receptjét (Dobostorta,
Rigó Jancsi), amelyek nem illenek a reggeli/ebéd/vacsora napi ajánlóba,
inkább alkalmi süteményként készülnek.

A tartalom forrása ugyanaz az 1920-as évekbeli könyv (Bánffyhunyadi
Hunyady Erzsébet: *A jó házi konyha — Így kell főzni!*, Singer és
Wolfner, hetedik kiadás), amely a Magyar Elektronikus Könyvtárban (MEK)
szabadon elérhető. A tanácsokat és recepteket **nem szó szerint vettük
át**, hanem mai nyelvre, mai mértékegységekre és mai háztartásokra
írtuk át; a korabeli, ma már elavult vagy nem biztonságos részeket (pl.
lúgból főzött házi szappan, cselédtartás körüli tudnivalók) kihagytuk.

## Recept beküldése

A harmadik fülön bárki javasolhat receptet egy űrlapon keresztül (név és
e-mail nem kötelező, a recept neve, konyhája, étkezés-típusa, hozzávalói és
elkészítési lépései igen). **A beküldés nem publikál automatikusan semmit.**
Mivel az oldalnak nincs backendje és nincs élő AI-ellenőrzés a böngészőben,
a beküldés egy előre megformázott szöveget állít össze, amit a beküldő
vagy e-mailben elküld (a "Küldés e-mailben" gomb egy előre kitöltött
levelet nyit meg), vagy kimásol és úgy küld el. Az űrlap ellenőrzi, hogy
legalább a minimális adatok (cím, konyha, étkezés, legalább 3 hozzávaló,
legalább 2 lépés) megvannak, de a **valódi tartalmi ellenőrzés** — hogy a
recept ténylegesen elkészíthető, koherens, helyes-e — mindig kézzel
történik, mielőtt bármi bekerülne az adatbázisba, ugyanúgy, ahogy a régi
könyvből átvett tartalmaknál.

## Korlátok, amiket érdemes tudni

*(A gépi fordításról szóló alábbi pontok jelenleg nem érvényesülnek,
mert nincs élő konyha/étkezés, amit fordítani kellene — dormant kódról
van szó, lásd "Adatforrás" fent.)*

- A gépi fordítás minősége nem éri el a kézzel írt szövegét.
- A fordítás **soronként** történik (cím, minden hozzávaló, minden lépés
  külön-külön), nem egyben — így ha egy-egy sor fordítása nem sikerül (pl.
  elfogyott a MyMemory napi ingyenes kerete), csak az a sor marad angol, nem
  dől be tőle az egész recept. Ha legalább egy sor angol maradt, az oldal
  jelzi ezt.
- A sikeresen lefordított szövegeket az oldal megjegyzi (böngésző
  localStorage), így ugyanaz a mondat/hozzávaló újra megjelenve nem fordul
  le még egyszer — ez érezhetően csökkenti a MyMemory napi kerete
  fogyását, és gyorsabb is.
- A MyMemory ingyenes napi kerete így is korlátos; nagyon intenzív
  használatnál (sok "Másik ötletet" kattintás egymás után, sok konyhán át)
  elérheti a limitet — ilyenkor az adott sorok fordítatlanul, angolul
  jelennek meg, jelezve.
- Ezt a projektet olyan sandbox-környezetben fejlesztettem, ahol a
  Spoonacular és a MyMemory API-k nem érhetők el közvetlenül — a kódot
  Playwright-tal, mesterséges (mock) API-válaszokkal teszteltem alaposan,
  de az éles, valódi API-hívásokat neked kell ellenőrizned a böngésződben.

## Futtatás helyben

    python3 -m http.server 8000
    # majd: http://localhost:8000

Dupla kattintással is megnyitható közvetlenül a böngészőben, illetve
ugyanígy működik GitHub Pages-ről vagy bármilyen statikus tárhelyről.

## Fájlok

    index.html                      a teljes alkalmazás — stílus, jelölés, recept-adatok és logika egy fájlban
    spoonacular-proxy-worker.js     opcionális Cloudflare Worker kód a megosztott API-proxyhoz (lásd "Megosztott API-proxy")
    README.md                       ez a leírás
