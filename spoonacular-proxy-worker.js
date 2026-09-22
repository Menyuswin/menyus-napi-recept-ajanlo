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
// megadott GitHub Pages origin felől érkező kéréseket fogadja el (CORS).

const ALLOWED_ORIGIN = "https://menyuswin.github.io";
const UPSTREAM = "https://api.spoonacular.com/recipes/complexSearch";

export default {
  async fetch(request, env) {
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
    upstream.searchParams.set("apiKey", env.SPOONACULAR_API_KEY);

    const upstreamRes = await fetch(upstream.toString());
    const body = await upstreamRes.text();
    return new Response(body, {
      status: upstreamRes.status,
      headers: {
        ...corsHeaders,
        "Content-Type": upstreamRes.headers.get("Content-Type") || "application/json"
      }
    });
  }
};
