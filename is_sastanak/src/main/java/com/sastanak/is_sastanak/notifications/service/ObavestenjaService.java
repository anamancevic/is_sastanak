package com.sastanak.is_sastanak.notifications.service;

import com.sastanak.is_sastanak.notifications.model.Obavestenje;
import com.sastanak.is_sastanak.notifications.repository.ObavestenjeRepository;
import com.sastanak.is_sastanak.users.model.Korisnik;
import com.sastanak.is_sastanak.users.repository.KorisnikRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ObavestenjaService {
    private final ObavestenjeRepository obavestenjeRepository;
    private final KorisnikRepository korisnikRepository;

    public ObavestenjaService(ObavestenjeRepository obavestenjeRepository,
                              KorisnikRepository korisnikRepository) {
        this.obavestenjeRepository = obavestenjeRepository;
        this.korisnikRepository = korisnikRepository;
    }

    public Obavestenje napraviObavestenje(Integer korisnikId, Integer izazvaoId, String sadrzaj){
    Korisnik korisnik = korisnikRepository.findById(korisnikId)
            .orElseThrow(()->new RuntimeException("Korisnik ne postoji!"));

    Obavestenje obavestenje = new Obavestenje();
    obavestenje.setKorisnik(korisnik);
    obavestenje.setSadrzaj(sadrzaj);
    obavestenje.setDatumVreme(LocalDateTime.now());
    obavestenje.setProcitano(false);

    if (izazvaoId != null){
        Korisnik izazvao = korisnikRepository.findById(izazvaoId).orElse(null);
        obavestenje.setIzazvao(izazvao);
    }
    return obavestenjeRepository.save(obavestenje);
    }
    public List<Obavestenje> getObavestenjaKorisnika(Integer korisnikId){
        return obavestenjeRepository.findByKorisnikIdOrderByDatumVremeDesc(korisnikId);
    }

    public Obavestenje oznaciProcitano(Integer obavestenjeId){
        Obavestenje obavestenje = obavestenjeRepository.findById(obavestenjeId)
                .orElseThrow(()-> new RuntimeException("Obavestenje ne postoji!"));
        obavestenje.setProcitano(true);
        return obavestenjeRepository.save(obavestenje);
    }

    public Page<Obavestenje> getObavestenjaStranica(Integer korisnikId, int strana, int velicina){
        Pageable pageable = PageRequest.of(strana, velicina);
        return obavestenjeRepository.findByKorisnikIdOrderByDatumVremeDesc(korisnikId, pageable);
    }
}
