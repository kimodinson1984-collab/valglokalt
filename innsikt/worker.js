// Read-only pilot. No event ingestion.
const ISSUER = "https://morning-art-fb35.cloudflareaccess.com";
const AUD = "10ebab00cac7fad83414e95abdb97cd329c1baaf8c2d5b2e323f16b0b68d357d";
const headers = {"Cache-Control":"no-store","X-Robots-Tag":"noindex, nofollow","X-Content-Type-Options":"nosniff","Content-Security-Policy":"default-src 'none'; style-src 'unsafe-inline'; frame-ancestors 'none'; base-uri 'none'","Referrer-Policy":"no-referrer"};
function decode(s){if(!/^[A-Za-z0-9_-]+$/.test(s))throw Error("encoding");return Uint8Array.from(atob(s.replace(/-/g,"+").replace(/_/g,"/").padEnd(Math.ceil(s.length/4)*4,"=")),c=>c.charCodeAt(0));}
function json(s){return JSON.parse(new TextDecoder().decode(decode(s)));}
async function authorized(req,env){
 const token=req.headers.get("Cf-Access-Jwt-Assertion");
 if(!token||token.length>16384||!env.ADMIN_EMAIL)return false;
 const parts=token.split(".");if(parts.length!==3)return false;
 const [h,p,s]=parts, head=json(h), claims=json(p),now=Math.floor(Date.now()/1000);
 if(head.alg!=="RS256"||typeof head.kid!=="string"||claims.iss!==ISSUER||!Array.isArray(claims.aud)||!claims.aud.includes(AUD)||!Number.isFinite(claims.exp)||claims.exp<=now||!Number.isFinite(claims.iat)||claims.iat>now+60||(claims.nbf!==undefined&&(!Number.isFinite(claims.nbf)||claims.nbf>now))||typeof claims.email!=="string"||claims.email.toLowerCase()!==env.ADMIN_EMAIL.trim().toLowerCase())return false;
 const response=await fetch(ISSUER+"/cdn-cgi/access/certs",{redirect:"error",signal:AbortSignal.timeout(5000)});
 if(!response.ok)return false;
 const jwks=await response.json();const jwk=jwks.keys?.find(k=>k.kid===head.kid&&k.kty==="RSA");if(!jwk)return false;
 const key=await crypto.subtle.importKey("jwk",jwk,{name:"RSASSA-PKCS1-v1_5",hash:"SHA-256"},false,["verify"]);
 return crypto.subtle.verify("RSASSA-PKCS1-v1_5",key,decode(s),new TextEncoder().encode(h+"."+p));
}
const labels={overview:"Kommuneoversikt",council:"Maktkart",committees:"Politiske utvalg",districts:"Kommunedeler",governance:"Hvem bestemmer?",ownership:"Eierstyring",decisions:"Vedtak",barometer:"Valgbarometer",voter_influence:"Velgerinnflytelse",party_overview:"Partioversikt",political_atlas:"Politisk atlas",political_landscape:"Politisk landskap",calculator_open:"Mandatkalkulator",election_school:"Valgskolen",data_status:"Datastatus"};
function reply(body,status=200,type="text/plain; charset=utf-8"){return new Response(body,{status,headers:{...headers,"Content-Type":type}});}
export default {async fetch(req,env){
 try{if(!await authorized(req,env))return reply("Ingen tilgang",403);
 if(req.method!=="GET")return reply("Metoden er ikke tillatt",405);
 if(new URL(req.url).pathname!=="/")return reply("Ikke funnet",404);
 const data=await env.DB.prepare("SELECT feature, SUM(total) AS total FROM daily_feature_counts WHERE municipality = '1508' AND day_utc >= date('now','-30 days') AND day_utc < date('now') GROUP BY feature HAVING SUM(total) >= 10 ORDER BY total DESC").all();
 const rows=data.results.filter(r=>Object.hasOwn(labels,r.feature)&&Number.isSafeInteger(r.total)&&r.total>=10);
 const list=rows.map(r=>"<tr><td>"+labels[r.feature]+"</td><td>"+r.total+"</td></tr>").join("");
 return reply('<!doctype html><html lang="nb"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Valglokalt Innsikt</title><style>body{font:16px system-ui;background:#f5f8f6;color:#123449;max-width:900px;margin:60px auto;padding:0 24px}section{background:white;padding:24px;border:1px solid #d9e3e3;border-radius:12px}table{width:100%;border-collapse:collapse}td,th{text-align:left;padding:12px;border-bottom:1px solid #d9e3e3}a{color:#17786f}</style><h1>Valglokalt Innsikt</h1><p>Privat administrasjon · Ålesund</p><section><h2>Funksjonsbruk – siste 30 hele UTC-dager</h2><p>Innsamling er avslått. Tellinger er hendelser, ikke unike personer. Kategorier under 10 vises ikke.</p>'+ (list?'<table><thead><tr><th>Funksjon</th><th>Hendelser</th></tr></thead><tbody>'+list+'</tbody></table>':'<p>Ingen rapporterbare tellinger.</p>')+'<p><a href="https://dash.cloudflare.com/">Åpne Cloudflare Web Analytics</a></p></section></html>',200,"text/html; charset=utf-8");
 }catch{return reply("Tjenesten er midlertidig utilgjengelig",503);}
}};
