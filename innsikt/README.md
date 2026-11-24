# Valglokalt Innsikt – fase 1 (ikke aktivert)
 
Formål: redaksjonell innsikt i bruken av Valglokalt, separat fra Cloudflare Web Analytics. Ingen individuelle besøksprofiler. Denne grenen skal ikke flettes eller utrulles før kontrollpunktene nedenfor er godkjent.

## Kartlegging av hovedsiden
Kontrollerte seksjons-ID-er: oversikt, maktkart, politiske-utvalg, kommunedeler, hvem-bestemmer, eierstyring, vedtak, valgbarometer, velgerinnflytelse, partier, politisk-atlas, politisk-landskap, kalkulator, data-status, valgskolen.
Hovedfilen har fetch for barometerarkiv og Brønnøysundregistrene. Eksterne datafiler og faktisk nettverkstrafikk må også kontrolleres.

## Første leveranse
- Cloudflare Web Analytics beholdes for trafikk, henvisere, enheter og ytelse.
- Egen D1-modell for daglige tellinger av generelle funksjoner, uten person- eller sesjons-ID.
- Ingen partinavn, kandidatnavn, politiske svar, kalkulatorverdier, URL-parametere, fritekst, IP-adresser, fingeravtrykk eller geografisk posisjon i hendelser.
- Kommune betyr kommunen innholdet gjelder, ikke brukerens bosted.
- Tellinger er hendelser, ikke unike personer. Ingen individhistorikk eller sammensatte politiske profiler.
- Dashboard må være beskyttet av Cloudflare Access og serververifisert identitet. Ingen offentlig lesetilgang til D1.
- Frivillige politiske undersøkelser er en egen senere fase med særskilt juridisk og teknisk vurdering; ingen skjult måling av politiske preferanser.

## Aktiveringsport
1. Gjennomgå GDPR og ekomlovens regler for den konkrete innsamlingsmetoden. Vurder samtykke, behandlingsgrunnlag, leverandøravtaler, lagringstid og eventuell DPIA.
2. Opprett separat Worker og D1, slå av hendelses-/forespørselslogging, kontroller også plattform- og sikkerhetslogger. Ingen rå hendelsesarkiv.
3. Fastsett tilgangsliste og test at uautoriserte forespørsler avvises.
4. Oppdater offentlig personverninformasjon før innsamling. Eventuelt samtykke må være frivillig, informert og kunne trekkes tilbake.
5. Test med syntetiske data; sjekk nettverk, avvisning av uventede felt, tilgang, små tall, sletting og datakvalitet.
6. Aktiver først etter kontroll. Inntil da skal ingen klientkode sende hendelser.

## Forslag til standarder
Daglig aggregering i UTC; vis perioder på minst sju dager. Undertrykk små kategorier (under 10 hendelser) i rapporter; dette alene garanterer ikke anonymitet. Ingen samtidige kryssfiltre som kan isolere enkeltpersoner. Forslag til lagringstid 365 dager, endelig beslutning før aktivering. Beskytt mot manipulerte tellinger uten vedvarende identifikatorer; resultatene er indikative og ikke representative.
