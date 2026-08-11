package com.sastanak.is_sastanak.meetings.service;

import com.sastanak.is_sastanak.meetings.controller.PredlogZahtev;
import com.sastanak.is_sastanak.meetings.model.Predlog;
import com.sastanak.is_sastanak.meetings.model.Sastanak;
import com.sastanak.is_sastanak.meetings.model.TackaDnevnogReda;
import com.sastanak.is_sastanak.meetings.repository.PredlogRepository;
import com.sastanak.is_sastanak.meetings.repository.SastanakRepository;
import com.sastanak.is_sastanak.meetings.repository.TackaDnevnogRedaRepository;
import com.sastanak.is_sastanak.users.model.Korisnik;
import com.sastanak.is_sastanak.users.repository.KorisnikRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PredlogService {
    private final PredlogRepository predlogRepository;
    private final SastanakRepository sastanakRepository;
    private final KorisnikRepository korisnikRepository;
    private final TackaDnevnogRedaRepository tackaDnevnogRedaRepository;

    public PredlogService(PredlogRepository predlogRepository,
                          SastanakRepository sastanakRepository,
                          KorisnikRepository korisnikRepository,
                          TackaDnevnogRedaRepository tackaDnevnogRedaRepository) {
        this.predlogRepository = predlogRepository;
        this.sastanakRepository = sastanakRepository;
        this.korisnikRepository = korisnikRepository;
        this.tackaDnevnogRedaRepository = tackaDnevnogRedaRepository;
    }

    public Predlog dodajPredlog(PredlogZahtev zahtev){
        Sastanak sastanak = sastanakRepository.findById(zahtev.getSastanakId())
                .orElseThrow(()->new RuntimeException("Ne postoji sastanak!"));

        TackaDnevnogReda tacka = tackaDnevnogRedaRepository.findById(zahtev.getTackaId())
                .orElseThrow(()-> new RuntimeException("Tacka ne postoji!"));

        Korisnik korisnik = korisnikRepository.findById(zahtev.getKorisnikId())
                .orElseThrow(()->new RuntimeException("Korisnik ne postoji!"));

        Predlog predlog = new Predlog();
        predlog.setSastanak(sastanak);
        predlog.setTacka(tacka);
        predlog.setKorisnik(korisnik);
        predlog.setTekst(zahtev.getTekst());

        return predlogRepository.save(predlog);
    }
    public List<Predlog> getPredloziZaTacku(Integer tackaId){
        return predlogRepository.findByTackaId(tackaId);
    }
}
