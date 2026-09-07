package com.sastanak.is_sastanak.meetings.service;

import com.sastanak.is_sastanak.meetings.controller.*;
import com.sastanak.is_sastanak.meetings.model.*;
import com.sastanak.is_sastanak.meetings.repository.*;
import com.sastanak.is_sastanak.notifications.repository.ObavestenjeRepository;
import com.sastanak.is_sastanak.notifications.service.ObavestenjaService;
import com.sastanak.is_sastanak.users.model.Korisnik;
import com.sastanak.is_sastanak.users.model.OrganizacionaCelina;
import com.sastanak.is_sastanak.users.repository.KorisnikRepository;
import com.sastanak.is_sastanak.users.repository.KorisnikUlogaRepository;
import com.sastanak.is_sastanak.users.repository.OrganizacionaCelinaRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.beans.JavaBean;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class SastanakService {
    private final SastanakRepository sastanakRepository;
   private final KategorijaSastankaRepository kategorijaSastankaRepository;
    private final KorisnikRepository korisnikRepository;
    private final OrganizacionaCelinaRepository organizacionaCelinaRepository;
    private final TackaDnevnogRedaRepository tackaDnevnogRedaRepository;
    private final SastanakUcesnikRepository sastanakUcesnikRepository;
    private final PrisustvoRepository prisustvoRepository;
    private final ObavestenjaService obavestenjaService;
    private final KorisnikUlogaRepository korisnikUlogaRepository;

    public SastanakService(SastanakRepository sastanakRepository,
                           KategorijaSastankaRepository kategorijaSastankaRepository,
                           KorisnikRepository korisnikRepository,
                           OrganizacionaCelinaRepository organizacionaCelinaRepository,
                           TackaDnevnogRedaRepository tackaDnevnogRedaRepository,
                           SastanakUcesnikRepository sastanakUcesnikRepository,
                           PrisustvoRepository prisustvoRepository,
                           ObavestenjaService obavestenjaService,
                           KorisnikUlogaRepository korisnikUlogaRepository) {
        this.sastanakRepository = sastanakRepository;
        this.kategorijaSastankaRepository = kategorijaSastankaRepository;
        this.korisnikRepository = korisnikRepository;
        this.organizacionaCelinaRepository = organizacionaCelinaRepository;
        this.tackaDnevnogRedaRepository = tackaDnevnogRedaRepository;
        this.sastanakUcesnikRepository = sastanakUcesnikRepository;
        this.prisustvoRepository = prisustvoRepository;
        this.obavestenjaService = obavestenjaService;
        this.korisnikUlogaRepository = korisnikUlogaRepository;
    }

    @Transactional
    public Sastanak zakaziSastanak(ZakazivanjeZahtev zahtev) {
        //provera tipa sastanka
        if (zahtev.getTip()==null){
            throw new RuntimeException("Sastanak mora imati tip!");
        }
        if (zahtev.getTip() == TipSastanka.STALNI
        && zahtev.getUcestalost()==null){
                throw new RuntimeException("Ucestalost mora postojati za stalni sastanak!");
        }
        if (zahtev.getTip()==TipSastanka.VANREDNI){
            zahtev.setUcestalost(null);
        }

        KategorijaSastanka kategorija = kategorijaSastankaRepository.findById(zahtev.getKategorijaId())
                .orElseThrow(() -> new RuntimeException("Kategorija ne postoji!"));

        Korisnik rukovodilac = korisnikRepository.findById(zahtev.getRukovodilacId())
                .orElseThrow(() -> new RuntimeException("Rukovodilac ne postoji!"));

        OrganizacionaCelina celina = organizacionaCelinaRepository.findById(zahtev.getOrganizacionaCelinaId())
                .orElseThrow(() -> new RuntimeException("Organizaciona celina ne postoji!"));

        if (zahtev.getZapisnicarId() == null) {
            throw new RuntimeException("Zapisničar je obavezan!");
        }

        Korisnik zapisnicar = korisnikRepository.findById(zahtev.getZapisnicarId())
                .orElseThrow(() -> new RuntimeException("Zapisnicar ne postoji!"));
        //vanredni sastanak - pravi se samo jedan
        if (zahtev.getTip()==TipSastanka.VANREDNI){
            return napraviJedanSastanak(
                    zahtev,
                    zahtev.getDatumOdrzavanja(),
                    kategorija,
                    rukovodilac,
                    celina,
                    zapisnicar
            );
        }

        //stalni sastanak - generisanje do kraja godine
        LocalDateTime datum = zahtev.getDatumOdrzavanja();

        LocalDateTime krajGodine = LocalDateTime.of(
                datum.getYear(),
                12,
                31,
                23,
                59,
                59
        );

        Sastanak prviSastanak = null;

        while (!datum.isAfter(krajGodine)){
            Sastanak sacuvani = napraviJedanSastanak(
                    zahtev,
                    datum,
                    kategorija,
                    rukovodilac,
                    celina,
                    zapisnicar
            );
            if (prviSastanak == null){
                prviSastanak = sacuvani;
            }
            datum = izracunajSledeciDatum(
                    datum,
                    zahtev.getUcestalost()
            );
        }
        return prviSastanak;
    }

    private LocalDateTime izracunajSledeciDatum(LocalDateTime datum, Ucestalost ucestalost) {
    return switch (ucestalost){
        case DNEVNI -> datum.plusDays(1);
        case NEDELJNI -> datum.plusWeeks(1);
        case MESECNI -> datum.plusMonths(1);
        case TROMESECNI -> datum.plusMonths(3);
        case SESTOMESECNI -> datum.plusMonths(6);
        case GODISNJI -> datum.plusYears(1);
    };
    }

    private Sastanak napraviJedanSastanak(ZakazivanjeZahtev zahtev, LocalDateTime datumOdrzavanja, KategorijaSastanka kategorija, Korisnik rukovodilac, OrganizacionaCelina celina, Korisnik zapisnicar) {
    Sastanak sastanak = new Sastanak();

    sastanak.setTema(zahtev.getTema());
    sastanak.setDatumOdrzavanja(datumOdrzavanja);
    sastanak.setProstorija(zahtev.getProstorija());
    sastanak.setTip(zahtev.getTip());
    sastanak.setStatus(StatusSastanka.ZAKAZAN);
    sastanak.setKategorija(kategorija);
    sastanak.setRukovodilac(rukovodilac);
    sastanak.setOrganizacionaCelina(celina);
    sastanak.setZapisnicar(zapisnicar);

    if (zahtev.getTip() == TipSastanka.STALNI){
        sastanak.setUcestalost(zahtev.getUcestalost());
    }else {
        sastanak.setUcestalost(null);
    }

    Sastanak sacuvaniSastanak = sastanakRepository.save(sastanak);

    if (zahtev.getTacke()!= null){
        for (TackaZahtev t : zahtev.getTacke()) {
            TackaDnevnogReda tacka =
                    new TackaDnevnogReda();

            tacka.setRedniBroj(t.getRedniBroj());
            tacka.setSadrzaj(t.getSadrzaj());
            tacka.setSastanak(sacuvaniSastanak);

            tackaDnevnogRedaRepository.save(tacka);
        }
    }
    return sacuvaniSastanak;
    }

    public List<Sastanak> getSviSastanci(){
        return sastanakRepository.findAll();
    }
    public SastanakUcesnik dodajUcesnika (UcesnikZahtev zahtev){
        Sastanak sastanak = sastanakRepository.findById(zahtev.getSastanakId())
                .orElseThrow(()-> new RuntimeException("Sastanak ne postoji!"));

        Korisnik korisnik = korisnikRepository.findById(zahtev.getKorisnikId())
                .orElseThrow(()-> new RuntimeException("Korisnik ne postoji!"));

        SastanakUcesnik ucesnik = new SastanakUcesnik();
        ucesnik.setSastanak(sastanak);
        ucesnik.setKorisnik(korisnik);
        ucesnik.setPlaniran(true);

        SastanakUcesnik sacuvan = sastanakUcesnikRepository.save(ucesnik);

        obavestenjaService.napraviObavestenje(
                korisnik.getId(),
                null,
                "Dodati ste kao ucesnik na sastanak: " + sastanak.getTema()
        );

        return sacuvan;
    }

    public List<SastanakUcesnik> getUcesnici(Integer sastanakId){
        return sastanakUcesnikRepository.findBySastanakId(sastanakId);
    }

public Prisustvo evidentirajPrisustvo(PrisustvoZahtev zahtev){
        Sastanak sastanak = sastanakRepository.findById(zahtev.getSastanakId())
                .orElseThrow(()-> new RuntimeException("Sastanak ne postoji!"));

        Korisnik korisnik = korisnikRepository.findById(zahtev.getKorisnikId())
                .orElseThrow(()->new RuntimeException("Korisnik ne postoji!"));

        Prisustvo prisustvo = prisustvoRepository.findBySastanakIdAndKorisnikId(sastanak.getId(), korisnik.getId())
                .orElse( new Prisustvo());
        prisustvo.setSastanak(sastanak);
        prisustvo.setKorisnik(korisnik);
        prisustvo.setStatus(zahtev.getStatus());
        prisustvo.setPlaniran(true);

        return prisustvoRepository.save(prisustvo);
}

    public List<Prisustvo> getPrisustvo(Integer sastanakId) {
        return prisustvoRepository.findBySastanakId(sastanakId);
    }
    public List<TackaDnevnogReda> getTacke(Integer sastanakId){
        return tackaDnevnogRedaRepository.findBySastanakId(sastanakId);
    }
    public Sastanak izmeniStaus(Integer sastanakId, IzmenaStatusaZahtev zahtev){
        Sastanak sastanak = sastanakRepository.findById(sastanakId)
                .orElseThrow(()-> new RuntimeException("Sastanak ne postoji!"));

        sastanak.setStatus(zahtev.getStatus());
        sastanak.setZakljucak(zahtev.getZakljucak());

        List<SastanakUcesnik> ucesnici = sastanakUcesnikRepository.findBySastanakId(sastanakId);
        for (SastanakUcesnik u : ucesnici) {
            if (u.getKorisnik() != null) {
                obavestenjaService.napraviObavestenje(
                        u.getKorisnik().getId(),
                        null,
                        "Sastanak \"" + sastanak.getTema() + "\" je sada: " + sastanak.getStatus()
                );
            }
        }

        return sastanakRepository.save(sastanak);
    }
    public List<Sastanak> getSastanciPoCelini(Integer celinaId){
        return sastanakRepository.findByOrganizacionaCelinaId(celinaId);
    }
    public List<SumiraniOdgovor> getSumiraniBrojUcesca(){
        List<Object[]> rezultati = prisustvoRepository.brojUcescaPoKorisniku();
        List<SumiraniOdgovor> lista = new ArrayList<>();

        for (Object[] red : rezultati){
            Integer korisnikId = (Integer) red[0];
            String ime = (String) red[1];
            String prezime = (String) red[2];
            Long broj = (Long) red[3];
            lista.add(new SumiraniOdgovor(korisnikId, ime, prezime, broj));
        }
        return lista;
    }

    public Page<Sastanak> getSastanakStranica (int strana, int velicina){
        Pageable pageable = PageRequest.of(strana, velicina, Sort.by("datumOdrzavanja"));
        return sastanakRepository.findAll(pageable);
    }
    public List<Sastanak> getSastanciMojihZaposlenih(String korisnickoIme){
        Korisnik prijavljeni = korisnikRepository.findByKorisnickoIme(korisnickoIme)
                .orElseThrow(()-> new RuntimeException("Korisnik ne postoji!"));
        Integer celinaId = prijavljeni.getOrganizacionaCelina().getId();
        return sastanakUcesnikRepository.findSastanciByCelinaUcesnika(celinaId);
    }

    //vraca listu sumiranih izvestaja u zavisnisti od uloge
    public List<SumiraniOdgovor> getSumiraniZaKorisnika(String korisnickoIme, String period){
        Korisnik prijavljeni = korisnikRepository.findByKorisnickoIme(korisnickoIme)
                .orElseThrow(()-> new RuntimeException("Ne postoji korisnik!"));
        //uloge prijavljenog
        List<String> uloge = korisnikUlogaRepository.findByKorisnikId(prijavljeni.getId())
                .stream()
                .map(ku-> ku.getUloga().getNaziv())
                .toList();
        boolean jeRukovodilac = uloge.contains("rukovodilac");
        boolean jeAdministrator = uloge.contains("administrator");

        //racunanje granice perioda
        java.time.LocalDateTime odDatuma;
        java.time.LocalDate danas = java.time.LocalDate.now();

        if (period.equals("nedelja")){
            odDatuma = danas.with(java.time.DayOfWeek.MONDAY).atStartOfDay(); // pocetak ove nedelje
        } else if (period.equals("mesec")) {
            odDatuma = danas.withDayOfMonth(1).atStartOfDay(); //pocetak ovog meseca
        }else{
            odDatuma = danas.withDayOfYear(1).atStartOfDay();//od prvog januara te godine
        }

        //svi sumirani
        List<Object[]> rezultati = prisustvoRepository.brojUcescaOdDatuma(odDatuma);
        List<SumiraniOdgovor> lista = new ArrayList<>();

        for (Object[] red : rezultati){
            Integer korisnikId = (Integer) red[0];
            String ime = (String) red[1];
            String prezime = (String) red[2];
            Long broj = (Long) red[3];

            if (jeAdministrator){
                //admin vidi sve
                lista.add(new SumiraniOdgovor(korisnikId, ime, prezime, broj));
            }
            else if (jeRukovodilac){
                //rukovodilac vidi samo svoju celinu
                Korisnik k = korisnikRepository.findById(korisnikId).orElse(null);
                if (k!= null && k.getOrganizacionaCelina().getId().equals(prijavljeni.getOrganizacionaCelina().getId())){
                    lista.add(new SumiraniOdgovor(korisnikId, ime, prezime, broj));
                }
                }
            else {
                //obican ucesnik, vidi samo svoje
                if (korisnikId.equals(prijavljeni.getId())){
                    lista.add(new SumiraniOdgovor(korisnikId, ime, prezime, broj));
                }
            }
        }
    return lista;
    }
    //vraca sastanke korisnika u zavisnosti od uloge
    public List<Sastanak> getSastanciZaKorisnika(String korisnickoIme){
        Korisnik prijavljeni = korisnikRepository.findByKorisnickoIme(korisnickoIme)
                .orElseThrow(()-> new RuntimeException("Ne postoji korisnik!"));
    List<String> uloge = korisnikUlogaRepository.findByKorisnikId(prijavljeni.getId())
            .stream()
            .map(ku -> ku.getUloga().getNaziv())
            .toList();

    if (uloge.contains("administrator")){
        return sastanakRepository.findAll();
    } else if (uloge.contains("rukovodilac")) {
        Integer celinaId = prijavljeni.getOrganizacionaCelina().getId();
        return sastanakRepository.findByOrganizacionaCelinaId(celinaId);
    }
    else {
        return sastanakRepository.findSastanciKorisnika(prijavljeni.getId());
    }
    }

    public List<Sastanak> getMojeUcesce(String korisnickoIme, String period){
        Korisnik prijavljeni = korisnikRepository.findByKorisnickoIme(korisnickoIme)
                .orElseThrow(()-> new RuntimeException("Korisnik ne postoji!"));

        List<String> uloge = korisnikUlogaRepository.findByKorisnikId(prijavljeni.getId())
                .stream().map(ku-> ku.getUloga().getNaziv()).toList();
        boolean jeAdmin = uloge.contains("administrator");

        List<Sastanak> moji;
        if (jeAdmin){
            moji = sastanakRepository.findAll();
        } else {
            moji = sastanakRepository.findSastanciKorisnika(prijavljeni.getId());
        }

        java.time.LocalDate danas = java.time.LocalDate.now();
        java.time.LocalDateTime odDatuma;

        if (period.equals("mesec")){
            odDatuma = danas.withDayOfMonth(1).atStartOfDay();
        }else {
            odDatuma = danas.withDayOfYear(1).atStartOfDay();
        }
        LocalDateTime sada = LocalDateTime.now();
        java.time.LocalDateTime granica = odDatuma;
        return moji.stream()
                .filter(s->s.getDatumOdrzavanja() != null && !s.getDatumOdrzavanja().isBefore(granica)
                && !s.getDatumOdrzavanja().isAfter(sada))
                .toList();
    }
}
