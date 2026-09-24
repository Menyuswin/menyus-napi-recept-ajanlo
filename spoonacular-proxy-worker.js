// Cloudflare Worker — megosztott Spoonacular API-proxy a "Napi recept ajánló" apphoz.
//
// Ez a fájl NEM fut le automatikusan sehol — ezt kell bemásolnod egy saját,
// ingyenes Cloudflare Workers projektbe (lásd README.md "Megosztott API-proxy"
// szakasza a lépésenkénti útmutatóért). A valódi Spoonacular API-kulcsot NEM ide
// írod be, hanem a Cloudflare felületén, egy "SPOONACULAR_API_KEY" nevű
// Environment Variable / Secret formájában — az soha nem kerül ebbe a fájlba,
// és soha nem kerül a látogatók böngészőjébe sem.
//
// Csak a Spoonacular /recipes/complexSearch végpontját engedi át, és csak a
// megadott GitHub Pages origin felől érkező kéréseket fogadja el (CORS) — más
// oldalról vagy közvetlen (böngészőn kívüli) hívásból érkező kérést elutasít.
//
// Ha a Workerhez RECIPE_CACHE néven egy Workers KV tároló is hozzá van kötve
// (opcionális, lásd README), a sikeres válaszokat CACHE_SECONDS ideig ott
// tartja: mivel az ajánló naponta ugyanazokat a lekérdezéseket küldi (azonos
// konyha, étkezés, szűrők), a többedik látogató már a tárolóból kapja a
// választ, és nem fogyasztja a Spoonacular napi keretét. (A beépített Cache
// API a *.workers.dev címeken nem működik, ezért kell hozzá KV.)

const ALLOWED_ORIGIN = "https://menyuswin.github.io";
const UPSTREAM = "https://api.spoonacular.com/recipes/complexSearch";
const CACHE_SECONDS = 6 * 60 * 60;

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get("Origin") || "";
    const corsHeaders = {
      "Access-Control-Allow-Origin": origin === ALLOWED_ORIGIN ? ALLOWED_ORIGIN : "null",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Vary": "Origin"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (origin !== ALLOWED_ORIGIN) {
      return new Response("Forbidden", { status: 403, headers: corsHeaders });
    }

    const url = new URL(request.url);
    if (url.pathname !== "/recipes/complexSearch") {
      return new Response("Not found", { status: 404, headers: corsHeaders });
    }
    if (!env.SPOONACULAR_API_KEY) {
      return new Response(
        JSON.stringify({ error: "A SPOONACULAR_API_KEY nincs beállítva a Worker Environment Variables / Secrets között." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const upstream = new URL(UPSTREAM);
    for (const [key, value] of url.searchParams) {
      if (key.toLowerCase() === "apikey") continue; // a kliens sosem adhat meg saját kulcsot ezen a végponton
      upstream.searchParams.set(key, value);
    }
    upstream.searchParams.sort();

    // A gyorsítótár kulcsa a kulcs nélküli lekérdezés, így a kulcs a tárolóba sem kerül.
    const kv = env.RECIPE_CACHE;
    const cacheKey = upstream.search;
    if (kv) {
      const cached = await kv.get(cacheKey);
      if (cached !== null) {
        return new Response(cached, {
          headers: { ...corsHeaders, "Content-Type": "application/json", "X-Proxy-Cache": "HIT" }
        });
      }
    }

    upstream.searchParams.set("apiKey", env.SPOONACULAR_API_KEY);
    const upstreamRes = await fetch(upstream.toString());
    const body = await upstreamRes.text();
    const contentType = upstreamRes.headers.get("Content-Type") || "application/json";

    if (kv && upstreamRes.ok) {
      ctx.waitUntil(kv.put(cacheKey, body, { expirationTtl: CACHE_SECONDS }));
    }

    return new Response(body, {
      status: upstreamRes.status,
      headers: { ...corsHeaders, "Content-Type": contentType, "X-Proxy-Cache": "MISS" }
    });
  }
};
