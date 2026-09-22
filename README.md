# Napi recept ajánló

Egyoldalas alkalmazás: minden nap ajánl egy-egy **reggelit, ebédet és
vacsorát**, hét konyha közül válogatva — olasz, francia, amerikai, lengyel,
délszláv, görög és magyar. Minden recept magyarul jelenik meg, igény szerint
személyre szabva (kor, testsúly, nem, ételintolerancia, fehérjecél). Nincs
build-lépés, nincs backend — statikus oldal, ami a böngészőből közvetlenül
hív külső, ingyenes API-kat.

## Hibrid adatforrás

Nincs egyetlen ingyenes adatbázis, amely mind a hét konyhát pontosan,
magyarul lefedné, ezért az oldal két forrást kever:

- **Olasz, francia, amerikai, görög** — élőben, a [Spoonacular](https://spoonacular.com)
  recept-API-jából (több százezer recept, beépített intolerancia- és
  fehérjeszűrővel). A cím, hozzávalók és lépések angolul érkeznek, az oldal a
  [MyMemory](https://mymemory.translated.net) ingyenes, kulcs nélküli
  fordító API-val fordítja le a ténylegesen kiválasztott napi recepteket
  (nem az egész adatbázist — csak amit aznap mutat).
- **Lengyel, délszláv, magyar** — kézzel, magyarul írt recept-készlet marad.
  A Spoonacularban ugyanis nincs ezekre a régiókra bontott kategória —
  mindhármat egy általános "kelet-európai" csoportba sorolná —, ezért itt a
  saját válogatás pontosabb és megbízhatóbb, mint amit egy élő API adna. A
  lengyel és délszláv konyha 24-28 receptet tartalmaz étkezésenként; a
  magyar konyha ennél jóval bővebb (179 recept), mert egy 1920-as évekbeli
  magyar háztartási könyv, Bánffyhunyadi Hunyady Erzsébet *A jó házi
  konyha* (MEK) átnézésével sok további, ma is jól használható fogást
  emeltünk be belőle, mai nyelvre és mértékegységekre átírva.

### Spoonacular API-kulcs

Az olasz/francia/amerikai/görög ajánláshoz saját, ingyenes Spoonacular
API-kulcs kell — ezt az oldal **Beállítások** paneljén adod meg egyszer.
A kulcs kizárólag a böngésződ `localStorage`-ában tárolódik, sosem kerül a
kódba vagy szerverre (egy publikus repóba írt kulcsot percek alatt
megtalálnak és ellopnak a kulcsvadász botok — ezért nem szabad oda írni).
Kulcs nélkül a lengyel/délszláv/magyar ajánlás továbbra is működik, csak a
másik négy konyha kér kulcsot.

Ingyenes kulcs igényelhető itt: [spoonacular.com/food-api/console](https://spoonacular.com/food-api/console#Dashboard).

## Személyre szabás

A Beállítások panelen felvehetsz **célszemélyeket** (pl. családtagokat):
név, kor, testsúly, nem, fehérjedús étrend igénye, napi kalóriacél,
ételintolerancia (tejtermék, tojás, glutén, földimogyoró stb.). A "Kinek
főzöl ma?" chipek közül mindig egy aktív — az oldal az ő adatai szerint
szűr, amíg másikra nem váltasz (vagy "Mindenkinek / nincs profil"-ra, ami
kikapcsolja a szűrést).

- **Intolerancia**: az élő (Spoonacular-os) konyháknál az API saját,
  pontos szűrője érvényesül. A kézzel írt lengyel/délszláv/magyar
  recepteknél az oldal a hozzávalók szövegében keres kulcsszavakat (pl.
  "tej", "liszt", "dió") — ez **tájékoztató jellegű becslés**, nem
  klinikai pontosságú. Ha a kiválasztott intoleranciának egy adott
  konyhánál/étkezésnél nincs biztonságos találata, az oldal ezt jelzi, és
  **nem** kínál helyette esetleg nem biztonságos alternatívát. Súlyos
  allergia esetén mindig olvasd el magad is a hozzávalókat.
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
- **Fontos korlát**: a kalória- és fehérjecél kizárólag az élő
  (olasz/francia/amerikai/görög) konyháknál érvényesül, mert csak a
  Spoonacular ad tápérték-adatot — a lengyel/délszláv/magyar, kézzel írt
  recepteknél ez a két szűrő nem hat.

## Hogyan válogat

A mai dátumból (az év hányadik napja) az alkalmazás determinisztikusan
kiválaszt 3 különböző konyhát — egyet reggelire, egyet ebédre, egyet
vacsorára —, úgy, hogy egy hét alatt mind a 7 konyha egyenlő eséllyel
előkerüljön. Ugyanaznap újratöltve ugyanazt az ajánlást mutatja, éjfélkor
változik. A „Másik ötletet ebből a konyhából” gomb ugyanabból a konyhából
kínál egy másik fogást, dátum-váltás nélkül is.

Két jelölőnégyzet is szűri az ajánlást (localStorage-ban megjegyezve):

- **„Egyszerűbb recepteket szeretnék”** — rövid elkészítési idejű, kevesebb
  hozzávalós recepteket részesít előnyben (élő konyháknál a Spoonacular
  `maxReadyTime` paraméterén keresztül).
- **„Reggelire és vacsorára nem kell mindenáron főtt étel”** — ebédnél nem
  számít, de reggelinél és vacsoránál olyan fogásokat hoz előre, amikhez nem
  kell tűzhely vagy sütő.

Ha egy adott konyhához/étkezéshez épp nincs a szűrésnek megfelelő találat,
az oldal ezt jelzi ("Újra" gombbal), nem kínál helyette esetleg nem
megfelelő alternatívát.

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

    index.html    a teljes alkalmazás — stílus, jelölés, recept-adatok és logika egy fájlban
    README.md     ez a leírás
