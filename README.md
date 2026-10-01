# Napi recept ajánló

Egyoldalas alkalmazás: minden nap ajánl egy-egy **reggelit, ebédet és
vacsorát**, tíz konyha közül válogatva — olasz, francia, amerikai,
lengyel, délszláv, görög, magyar, indiai, kínai és japán. Minden recept
magyarul jelenik meg, igény szerint
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

### „Munkába is vihető” receptek

200 hétköznapi, begyakorolt családi étel (konyhánként 20): főzelékek,
raguk, egytálételek, rakottak, curryk, levesek — olyanok, amelyeket egy
fáradt szülő munka után 1-1,5 óra alatt megfőz több napra, és amelyek
dobozban, a munkahelyi mikróban gyorsan felmelegítve is jók. Mindegyiknél:

- `lunchbox: true` és `keepsWell: true` — a kártyán „Munkába is vihető”
  címke, a kereső „Ötletek” sorában külön gomb, és az előre főzés is
  ezeket veszi előre;
- az utolsó lépés megmondja, hány napig áll el a hűtőben, és hogyan
  melegítsük mikróban (fedővel, hány percig, kell-e egy kanál víz);
- `time` legfeljebb 1 óra 30 perc.

Ezek saját, házias receptek (nem átvett szövegek), ezért nincs `source`
mezőjük.

### „Hosszú életért (longevity)” címke

Egy szabály alapján megjelölt receptek (`longevity: true`), a kártyán
„Hosszú életért” címkével, a kereső „Ötletek” sorában külön gombbal. A
receptek szövegét nem írtuk át, csak megjelöltük a megfelelőket. A szabályt a
mediterrán és a „kék zónák” étkezési mintákról szóló, általános táplálkozástudományi
összefoglalók (hüvelyes, zöldség, teljes kiőrlésű gabona, dió, hal, olívaolaj
többet; feldolgozott hús, vörös hús, hozzáadott cukor, só kevesebbet) alapján
írtuk; ez általános útmutatás, nem orvosi tanács.

Egy recept akkor kap `longevity: true` jelölést, ha mind teljesül (a szabály
a hozzávalók és a lépések kulcsszavaiból dolgozik, az édességeket nem jelöli):

- van benne legalább két ilyen csoportból: hüvelyes (bab, lencse,
  csicseriborsó, tofu), hal és tenger gyümölcse, teljes kiőrlésű gabona (zab,
  barna rizs, árpa, kinoa…), dió/mag, olívaolaj, erjesztett étel (kefir,
  joghurt, savanyú káposzta); vagy egy csoport és legalább 3 féle zöldség;
  vagy legalább 4 féle zöldség és legfeljebb egy tejtermék-tétel;
- nincs benne feldolgozott hús (kolbász, szalonna, sonka, füstölt hús…), vörös
  hús (sertés, marha, bárány…), rántás/bő olajban sütés, két vagy több tétel
  hozzáadott cukorból/mézből, tejszín/mascarpone/majonéz, és adagonként nem
  több mint 750 kcal.

A szkript a recept szövegét nem módosítja, csak a `longevity` mezőt állítja
be a `RECIPES` soron (`JSON.stringify`-jal). Jelenleg 178 receptet jelöl
(az összes 1370 közül), konyhánként 10-28-at; ebből 36-ot kifejezetten ehhez a
címkéhez írtunk (hüvelyes, hal, zöldség, teljes kiőrlésű gabona).

### „Fagyasztható jelzés”

Egy szabály alapján megjelölt receptek (`freezable: true`, 400 recept a 1370-ből), a kártyán „Fagyasztható”
címkével, a kereső „Ötletek” sorában „Fagyasztható (N)” gombbal. A címke tooltipje a
tárolási időt és az olvasztási tippet mutatja; mindez **becsült, általános útmutatás**, nem
élelmiszer-biztonsági garancia. A receptek szövegét nem írtuk át, csak megjelöltük a megfelelőket.
A „Hasznos tanácsok” fülön a „Fagyasztás” blokk a biztonságos fagyasztásról szól.

A szabály (konzervatív; a kizáró szó mindig erősebb):

- **Típus a címből.** Fagyasztható: leves és krémleves, pörkölt/ragu/főzelék/curry/chili/dal, töltött
  káposzta és paprika, fasírt/húsgolyó/húspogácsa, gombóc/derelye/pierogi/gnocchi, palacsinta és
  lepény, pite/quiche/rétes/pizza/burrito, sütemény/muffin/keksz/kenyér/szelet, főtt rizs és rakott tészta.
- **Kizárás a címben:** saláta, nyers, puding/mousse/zselé/krémes, rántott, rántotta/omlett, tejleves,
  hideg étel, szendvics/wrap, fánk/lángos. **Kizárás a címben, hozzávalóban vagy lépésben:**
  majonéz, tejszínhab/habtejszín/mascarpone/zselatin, friss saláta/avokádó/rukkola, tükörtojás és
  lágy tojás, ropogós, bő olajban sült, panírozott.
- **Egyéb kizárás:** hal és tenger gyümölcse; tésztás vagy gombócos leves (megázik); burgonya a levesben,
  raguban és rakottban (kivéve a krémlevest); tejfölös/joghurtos étel (a sütemény kivételével); tojásos leves/ragu/rizs.
- Aránya: 29 %. A tárolási szöveg a cím alapján készül az `index.html`-ben (`FREEZE_KINDS`): leves, ragu,
  gombóc kb. 3 hónap; fasírt és sütemény kb. 2-3 hónap; pite, quiche, palacsinta kb. 2 hónap;
  főtt rizs és tészta kb. 1-2 hónap. Mindenhol: lehűtve, adagolva, dátummal; felolvasztás a hűtőben;
  ne fagyaszd újra. Új receptnél a szerkesztő állítja be a szabály szerint.

### „Könnyű sütik” fül

Külön menüpont 200 egészségesebb édességgel, konyhánként 20-20 recepttel
(magyar, lengyel, délszláv, görög, olasz, francia, amerikai, indiai, kínai,
japán). A receptek teljes kiőrlésű lisztet vagy zabot, joghurtot és túrót
használnak, gyümölccsel és kevés mézzel édesítenek, és kis adagot adnak: a
legtöbb szelet 100–250 kalória (az érték a többi recepthez hasonlóan
becslés). A fülön konyha szerint lehet szűrni.

Az adatban ezek a `RECIPES[konyha].sweet` helyen vannak, külön a reggeli,
ebéd és vacsora mellett (`MEALS`), ezért a napi és a heti menübe nem
kerülnek be; a „Mi van itthon?” kereső viszont megtalálja őket. A receptek
`easy` és `keepsWell` jelölésűek, a tűz nélkül elkészülők `noCook`.

### Szabad licencű receptek (Wikibooks Cookbook)

2026 szeptemberében 200 gyors, egyszerű recept került az oldalra a
[Wikibooks Cookbook](https://en.wikibooks.org/wiki/Cookbook:Table_of_Contents)
gyűjteményéből (letöltve a [3895 receptes adatkészletből](https://huggingface.co/datasets/gossminn/wikibooks-cookbook)).
A Wikibooks tartalma **CC BY-SA 4.0** licencű: szabadon átdolgozható és
fordítható, ha a forrást és a licencet feltüntetjük, és az átdolgozás is
ugyanezt a licencet kapja. Ezért:

- ezek a receptek egy `source` mezőt kapnak (`name`, `title`, `url`,
  `license`), és a kártya alján a „Kézzel válogatott … recept” sor helyett
  a forrás, a licenc és az „átdolgozva, fordítva” megjegyzés látszik;
- a szövegük magyar és angol átdolgozás (metrikus mértékegységek, reális
  idők, a hazai boltokban kapható alapanyagok — az amerikai konzervlevesek
  helyett például házi mártás), és ezek a szövegek is CC BY-SA 4.0
  licencűek. Az oldal többi része és kódja nem kerül e licenc alá.

Válogatási szempont: legfeljebb 2-es nehézség, általában 1 óránál rövidebb
elkészítés, és ne legyen szinte ugyanilyen recept már az oldalon.
Konyhánként: amerikai 59, olasz 43, indiai 26, kínai 18, japán 12,
balkáni 13, görög 9, francia 9, magyar 8, lengyel 3.

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
  Tandoori Chicken, Chicken Korma, Saag Gosht. `mode: "curated"` — ez, a
  kínai és a japán konyha eleve sosem volt Spoonacularon élőben, nincs
  `curatedSlots` mezőjük, csak a korábbi lengyel/délszláv/magyar mintát
  követik.
- **Kínai** — szintén mindhárom étkezés kézzel írt, 15-15 hiteles kínai
  recepttel (webes kutatás alapján összeállítva): reggelire pl. congee,
  youtiao, baozi, jianbing, xiaolongbao, cheung fun, mantou; ebédre wonton
  leves, chow mein, jangzsoui sült rizs, dan dan noodles, zhajiangmian,
  jiaozi, gőzölt hal; vacsorára Kung Pao Chicken, Mapo Tofu, Peking Duck,
  Hong Shao Rou, Char Siu, General Tso's Chicken. `mode: "curated"`.
- **Japán** — szintén mindhárom étkezés kézzel írt, 15-15 hiteles japán
  recepttel (webes kutatás alapján összeállítva): reggelire pl. tamagoyaki,
  dashimaki tamago, miso leves, natto gohan, onigiri, ohitashi; ebédre
  shoyu/tonkotsu/miso ramen, zaru soba, kitsune udon, oyakodon, gyudon,
  katsudon, karaage, chirashi don; vacsorára nigiri és maki sushi, sashimi,
  tempura, sukiyaki, shabu-shabu, teriyaki csirke, yakitori, tonkatsu,
  okonomiyaki, takoyaki, gyoza. `mode: "curated"`.
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

## Navigáció: bal oldali menüoszlop

Asztali nézetben (900 px fölött) bal oldalon állandó, görgetéskor is
helyben maradó menüoszlop, csoportosítva:

- **Mit főzzek?** — Napi ajánló · Mi van itthon? (Gyors ötletekkel) · ♥ Kedvenceim (darabszámmal)
- **Tervezés és vásárlás** — Heti menü (becsült tápértékkel) · Bevásárlólista („Nálam van” gombokkal) · Közeli boltok
- **Tudástár** — Hasznos tanácsok · Alapok kezdőknek (mértékegység-átváltóval)
- **Közösség** — Recept beküldése

Minden menüpont egy `.tab-panel`-t mutat (`data-tab`: `ajanlo`, `kereso`,
`kedvencek`, `heti`, `bevasarlo`, `boltok`, `tanacsok`, `alapok`,
`bekuldes`); az utoljára megnyitott oldal localStorage-ban megmarad. A
„Kinek főzök?” és a „Mennyi időd van főzni?” beállítások csak a Napi
ajánló és a Heti menü oldalon látszanak. Bármely `data-goto="…"`
attribútumú gomb a megadott oldalra vált (pl. Heti menü →
„Bevásárlólista ehhez a héthez →”).

Mobilon/tableten (900 px alatt) a menü helyén felül egy rögzített sáv van
„☰ Menü” gombbal és az aktuális oldal nevével; a gomb balról becsúszó
menüt nyit ugyanezekkel a pontokkal (bezárás: ×, háttérre koppintás,
Escape vagy egy menüpont választása).

## Személyre szabás

A Beállítások panelen felvehetsz **célszemélyeket** (pl. családtagokat):
név, kor, testsúly, nem, fehérjedús étrend igénye, napi kalóriacél,
ételintolerancia (tejtermék, tojás, glutén, földimogyoró stb.). A "Kinek
főzöl ma?" chipek közül mindig egy aktív — az oldal az ő adatai szerint
szűr, amíg másikra nem váltasz (vagy "Mindenkinek / nincs profil"-ra, ami
kikapcsolja a szűrést).

Egy már felvett személy adatai utólag is módosíthatók: a chipen a **✎**
gomb betölti az összes adatát (az ételérzékenységeket is) az űrlapba, a
„Módosítások mentése” ugyanazt a profilt írja felül, a „Mégse” elveti a
változtatást.

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
- **Fontos korlát**: a kalória- és fehérjecél *szűrőként* kizárólag élő
  Spoonacular-szeletnél érvényesülne, mert csak a Spoonacular ad
  tápérték-adatot — jelenleg tehát ez a két szűrő sehol nem szűr ténylegesen.
  A kártyákon megjelenő kcal-érték (lásd lent) ettől független, minden
  receptnél megjelenik, de nem befolyásolja, mely receptek kerülnek elő.

### Kalóriaérték minden receptnél (2026-09-27)

Minden kártyán megjelenik egy „kb. N kcal / adag” érték. Ennek eredete
receptenként eltér:

- **85 recept** (amerikai konyha, illetve a francia reggeli egy része)
  a forrásdokumentum saját, dokumentum-alapú becslését használja
  (`calories` mező, ahogy korábban is) — ezeket a hozzávaló-alapú
  újraszámolás **nem írja felül**.
- **A maradék 649 recept** (a többi 9 konyha, valamint az amerikai/francia
  hiányzó darabjai) kalóriaértéke egy egyszeri, offline futtatott
  hozzávaló-alapú becslő szkripttel készült: minden hozzávaló-sort
  mennyiségre/egységre és névre bont (ugyanazzal a mintával, mint a
  bevásárlólista összesítője), grammra vált (súly/térfogat-egységek
  ismert sűrűséggel, darabszám-egységeknél — db/fej/gerezd/szelet/szál/
  szem/csokor stb. — hozzávalónkénti jellemző súllyal), majd egy kb.
  200 hozzávalót lefedő, kulcsszó-egyezéses kcal/100g adatbázis alapján
  összegzi és elosztja az adagszámmal. Néhány recept egy tömbelemben,
  vesszővel sorol fel több hozzávalót (pl. "a palacsintához: 2 db tojás,
  3 dl tej, 15 dkg liszt…") — ezeket a szkript vessző mentén szétbontja,
  különben csak az első hozzávaló mennyisége számítana be. A végeredményt
  egy [80, 1600] kcal/adag tartományra szorítottuk (kb. 5%-ánál lépett
  csak közbe), hogy egy-egy szokatlan megfogalmazás (pl. mennyiség nélküli
  vagy a névbe ágyazott súlyú hozzávaló) se adhasson nyilvánvalóan
  irreális végeredményt.
- Ez **mindenhol tájékoztató, hozzávaló-alapú becslés**, nem konyhai
  mérlegpontosságú vagy laboratóriumi adat — pontosan úgy, ahogy az
  allergén-, fehérje- és kalóriacél-szűrők is csak becslések (lásd fent).
  A generáló szkript (adatbázis + logika) a repóban van
  (`tools/kcal-estimate/`, `node apply.js`) — új recept hozzáadása után
  újrafuttatható, a meglévő `calories` mezőket nem írja felül, csak a
  hiányzókat tölti ki. Részletek: `tools/kcal-estimate/README.md`.

### Magas fehérjetartalmú gyűjtemény és fehérjebecslés

Minden kézzel írt receptnek van `proteinGrams` mezője: a **becsült fehérje grammban, egy adagra**.
A kártyán a kalóriasor mellett „kb. N g fehérje” látszik (utána a „% a napi fehérjeszükségletből”
sor, ha van), a heti „Becsült tápérték” táblázat fehérje oszlopa ebből számol. A kereső „Ötletek”
sorában a **Magas fehérjetartalmú (N)** gomb, a kártyán a **Magas fehérjetartalmú** címke (tooltip:
„Becsült érték, adagonként kb. N g fehérje; általános útmutatás, nem táplálkozási tanács”) a
megfelelő recepteket mutatja. Semmi nem kézi jelölés: a címke a `proteinGrams` és a `calories` mezőből
számolódik az `index.html`-ben (`isHighProtein()`).

**A küszöb** (becsült, adagonként): étkezésnél **legalább 40 g**, vagy **legalább 30 g, ha az adag
legfeljebb 450 kcal**; süteménynél (Könnyű sütik) csak **legalább 15 g**, vagyis a sütik közül csak a
túrós, joghurtos, ricottás, skyres darabok kerülnek be. Eredmény: 180 recept a 1370-ből (13 %):
167 étkezés (a 1170-ből 14 %: 5 reggeli, 64 ebéd, 98 vacsora) és 13 süti. A kiindulási javaslat
(25 g, vagy 20 g 400 kcal alatt) a 1170 étkezés 42 %-át jelölte volna meg, mert a becsült fehérje
mediánja vacsorára is 27 g; ezért emeltük a küszöböt, hogy a címke valóban kiemeljen. Ha a küszöb
változik, az `index.html`-ben a `HP_*` konstansokat, a gomb tooltipjét és az angol szövegét kell
együtt módosítani.

**A becslés módja** (`tools/kcal-estimate`, ugyanaz a szkript, mint a kalóriánál): minden
hozzávaló-sort mennyiségre/egységre és névre bont, grammra vált (dkg, dl, evőkanál, db, szelet…),
majd a hozzávalónkénti fehérje/100 g értékkel (`db.js`, `prot` mező; hüvelyesnél `protDry` a
nyers, szárazon mért tételre) összegez, és elosztja az adagszámmal. Egész grammra kerekít, 90 g/adag
fölött levág (jelenleg egy recept sem éri el). Javítások, amelyek csak a fehérjét érintik:
- konzerv hüvelyes (felöntőlével mért súly) a fehérje 65 %-a, súly nélküli konzerv 400 g;
- csontos baromfi, bárány, oldalas, T-bone: 65 %; egész hal 60 %; alaplének főzött csont 15 %;
  a húsleves derítéséhez használt darált hús nem számít;
- plusz: `kb. 40 dkg` a névben az egész sor súlya, `kb. 15 dkg/db` darabonkénti; „fél” = ½;
  „liter” mértékegység; szendvics-szeletek (főtt/sült/vékony) 25 g-osak.

**Pontosság és korlátok.** Ez hozzávaló-alapú, tájékoztató becslés, nem mérlegpontos adat és nem
táplálkozási tanács. A nyers állapotú tápérték-táblázatok értékeit használja, sütés-főzés
veszteségét nem számolja. Tipikus hiba ±20-30 %, de nagyobb is lehet: (1) mennyiség nélküli
tételek (pl. „bab”, „vegyes zöldség”) kevés fehérjét kapnak, (2) vesszővel szétvágott tételnél
(„4 db előkészített, filézett angolna”) a mennyiség a névtelen töredékre kerül, (3) a marináda és
az opcionális tételek teljes egészében beleszámítanak, (4) a „kb. 2 kg-os” egész állatnál a csont
aránya becslés, (5) a „db” súlya alapértelmezés, ha nincs a db.js-ben (tojás 50 g, csirkemell 150 g,
sertés- és marhaszelet 150 g, lazacszelet 150 g). A `calories` mezők jórészt az első, egyszerűbb
becslőből maradtak (néhányuk nyilvánvalóan alacsony, pl. 90 kcal egy csirkés ételnél), ezért a
„legfeljebb 450 kcal” ág megbízhatósága is korlátozott. A kalóriaszabályt nem írtuk át.

Új recept felvételekor a `node tools/kcal-estimate/apply.js` a hiányzó `proteinGrams` mezőt is kitölti
(meglévőt sosem ír felül); kézzel is lehet javítani. A Spoonacular-ból jövő élő receptek saját
`proteinGrams` értéket kapnak az API-tól (ott nincs címke).

### Az adag a napi szükséglet hány százaléka

A kalóriasor mellett (ahol van „kb. N kcal / adag”) egy kis szürke sor mutatja
az arányt, a meglévő számok változatlanok. Ha a kiválasztott profilnak van
napi kalóriacélja, ahhoz viszonyít („≈ 23 % a napi kalóriacélból”); ha nincs
profil vagy cél, a 2000 kcal-os referenciához („≈ 17 % a 2000 kcal-os
referenciához képest”). Fehérjesor csak akkor jelenik meg, ha a receptnek van
`proteinGrams` mezője (a kézzel írt receptekben is van: lásd „Magas fehérjetartalmú gyűjtemény és
fehérjebecslés”; élő, Spoonacular-ból jövő receptnél az API értéke): a profil testsúlyából számolt napi szükséglethez
(ugyanazzal a g/testsúlykilogramm szorzóval, mint a fehérjecél a szűrésnél),
ennek híján az 50 g-os referenciához viszonyít. A százalék egyetlen adagra
vonatkozik, tájékoztató becslés.

## Hogyan válogat

A mai dátumból (az év hányadik napja) az alkalmazás determinisztikusan
kiválaszt 3 különböző konyhát — egyet reggelire, egyet ebédre, egyet
vacsorára —, úgy, hogy egy hét alatt mind a 10 konyha egyenlő eséllyel
előkerüljön. Ugyanaznap újratöltve ugyanazt az ajánlást mutatja, éjfélkor
változik. A „Másik ötletet ebből a konyhából” gomb ugyanabból a konyhából
kínál egy másik fogást, dátum-váltás nélkül is.

Minden étkezés-kártya fejlécében egy kis legördülő menüvel felül is
bírálható, melyik konyhából kérsz ajánlást aznapra ("Automatikus" vagy
bármelyik a tíz konyha közül) — ez a választás konyhánként/étkezésenként
külön localStorage-ban megjegyződik, amíg vissza nem állítod
"Automatikus"-ra.

A "Napi ajánló" fülön, a jelölőnégyzetek alatt, és a "Heti menü" fülön,
a hét-navigáció alatt is megjelenik egy jól látható gombsor ("Konyhák
(több is kiválasztható)") — a két hely ugyanazt az állapotot mutatja és
vezérli. Egy vagy több konyhára kattintva a napi automatikus rotáció (és
a heti menü is) onnantól csakis a kiválasztott konyhák közül választ
mindhárom étkezésnél; "Automatikus (mind)"-ra visszaállítva újra mind a
tíz konyha jöhet. Ez a szűrés (localStorage: `napi-recept-cuisine-filter`)
a napi alap-rotáció készletét szűkíti, ezért egy adott étkezésre a kártyán
külön beállított konyha (lásd fent) továbbra is felülbírálja azt.

Két beállítás is szűri az ajánlást (localStorage-ban megjegyezve, a Napi
ajánló és a Heti menü fülön is látszik):

- **„Mennyi időd van főzni?”** — Bármennyi / legfeljebb 20, 30, 45 perc vagy
  1 óra. A recept `time` mezőjét (pl. „1 óra 30 perc”, „40 perc + pácolás”)
  a `parseRecipeTime()` percekre bontja; a korlátba csak az fér bele, ami
  az időn belül elkészül és nincs külön előre elvégzendő várakozása
  (pácolás, áztatás, hűtés stb. — az „(ebből …)” megjegyzés már benne van
  a teljes időben, az nem számít külön). Ha egy konyhának nincs ilyen
  receptje, a három leggyorsabb közül választ. A régi „Egyszerűbb
  recepteket szeretnék” jelölés bekapcsolt állapota „legfeljebb 30
  perc”-re alakul át.
- **„Reggelire és vacsorára nem kell mindenáron főtt étel”** — ebédnél nem
  számít, de reggelinél és vacsoránál olyan fogásokat hoz előre, amikhez nem
  kell tűzhely vagy sütő.

Ha egy adott konyhához/étkezéshez épp nincs a szűrésnek megfelelő találat,
az oldal ezt jelzi ("Újra" gombbal), nem kínál helyette esetleg nem
megfelelő alternatívát.

**Ez a két beállítás egy összecsukható panelben van (2026-09-27):** a
panel fejléce mindig mutatja az aktuális állapotot összefoglalva (pl.
„Legfeljebb 30 perc · nincs extra szűrés”), a részletek csak rákattintva
nyílnak ki. Első látogatáskor (amíg nincs semmi elmentve `localStorage`-ban
a `napi-recept-prefs` kulcs alatt) a panel nyitva várja a látogatót; ha
korábban már állított bármit, a panel automatikusan csukva nyílik meg —
így visszatérő látogatónak nem kell minden egyes megnyitáskor végiggörgetni
ugyanazokat a már beállított vezérlőket, mielőtt a tényleges ajánláshoz
érne.

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
automatikusan a gyorsabb, "Egyszerű" címkés fogásokat
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
fehérjeszűrését, valamint a globális "Mennyi időd van főzni?"/"Nem kell
főzni" beállításokat is figyelembe veszi, ugyanúgy, mint a napi ajánló.

**„A hét menüje egy pillantásra”** — a heti kártyák fölötti tömör
áttekintő: soronként egy nap, oszloponként reggeli/ebéd/vacsora (étel neve,
konyha, idő), a mai nap kiemelve. Egy ételnévre kattintva a lap a részletes
kártyához görget és röviden kiemeli. Mobilon naponként egymás alá rendezve.
Minden étkezés (újra)betöltése után frissül (`scheduleWeekOverview()`), így
a „Másik ötlet”, a konyha- és a naptípus-váltás is azonnal látszik benne.

**Összecsukható napi kártyák (2026-09-27):** az áttekintő táblázat alatti
7 napi kártya (egyenként 3 teljes recepttel) alapból csak a mai napnál van
kinyitva — a többi nap fejléce összecsukva jelenik meg ("▸ Részletek"
gombbal), mert mind a 21 kártya egyszerre kiterítve kezelhetetlenül hosszú
oldalt adott (asztalin ~5500 px, mobilon ~14 000 px). Az áttekintő
táblázatban egy ételnévre kattintva a megfelelő nap automatikusan kinyílik,
mielőtt a lap odagörgetne. Az állapot (`article.week-day.collapsed`) csak a
memóriában él, hét váltásakor/újratöltéskor minden nap az alapállapotra áll
vissza — nincs localStorage-perzisztencia, mert ez tudatosan egy
"ránézésre áttekintem, aztán rákattintok, ami kell" munkafolyamat, nem egy
tartós beállítás.

### Becsült tápérték a hétre

A hét alatt (a „Bevásárlólista ehhez a héthez” gomb fölött) egy **Becsült
tápérték** táblázat mutatja naponta a kalóriát (a nap étkezéseinek `calories`
értéke, adagonként, egy főre) és a fehérjét (`proteinGrams`, adagonként, egy főre) — ez utóbbit csak ott,
ahol a receptnek van ilyen mezője; a kézzel írt receptek mindegyikében van
(becsült érték), így „—” csak az élő, adat nélküli receptnél látszik. Ha egy napnak csak néhány étkezéséhez van adat, a sor ezt jelzi
(„… kcal (2 étkezésből)”). A **napi átlag** csak a teljes, mindhárom
étkezéssel megtervezett napokból készül. A táblázat a menü minden
változásánál (újragenerálás, másik étel, hétváltás) újraszámolódik; a
maradékból felmelegített étkezés is beleszámít, mert azt is megeszik.
Nyomtatásban nem jelenik meg.

### Előre főzés több napra („Hány napra főzöl előre?”)

A Heti menü tetején beállítható, hogy nem minden nap főzöl, hanem egyszerre
több napra. Gyorsgombok: **Minden nap** (az alapállapot), **3× (H–K ·
Sze–P · Szo–V)**, **2× (H–Sze · Cs–V)**. Utána minden főzésnél külön
választható, **hány napra főzöl előre (1–4 nap)** — a következő főzés
napja ebből adódik, a hét végét új főzések töltik ki. A beosztás
localStorage-ban marad (`napi-recept-cook-plan`, pl. `[2,3,2]`: a főzések
hossza napokban, hétfőtől, összesen 7).

- **A főzés napján** az ebéd és a vacsora annyi napra szóló mennyiséggel
  jelenik meg, ahány napra szól (az adagszám-átszámoló már eleve ×N-en áll),
  fölötte egy „Főzés napja — N napra (hétfő–kedd)” sáv tárolási tippel;
  4 napnál azt is jelzi, hogy a 4. napi adagot biztonságosabb lefagyasztani.
- **A többi napon** csak „Maradék a hétfői főzésből: …” áll, egy gombbal,
  ami a főzés napjához ugrik. Ha a főzés napján „Másik ötletet” kérsz vagy
  konyhát váltasz, a maradék-napok követik.
- **A reggeli** minden napra külön ajánlás marad.
- **Csak jól eltartható ételt ajánl** (`keepsWell()`, a cím alapján):
  leveseket, pörkölteket, főzelékeket, ragukat, curryket, rakott és töltött
  ételeket, sülteket. Kimarad a rántott, ropogós, salátás, tojásos, halas,
  tésztás-gombócos és frissen jó étel. Ha a nap automatikus konyhájában
  kettőnél kevesebb ilyen van (a japánban egy sincs), a következő olyan
  konyhát ajánlja, amelyikben van elég, és ezt kiírja; kézzel választott
  konyhát nem cserél.
- **Legfeljebb 4 nap** egy főzés — főtt ételt ennél tovább hűtőben nem
  ajánlott tárolni.
- **A bevásárlólista** a főzés napjainak receptjeit ×N mennyiséggel számolja,
  a maradék-napokat nem számolja még egyszer.
- **Hány főre főzöl?** — „a recept szerint” (alapállapot) vagy 1–10 fő
  (`napi-recept-household`). Beállítva a heti menü minden receptje (a
  reggeli is) és a bevásárlólista erre számol: fő / eredeti adag × napok
  (pl. 2 fő, 4 adagos recept, 3 napra → 6 adag). Csak az „adag” vagy „fő”
  egységű recepteket számolja át főre; a „12 db”, „8 szelet” jellegűeknél
  nem tudni, hány embernek elég, ott csak a napokkal szoroz.

### Bevásárlólista

A **Bevásárlólista** menüpont megnyitáskor automatikusan összeállítja az
éppen kiválasztott hét (a Heti menüben lapozható) étkezéseinek
hozzávalóiból a listát, boltrészlegek szerint
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

**Kipipálható tételek (2026-09-27):** minden sor elején egy checkbox áll —
vásárlás közben kipipálható, amit már kosárba tettél; a kipipált tétel
áthúzva jelenik meg. Az állapot a héthez kötve (`localStorage`,
`napi-recept-shop-checked:<hét hétfőjének dátuma>`) böngészőnként
megmarad újratöltés után is, de csak azon a gépen — más eszközzel nem
szinkronizál, és egy másik hétre váltva nem hordódik át. Nyomtatáskor a
valódi checkbox rejtve marad, csak a már meglévő `☐` nyomtatási jelölés
látszik.

### „Nálam van” — alapanyagok a listáról

A Bevásárlólista fölött 10 „Nálam van:” gomb van (só, bors, olaj, liszt, cukor,
ecet, fűszerpaprika, sütőpor/szódabikarbóna, babérlevél, víz). Ha egyet
bejelölsz, az ilyen nevű tételek nem látszanak a listán, helyette egy rövid
jegyzet mondja meg, hány tételt rejtettünk el. Az egyezés ékezet nélküli,
szóhatáros (a „só” nem fogja meg a sonkát, a „bors” a borsót, az „olaj” az
olajbogyót, az „ecet” az ecetes uborkát), a lista pedig a nyomtatáshoz is ugyanez, így a
kinyomtatott lapon sem szerepelnek. A választás a `napi-recept-staples`
localStorage-kulcsban marad meg (hét helyett az egész oldalra érvényes); ha a
böngésző nem engedi az írást, a gombok akkor is működnek, csak újratöltés után
nem maradnak bejelölve.

### Nyomtatás: menü + bevásárlólista

A heti áttekintő fejlécében „Nyomtatás: menü + bevásárlólista” gomb (a
bevásárlólista „Nyomtatás” gombja is ugyanezt csinálja). Automatikusan
összeállítja a bevásárlólistát, majd A4-re nyomtat: 1. oldal a heti
áttekintő táblázat, 2. oldaltól a bevásárlólista két hasábban, kipipálható
☐ négyzetekkel (a részletező zárójeles mennyiségek nélkül). A 21 részletes
kártya, a fejléc és a beállítások nem kerülnek a papírra. Nyomtatáskor a
színek mindig világos/fekete változatra váltanak, így sötét módból is
olvasható lap jön ki. (`body.print-week` osztály, `afterprint`-re lekerül.)

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

## „Mi van itthon?” kereső

Saját menüpont („Mi van itthon?”). Vesszővel (vagy „és”-sel)
elválasztott hozzávalókat vagy ételnevet vár, és mind a 1370 kézzel írt
receptben keres (cím + hozzávalók, ékezet-függetlenül, részszóra is: a
„csirke” a „csirkemell”-t is megtalálja). Rangsor: minél több megadott
hozzávaló szerepel, annál előrébb; a címben szereplő szó plusz pontot ér;
egyenlőségnél a gyorsabb recept előbb. Minden kártyán látszik, mi van meg
(„✓ tejföl, krumpli”) és mi hiányzik belőle. Étkezésre szűrhető (mind /
reggeli / ebéd / vacsora), 12-esével lapoz („További találatok”).

- **Szinonimák** (`PANTRY_SYNONYMS`, oda-vissza): krumpli = burgonya,
  disznó = sertés.
- **Gyűjtőszavak** (`PANTRY_BROADER`, csak lefelé): pl. „sajt” → mozzarella,
  feta, parmezán…; „hal” → lazac, tonhal…; „hús” → csirke, marha, sertés…
  Fordítva nem bővít (a „mozzarella” nem hoz cheddart).
- A kiválasztott profil **ételérzékenysége itt is szűr** (ugyanazzal az
  `ALLERGEN_KEYWORDS` listával, mint a napi ajánló), és ezt a találatszám
  mellett jelzi is.

### „Fotó a hűtőről” — ingyenes, helyi képfelismerés

A kereső mellett egy **📷 Fotó a hűtőről** gomb is elérhető: a
felhasználó lefotózza (vagy feltölti) a hűtő/kamra tartalmát, és a
felismert hozzávalók eltávolítható „chip”-ekként jelennek meg, majd
automatikusan lefut velük a keresés. Nincs szerveroldali költség és a kép
soha nem hagyja el a böngészőt:

- A felismerés a [transformers.js](https://github.com/xenova/transformers.js)
  könyvtárral, egy nyílt **CLIP** modellel (`Xenova/clip-vit-base-patch32`,
  ~90 MB, jsDelivr CDN-ről) fut helyben, a felhasználó gépén — első
  használatkor tölti le a böngésző, utána a cache-ből gyors.
- A betöltés egy külön beszúrt `<script type="module">` blokkban történik
  (`ensureFridgeModule()`), hogy a fő szkript ES5-ös, `var`/`function`
  stílusú szintaxisa ne törjön el olyan böngészőkön, amik a modult vagy a
  dinamikus `import()`-ot nem ismerik — ott ez a funkció csendben nem
  jelenik meg, a kézi keresés változatlanul működik.
- **Miért csempézve (tile-olva) fut a felismerés, nem az egész képen
  egyben:** egy hűtőfotón sok apró tárgy van egyszerre. Ha a teljes képet
  egyetlen CLIP-beágyazással hasonlítjuk az összes jelölt szóhoz, a
  pontszámok gyakorlatilag megkülönböztethetetlenné válnak (kipróbálva:
  minden jelölt 0,20–0,26 közé esett, a valódi tartalomtól szinte
  függetlenül) — és ha egy „csukott hűtő, nincs benne semmi” jelölt szót is
  versenyeztetünk a többivel, az szinte mindig nyer, mert az egész kép
  hűtő-kontextusát ragadja meg, nem a konkrét tartalmat (ez volt az első,
  elvetett próbálkozás hibája). Ehelyett a képet 6, egymást átfedő
  vágatra bontjuk (`generateFridgeTiles`), vágatonként **softmax**-oljuk a
  kb. 40 jelölt szóra kapott nyers CLIP-logitokat (`logits_per_image`,
  kézzel hívott `CLIPModel`, nem a kész zero-shot pipeline, ami
  vágat-független, összes-címkés softmax-ot adna), és minden vágatból a
  legvalószínűbb 1-2 találatot vesszük át, ha az meghalad egy
  valószínűségi küszöböt (`FRIDGE_TILE_PROB_FLOOR = 0.15`).
- A jelölt szavak (`FRIDGE_CANDIDATES`) angol CLIP-promptok (pl. „a photo
  of eggs”), magyar hozzávaló-névre leképezve; a lista bővíthető.
- **Címke-kalibráció:** valódi hűtőfotókkal tesztelve kiderült, hogy egyes
  promptok (pl. „a bottle of cooking oil”) szisztematikusan magasabb nyers
  CLIP-pontszámot kapnak *bármilyen* képen, tartalomtól függetlenül — ez
  torzította a rangsort. Minden jelölt szóhoz tartozik egy előre kimért
  „alapzaj” érték (semleges szürke + zajos teszt-kép átlaga,
  `FRIDGE_CANDIDATES` harmadik oszlopa), amit besorolás előtt levonunk a
  nyers pontszámból — így a rangsor a kép tényleges tartalmát tükrözi.
- A felismerés nem tökéletes — ezért a chipek egyesével törölhetők, és a
  mező kézzel is szerkeszthető; egy chip törlése csak azt az egy szót
  veszi ki a mezőből, a kézzel hozzáírt kiegészítéseket nem írja felül.
- Egyszerre **több fotó** is kiválasztható (a fájlválasztó `multiple`), pl.
  külön a polcokról és az ajtóról — a felismert hozzávalók uniója kerül a
  listába. A „Találatok bezárása” gomb a fotós állapotot (chipek, mező) is
  törli, hogy ne maradjon vissza inkonzisztens állapot egy korábbi fotóból.

### Címkék és „Ötletek” gombok

A kártyák címkéi (`recipeTagInfo()`) az adatokból számolódnak, nem kell
kézzel jelölni őket:

- **Kezdőknek is megy** — `easy` + legfeljebb 30 perc, nincs külön
  várakozás, legfeljebb 5 lépés és 9 hozzávaló (ilyenkor az „Egyszerű”
  helyett ez látszik). ~175 recept.
- **Grillen is** — a címben „nyárs/grillezett/roston”, vagy egy lépés
  grillt/nyársat/faszenet/parazsat említ úgy, hogy abban a lépésben nincs
  sütő, kontaktgrill vagy „grill alatt”. ~29 recept.
- **Előkészítés szükséges** — áztatás, kelesztés, fermentálás, szárítás,
  sózás kell hozzá, vagy a receptnek van pácolása. A hűtés, pihentetés,
  dermesztés és állás **nem** kap címkét, de mivel ezek is várakozást
  jelentenek, az időkorlát-szűrő és a „Kezdőknek is megy” / „Hétvégi
  projekt” címke továbbra is figyelembe veszi őket.

**Pácolás:** a pácolás ideje nem számít bele a recept `time` mezőjébe,
hanem a külön `marinate` mezőben áll (pl. `"time": "1 óra"`,
`"marinate": "legalább 2 óra, ideálisan egy éjszaka"`), és a kártyán
külön „Pácolás: …” sorként látszik. Az időkorlát-szűrő a pácolós recepteket
nem ajánlja rövid időkerethez.
- **Hétvégi projekt** — legalább 90 perc, külön várakozás nélkül. ~113 recept.

„Egyedényes” címkét szándékosan nem adunk: a lépésekből nem lehet
megbízhatóan eldönteni (a nokedlis vagy lasagnés recept is annak tűnne).
A „Gyors ötletek” alatti **Egy fazékban / tepsiben** gyűjtőgomb ezért csak
egy konzervatív, becsült szabályt használ (lásd lent), és nem kerül
címkeként a kártyára.

A kereső alatti **Ötletek** gombokkal (Kezdőknek is megy / Grillen is /
Hétvégi projekt / Nem kell főzni / Munkába is vihető / Hosszú életért / Fagyasztható / Magas fehérjetartalmú) keresőszó nélkül is böngészhető egy-egy
címke; hozzávalóval és étkezéssel kombinálható, újra rákattintva kikapcsol.

### Gyors ötletek („Mi van itthon?”)

A kereső „Ötletek” sora alatt egy összecsukható **Gyors ötletek** blokk van
(asztali szélességen nyitva, mobilon csukva nyílik; a gombok a meglévő
címkegombok stílusát használják, nincs vízszintes görgetés). Ami darabszámot
mutat, azt induláskor egyszer számolja ki az oldal, a profil
ételérzékenysége nélkül (a találatlista viszont szűr rá).

- **Idő, edény** — „15 perces (182)” és „30 perces (559)”: a recept `time`
  mezőjének **első** főzési ideje (pl. „1 óra 10 perc” = 70, „10 perc + egy
  éjszaka hűtés” = 10); a `marinate` külön mező, nem számít bele.
  „Egy fazékban / tepsiben (49)”: becsült, kulcsszavas szabály — a cím
  egytálételt, rakottat, tepsist vagy fazékban/lábasban/edényben készülő
  ételt jelez (`egytál|rakott|tepsis|tepsiben|egy fazék/lábas/serpenyő/edény|
  fazékétel|fazékban|lábasban|edényben|egyben sült`), vagy egy lépés azt írja,
  hogy mindent egy edényben/tepsiben készíts. Szándékosan szűk, ezért
  kihagy olyan egyedényes ételt, amit a szöveg nem így nevez meg.
- **Munkába vihető** — csak a „Munkába is vihető” (`lunchbox`) receptek közül:
  „gyors (≤ 30 perc)” (36), „egészséges” (110: „Hosszú életért” címke vagy
  legfeljebb 450 kcal / adag) és „húsmentes (becsült)” (62): a cím és a
  hozzávalók között nincs hús-, hal- vagy szárnyasszó (ékezet nélkül, szó
  eleji egyezéssel, hogy a „halloumi” vagy a „kagylótészta” ne számítson
  húsnak). Az alaplé és a zsír nem számít, ezért „becsült”.
- **Maradék** — „Maradt főtt rizs / csirke / kenyér / főtt burgonya / tészta /
  tojás”: a keresőmezőbe beírja az alapanyagot, és lefuttatja a keresést.
- **Alapanyag szerint** — csirke, sertés, marha, hal, tojás, tészta, rizs,
  burgonya, hüvelyes, zöldség, gomba, sajt; mindegyik mellett a találatok
  száma. A „hüvelyes” és a „zöldség” bővebb szólistára keres (lencse,
  csicseriborsó, fehérbab… illetve cukkini, sárgarépa, káposzta…).

A gombok az „Ötletek” gombokkal azonos módon működnek: egyszerre egy címke
aktív, kereséssel és étkezéssel kombinálható, újra rákattintva kikapcsol.

## Kedvencek, megosztás, adagszám

- **♡ Mentés / ♥ Elmentve** — minden kézzel írt recept kártyája alján (napi
  ajánló, heti menü, kedvencek). A mentett receptek a **♥ Kedvenceim** fülre
  kerülnek (a fülön a darabszám is látszik), localStorage-ban
  (`napi-recept-favorites`), a legutóbb mentett elöl. Azonosító:
  `<konyhakulcs>--<a cím slugja>` (pl. `american--klasszikus-amerikai-cheeseburger`),
  ez konyhánként egyedi; ha egy recept címe megváltozik, a régi mentés
  csendben kimarad a listából.
- **Megosztás** — `…/#recept=<azonosító>` linket ad. Telefonon a rendszer
  megosztó menüje nyílik meg (Messenger, Viber, e-mail stb.), asztali
  böngészőben vágólapra másolja a linket. A linket megnyitva a recept egy
  felugró ablakban jelenik meg; bezáráskor a `#recept=` rész eltűnik a címből.
- **Mennyiség (− / +)** — a Hozzávalók alatt; az adagszámot (`servings`,
  pl. „4 adag”, „12 db”) léptetve arányosan átszámolja a hozzávalók elején
  álló mennyiséget (egész, tizedes, tört, tartomány, „fél”, „másfél”).
  Konyhabarát kerekítés: 1 alatt negyed/fél/háromnegyed, 10 alatt fél
  egységekre, fölötte egészre. Az ízlés szerinti tételeket (só, csipet)
  nem módosítja. A bevásárlólista továbbra is az eredeti mennyiségekkel
  számol.

## Főzés mód

Minden kézzel írt recept kártyáján „Főzés mód” gomb: egész képernyős, nagy
betűs nézet a konyhapultra.

- A hozzávalók kipipálhatók; a mennyiségek a kártyán beállított adagszámot
  követik.
- A lépésekre koppintva késznek jelölhetők (áthúzva, zöld pipa), a
  következő el nem végzett lépés kiemelve látszik. Billentyűzettel
  (Enter/szóköz) is működik.
- **Időzítő:** ha egy lépésben idő szerepel („15-18 percig”, „1 órát”,
  „fél órát”), mellette ⏱ gomb indít visszaszámlálást (tartománynál az
  alsó értékkel, legfeljebb 3 óráig). A sáv felül rögzítve marad; lejártakor
  hangjelzés, rezgés (ahol van) és villogó „Letelt az idő!” felirat.
  Egyszerre egy időzítő fut; a főzés mód bezárása leállítja.
- A képernyő főzés közben nem sötétül el (Screen Wake Lock API, ahol a
  böngésző támogatja; ha nem, erről egy tipp jelenik meg).

**A kipipálható hozzávalók + koppintható lépések minta mindenhol megvan
(2026-09-27),** nem csak Főzés módban: a napi ajánló kártyáin, a heti
menüben, a Kedvenceim listában, a keresés találatain és a megosztott
recept felugró ablakában is ugyanúgy pipálhatók a hozzávalók és
koppinthatók (késznek jelölhetők) a lépések — nem kell külön Főzés módba
lépni hozzá. A megosztott logika (`buildStepListItem`, `wireStepToggle`
függvények) mindkét helyen (kártyák és Főzés mód) ugyanazt a viselkedést
adja; az **időzítő gomb** viszont szándékosan Főzés mód-specifikus maradt
— egyszerre több nyitott kártyán (pl. a heti menüben 21 is lehet) több
egyidejű időzítő zavaró lenne. A pipálás/kész-jelölés állapota kártyánként
nem tartós — újratöltéskor vagy adagszám-átszámoláskor nullázódik, ahogy
Főzés módban is mindig üresen nyílik meg.

## Hasznos tanácsok háziasszonyoknak és háziuraknak

Az **„Alapok kezdőknek”** saját menüpontot kapott (olívazöld szegélyű blokk): 11
alapfogás (előkészítés, mértékegységek, tészta- és rizsfőzés, üvegesre
párolás, sütés forró serpenyőben, hús pihentetése, maghőmérsékletek —
szárnyas 74 °C, darált hús 71 °C, egészben sült sertés/marha 63 °C —,
tojásfőzés, sózás, biztonságos vágás). Alján a „Mutasd a kezdőbarát
recepteket →” gomb átvált a „Mi van itthon?” oldalra, és bekapcsolja a kereső
„Kezdőknek is megy” szűrőjét.

A „Hasznos tanácsok” oldal gyakorlati háztartási tanácsokat gyűjt össze —
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

### Mértékegység-átváltó

Az **Alapok kezdőknek** oldal alján (a „Mértékegységek egy helyen” tipp
mellett) egy kis átváltó és két táblázat van. Az átváltóban egy érték és két
legördülő (honnan → hová) van; csak azonos fajtán belül lehet váltani:
tömeg (g, dkg), térfogat (ml, dl, liter, csésze, evőkanál, teáskanál) vagy
hőmérséklet (°C, °F). Alapértékek: 1 dkg = 10 g, 1 dl = 100 ml, evőkanál ≈ 15 ml,
teáskanál ≈ 5 ml, **csésze ≈ 2,4 dl** (ezt vettük alapul; a csészék mérete
eltér). A gramm és a milliliter közötti váltás hozzávalótól függ, ezért ezt a
„kb. hány gramm” táblázat adja meg liszt, kristálycukor, vaj, méz, nyers rizs
és olaj esetén (ugyanazokkal a sűrűségekkel, mint a bevásárlólista
összeadása). A sütőhőfok-táblázat °C ↔ gázfokozat (angol Gas Mark) ↔ °F, a
szokásos kerekített konyhai értékekkel; légkeveréses sütőnél általában
20 °C-kal kevesebbet kell állítani.

## Recept beküldése

A „Recept beküldése” oldalon bárki javasolhat receptet egy űrlapon keresztül (név és
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

## Új recept felvétele — mezők

A receptek az `index.html` `var RECIPES = {...}` sorában vannak, konyha
(`polish`, `southslavic`, `hungarian`, `french`, `italian`, `american`,
`greek`, `indian`, `chinese`, `japanese`) és étkezés (`breakfast`, `lunch`,
`dinner`) szerint. Egy recept:

    {
      "title": "Marhapörkölt",
      "time": "2 óra 30 perc",
      "marinate": "legalább 2 óra, ideálisan egy éjszaka",
      "servings": "4 adag",
      "ingredients": ["1 kg marhalábszár", "2 fej vöröshagyma", "..."],
      "steps": ["...", "..."],
      "easy": false,
      "noCook": false,
      "keepsWell": true
    }

- `time` — a teljes idő **pácolás nélkül**. Ha kell hozzá áztatás,
  kelesztés, hűtés vagy pihentetés, azt a fő idő után írd: `"1 óra 15 perc
  + egy éjszaka áztatás"`, `"30 perc + 1 óra hűtés"` — a címkék és az
  időkorlát-szűrő ebből dolgoznak. Ellenőrizd, hogy a lépésekben szereplő
  idők (sütés, főzés, pihentetés) összege belefér-e.
- `marinate` — nem kötelező; csak ha a receptet pácolni kell. Külön sorban
  látszik a kártyán, és nem számít bele a `time`-ba.
- `servings` — `"4 adag"`, `"2 fő"`, `"12 db"`; az adag-átszámoló és a
  „Hány főre főzöl?” ebből indul.
- `easy` — hétköznapra is gyorsan elkészíthető (a heti menü hétköznapokra
  ezeket részesíti előnyben); `noCook` — nem kell hozzá főzni.
- `keepsWell` — nem kötelező; `true`, ha hűtőben 3-4 napig jól eláll és
  felmelegítve is jó (több napra előre főzhető), `false`, ha nem. Ha
  hiányzik, a cím alapján döntjük el (`keepsWell()` az `index.html`-ben).
- `lunchbox` — nem kötelező; `true`, ha a recept dobozban, mikróban
  melegítve munkába is vihető („Munkába is vihető” címke és szűrő).
- `longevity` — nem kötelező; `true`, ha a recept megfelel a „Hosszú életért”
  szabálynak (lásd fent): „Hosszú életért” címke és szűrő. Új receptnél a
  szerkesztő állítja be a szabály szerint.
- `freezable` — nem kötelező; `true`, ha a recept a „Fagyasztható jelzés” szabálya szerint jól
  fagyasztható („Fagyasztható” címke és szűrő; a tárolási idő a címből számolódik).
- `source` — nem kötelező; csak szabad licencű forrásból átdolgozott
  receptnél: `{"name": "Wikibooks Cookbook", "title": "<eredeti cím>",
  "url": "<eredeti oldal>", "license": "CC BY-SA 4.0"}`. A kártyán a
  forrás és a licenc jelenik meg (lásd „Szabad licencű receptek”).
- `calories`, `proteinGrams` és `image` — a `calories`-t (kcal/adag) és a `proteinGrams`-t
  (becsült fehérje, g/adag, egész szám) a `tools/kcal-estimate` szkript tölti ki
  (`node tools/kcal-estimate/apply.js`, csak a hiányzót; most mind a 1370 recept megkapta), kézzel is
  javítható; az `image` nem kötelező. A „Magas fehérjetartalmú” címke ezekből számolódik, nem kell jelölni.

## Angol változat (English version)

Az oldal jobb felső sarkában az **English** / **Magyar** linkkel lehet
nyelvet váltani. A böngésző megjegyzi a választást (`napi-recept-lang`),
és közvetlenül is linkelhető: `index.html?lang=en`. Angolul jelenik meg
a teljes felület és mind a 1370 recept (cím, idő, pácolás, adag,
hozzávalók, lépések). Ugyanígy a bevásárlólista, a „Mi van itthon?”
kereső, a heti menü és az előre főzés is. A mennyiségek grammban és
milliliterben szerepelnek (a dkg és a dl átszámolva), és az
adagszám-átszámoló angolul is működik.

- Az alap a magyar adat: a szűrés, a heti menü, a kedvencek és a címkék
  mind a magyar receptből dolgoznak, az angol szöveg csak megjelenítés.
  Ezért a kedvencek és a mentett menük nyelvváltás után is megmaradnak.
- `i18n/en-ui.js`: a felület szövegei. A kulcs a magyar szöveg (`t("...")`
  az `index.html`-ben; egyes szám: `"<kulcs>|1"`).
- `i18n/en-recipes.js`: a receptek fordítása. A kulcs `<konyha>--<a magyar
  cím slugja>`. A két fájl csak angol nyelv választásakor töltődik be, így
  a magyar oldalt nem lassítja.
- Ha egy receptnek nincs fordítása, vagy eltér a hozzávalók vagy a lépések
  száma (például mert utólag módosult a magyar recept), az oldal a magyar
  szöveget mutatja, egy „This recipe has not been translated yet”
  megjegyzéssel. Ettől semmi nem romlik el.

**Új recept vagy új felületi szöveg után** futtasd:

    node tools/i18n-check.js

A szkript kilistázza:

- a fordítás nélküli recepteket,
- az eltérő szerkezetű recepteket,
- az árva fordításokat (ezek átnevezett magyar címre utalnak),
- a hiányzó felületi szövegeket.

Az új recept angol változatát az `i18n/en-recipes.js`-be kell felvenni.
A hozzávalók és a lépések száma és sorrendje egyezzen a magyar recepttel.

## Futtatás helyben

    python3 -m http.server 8000
    # majd: http://localhost:8000

Dupla kattintással is megnyitható közvetlenül a böngészőben, illetve
ugyanígy működik GitHub Pages-ről vagy bármilyen statikus tárhelyről.

## Fájlok

    index.html                      a teljes alkalmazás — stílus, jelölés, recept-adatok és logika egy fájlban
    spoonacular-proxy-worker.js     opcionális Cloudflare Worker kód a megosztott API-proxyhoz (lásd "Megosztott API-proxy")
    i18n/en-ui.js, en-recipes.js    az angol változat szövegei (lásd "Angol változat")
    tools/i18n-check.js             az angol fordítás teljességének ellenőrzése (node tools/i18n-check.js)
    tools/kcal-estimate/            hozzávaló-alapú kalória-becslő szkript (node apply.js) — lásd "Kalóriaérték minden receptnél"
    README.md                       ez a leírás
