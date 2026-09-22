# Napi recept ajánló

Egyoldalas, statikus alkalmazás: minden nap ajánl egy-egy **reggelit, ebédet
és vacsorát**, hét konyha közül válogatva — olasz, francia, amerikai, lengyel,
délszláv, görög és magyar. Minden recept magyarul jelenik meg. Nincs
build-lépés, nincs backend, nincs API-kulcs, nincs élő hálózati hívás sem —
minden a böngészőben, helyben fut.

## Hogyan válogat

A mai dátumból (az év hányadik napja) az alkalmazás determinisztikusan
kiválaszt 3 különböző konyhát — egyet reggelire, egyet ebédre, egyet
vacsorára —, úgy, hogy egy hét alatt mind a 7 konyha egyenlő eséllyel
előkerüljön. Ugyanaznap újratöltve ugyanazt az ajánlást mutatja, éjfélkor
változik. A „Másik ötletet ebből a konyhából” gomb ugyanabból a konyhából
kínál egy másik fogást, dátum-váltás nélkül is.

## Adatforrások

Nincs egyetlen ingyenes, élőben lekérdezhető adatbázis, amely mind a hét
konyhát magyar nyelven lefedné — ezért az oldal mind a 7 konyhához (olasz,
francia, amerikai, lengyel, délszláv, görög, magyar) **kézzel, magyarul
összeállított** recept-készletet tartalmaz: konyhánként 24 recept (8-8
reggelire, ebédre, vacsorára), összesen 168. Minden recept lépésenkénti,
kezdőbarát leírással készült (pontos hőfok/lángfokozat, időtartam, vizuális
jelzés minden lépésnél), elkészítési idővel és adagszámmal.

A válogatás háttéranyagaként — klasszikus fogások és jellemző arányok
tájékozódási pontjaként, nem szó szerinti átvételként — ezt az öt ingyenesen
elérhető forrást használtam:

1. [TheMealDB](https://www.themealdb.com) — ingyenes recept-adatbázis (olasz, francia, amerikai, lengyel, görög, délszláv/horvát receptek ihletője)
2. [Wikibooks Cookbook](https://en.wikibooks.org/wiki/Cookbook) — CC BY-SA 3.0, konyhánkénti fejezetei
3. Pellegrino Artusi: *La Scienza in cucina e l'Arte di mangiar bene* (1891) — közkincs, olasz klasszikusok
4. Auguste Escoffier: *Le Guide Culinaire* (1907) — közkincs, francia klasszikusok
5. Lucyna Ćwierczakiewiczowa: *365 obiadów za pięć złotych* (1858) és a Magyar Elektronikus Könyvtár közkincs szakácskönyvei — lengyel és magyar háttéranyag

A délszláv konyhát a Balkán-félsziget elterjedt, több ország konyhájában is
közös fogásai (pl. sarma, ćevapčići, burek) képviselik, mert nincs erre a
régióra bontott, egységes forrás.

## Futtatás helyben

    python3 -m http.server 8000
    # majd: http://localhost:8000

Dupla kattintással is megnyitható közvetlenül a böngészőben, illetve
ugyanígy működik GitHub Pages-ről vagy bármilyen statikus tárhelyről.

## Fájlok

    index.html    a teljes alkalmazás — stílus, jelölés, recept-adatok és logika egy fájlban
    README.md     ez a leírás
