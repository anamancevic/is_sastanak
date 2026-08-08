package com.sastanak.is_sastanak.meetings.service;

import com.sastanak.is_sastanak.meetings.controller.TackaZahtev;
import com.sastanak.is_sastanak.meetings.controller.UcesnikZahtev;
import com.sastanak.is_sastanak.meetings.controller.ZakazivanjeZahtev;
import com.sastanak.is_sastanak.meetings.model.*;
import com.sastanak.is_sastanak.meetings.repository.KategorijaSastankaRepository;
import com.sastanak.is_sastanak.meetings.repository.SastanakRepository;
import com.sastanak.is_sastanak.meetings.repository.SastanakUcesnikRepository;
import com.sastanak.is_sastanak.meetings.repository.TackaDnevnogRedaRepository;
import com.sastanak.is_sastanak.users.model.Korisnik;
import com.sastanak.is_sastanak.users.model.OrganizacionaCelina;
import com.sastanak.is_sastanak.users.repository.KorisnikRepository;
import com.sastanak.is_sastanak.users.repository.OrganizacionaCelinaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SastanakService {
    private final SastanakRepository sastanakRepository;
   private final KategorijaSastankaRepository kategorijaSastankaRepository;
    private final KorisnikRepository korisnikRepository;
    private final OrganizacionaCelinaRepository organizacionaCelinaRepository;
    private final TackaDnevnogRedaRepository tackaDnevnogRedaRepository;
    private final SastanakUcesnikRepository sastanakUcesnikRepository;

    public SastanakService(SastanakRepository sastanakRepository,
                           KategorijaSastankaRepository kategorijaSastankaRepository,
                           KorisnikRepository korisnikRepository,
                           OrganizacionaCelinaRepository organizacionaCelinaRepository,
                           TackaDnevnogRedaRepository tackaDnevnogRedaRepository,
                           SastanakUcesnikRepository sastanakUcesnikRepository) {
        this.sastanakRepository = sastanakRepository;
        this.kategorijaSastankaRepository = kategorijaSastankaRepository;
        this.korisnikRepository = korisnikRepository;
        this.organizacionaCelinaRepository = organizacionaCelinaRepository;
        this.tackaDnevnogRedaRepository = tackaDnevnogRedaRepository;
        this.sastanakUcesnikRepository = sastanakUcesnikRepository;
    }

    public Sastanak zakaziSastanak(ZakazivanjeZahtev zahtev){
        KategorijaSastanka kategorija = kategorijaSastankaRepository.findById(zahtev.getKategorijaId())
                .orElseThrow(()->new RuntimeException("Kategorija ne postoji!"));

        Korisnik rukovodilac = korisnikRepository.findById(zahtev.getRukovodilacId())
                .orElseThrow(()->new RuntimeException("Rukovodilac ne postoji!"));

        OrganizacionaCelina celina = organizacionaCelinaRepository.findById(zahtev.getOrganizacionaCelinaId())
                .orElseThrow(()-> new RuntimeException("Organizaciona celina ne postoji!"));

        Sastanak sastanak = new Sastanak();
        sastanak.setTema(zahtev.getTema());
        sastanak.setDatumOdrzavanja(zahtev.getDatumOdrzavanja());
        sastanak.setProstorija(zahtev.getProstorija());
        sastanak.setTip(zahtev.getTip());
        sastanak.setStatus(StatusSastanka.ZAKAZAN);
        sastanak.setKategorija(kategorija);
        sastanak.setRukovodilac(rukovodilac);
        sastanak.setOrganizacionaCelina(celina);

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

        return sastanakUcesnikRepository.save(ucesnik);
    }

    public List<SastanakUcesnik> getUcesnici(Integer sastanakId){
        return sastanakUcesnikRepository.findBySastanakId(sastanakId);
    }



}
