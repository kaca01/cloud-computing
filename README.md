# Gallery Web App
## Project for Course Cloud Computing (VI Semester)

## Team 16 members
- [Anastasija Savić](https://github.com/savic-a) SV7/2020
- [Katarina Vučić](https://github.com/kaca01) SV29/2020
- [Hristina Adamović](https://github.com/hristinaina) SV32/2020


### **Problem konzistencije između DynamoDB i S3 bucket-a**
Problem konzistencije može da se pojavi uslijed nestanka interneta, neuspješnog HTTP poziva za brisanje fajlova iz DynamoDB, neuspješan HTTP poziv za brisanje fajlova iz S3 bucket-a, neuspješna dodavanja i slično. Upotrijebili smo nekoliko algoritama radi prevencije ovih problema i njih ćemo ukratko opisati u nastavku.

**Brisanje i dodavanje dokumenata**
U toku brisanja i dodavanja imamo nekoliko različitih scenarija koja mogu dovesti do nekonzistentnosti u aplikaciji.
Za početak ćemo opisati kako naša funkcija za postavljanje dokumenata izgleda. Nakon što dobavimo bucket i tabelu, prvo pokušavamo dodati item u tabelu, a nakon toga pokušaj dajemo dodavanju item-a u bucket. Ukoliko dođe do greške prilikom dodavanja, pokušavamo još maksimalno 3 puta nakon čega vraćamo error 500. Između svakog pokušaja pravimo pauzu, koja se povećava sa brojem pokušaja (nakon prvog neuspješnog pokušaja pauziramo 2 sekunde, nakon drugog 4 i nakon trećeg 6 sekundi). Takođe imamo flag is_added_to_table, s obzirom da nam je dodavanje u tabelu prva funkcionalnost (ukoliko se prva funkcionalnost izvrši neuspješno, automatski prekidamo dalje dodavanje) koju odrađujemo, može se desiti da se ona izvrši uspješno, a dynamo dodavanje neuspješno. Ukoliko tokom 2. pokušaja ustanovimo da je item već dodan u tabelu, taj korak preskačemo i dalje samo pokušavamo dodati u dynamo. Ako ustanovimo i nakon 3. pokušaja da nismo u stanju da dodamo dokument, radimo rollback nad tabelom (ukoliko je bilo izmjena) i vraćamo error 500.
Analogno je implementirana prevencija tokom brisanja fajlova.

Kao dodatan algoritam smo implementirali lambda funkciju koja će raditi u pozadini svakog dana u 3:00 ujutro (po srednjeevropskom ljetnjem vremenu). Odabir vremena je određen pretpostavkom da je aplikacija tada pod manjim opterećenjem. Spomenuta funkcija će provjeravati da li su podaci konzistentni u oba skladišta i ukoliko nisu, brisaće podatke dok ne postigne konzistenciju (npr. imamo neki dokument u S3, a nemamo u dynamoDB, obrisaćemo ga iz S3 i na taj način raditi na boljoj konzistentnosti). Takođe ova funkcija obezbjeđuje logove u kojima izvještava kako je proteklo uspostavljanje konzistencije. Ova funkcija se izvršava samo jednom dnevno jer se vodimo pretpostavkom da pored drugih mehanizama prevencije nekonzistentnosti, ona će rijetko pronalaziti određenu nekonzistentnost, a ipak predstavlja određeno opterećenje za sistem i ne bi bilo ,,zdravo" da je često pozivamo.

**Uređivanje (edit) dokumenata**
Kod uređivanja dokumenta ne može doći do nekonzistentnosti, jer ne možemo promijeniti naziv dokumenta. Time zaključujemo, da neće biti potrebni mehanizmi prevencije nekonzistentnosti.

**Consistency se ne nalazi na main grani, već na fix/consistency grani.**
