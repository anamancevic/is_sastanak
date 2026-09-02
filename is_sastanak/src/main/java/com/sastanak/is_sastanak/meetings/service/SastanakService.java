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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

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

    public Sastanak zakaziSastanak(ZakazivanjeZahtev zahtev) {
        KategorijaSastanka kategorija = kategorijaSastankaRepository.findById(zahtev.getKategorijaId())
                .orElseThrow(() -> new RuntimeException("Kategorija ne postoji!"));

        Korisnik rukovodilac = korisnikRepository.findById(zahtev.getRukovodilacId())
                .orElseThrow(() -> new RuntimeException("Rukovodilac ne postoji!"));

        OrganizacionaCelina celina = organizacionaCelinaRepository.findById(zahtev.getOrganizacionaCelinaId())
                .orElseThrow(() -> new RuntimeException("Organizaciona celina ne postoji!"));

        Sastanak sastanak = new Sastanak();
        sastanak.setTema(zahtev.getTema());
        sastanak.setDatumOdrzavanja(zahtev.getDatumOdrzavanja());
        sastanak.setProstorija(zahtev.getProstorija());
        sastanak.setTip(zahtev.getTip());
        sastanak.setStatus(StatusSastanka.ZAKAZAN);
        sastanak.setKategorija(kategorija);
        sastanak.setRukovodilac(rukovodilac);
        sastanak.setOrganizacionaCelina(celina);

        if (zahtev.getZapisnicarId() != null) {
            Korisnik zapisnicar = korisnikRepository.findById(zahtev.getZapisnicarId())
                    .orElseThrow(() -> new RuntimeException("Zapisnicar ne postoji!"));
            sastanak.setZapisnicar(zapisnicar);
        }
        Sastanak sacuvaniSastanak = sastanakRepository.save(sastanak);

        if (zahtev.getTacke() != null){
            for (TackaZahtev t : zahtev.getTacke()){
                TackaDnevnogReda tacka = new TackaDnevnogReda();
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
        Pageable pageable = PageRequest.of(strana, velicina);
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
}
