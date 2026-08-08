package com.sastanak.is_sastanak.users.service;

import com.sastanak.is_sastanak.users.controller.DodelaUlogeZahtev;
import com.sastanak.is_sastanak.users.controller.RegistracijaZahtev;
import com.sastanak.is_sastanak.users.model.Korisnik;
import com.sastanak.is_sastanak.users.model.KorisnikUloga;
import com.sastanak.is_sastanak.users.model.OrganizacionaCelina;
import com.sastanak.is_sastanak.users.model.Uloga;
import com.sastanak.is_sastanak.users.repository.KorisnikRepository;
import com.sastanak.is_sastanak.users.repository.KorisnikUlogaRepository;
import com.sastanak.is_sastanak.users.repository.OrganizacionaCelinaRepository;
import com.sastanak.is_sastanak.users.repository.UlogaRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KorisnikService {
    private final KorisnikRepository korisnikRepository;
    private final OrganizacionaCelinaRepository organizacionaCelinaRepository;
    private final PasswordEncoder passwordEncoder;
    private final UlogaRepository ulogaRepository;
    private final KorisnikUlogaRepository korisnikUlogaRepository;

    public KorisnikService(KorisnikRepository korisnikRepository,
                           OrganizacionaCelinaRepository organizacionaCelinaRepository,
                           PasswordEncoder passwordEncoder,
                           UlogaRepository ulogaRepository,
                           KorisnikUlogaRepository korisnikUlogaRepository) {
        this.korisnikRepository = korisnikRepository;
        this.organizacionaCelinaRepository = organizacionaCelinaRepository;
        this.passwordEncoder = passwordEncoder;
        this.ulogaRepository = ulogaRepository;
        this.korisnikUlogaRepository = korisnikUlogaRepository;
    }

    public Korisnik registruj(RegistracijaZahtev zahtev) {
        if (korisnikRepository.findByKorisnickoIme(zahtev.getKorisnickoIme()).isPresent()) {
            throw new RuntimeException("Korisničko ime već postoji");
        }
        OrganizacionaCelina celina = organizacionaCelinaRepository.findById(zahtev.getOrganizacionaCelinaId())
                .orElseThrow(() -> new RuntimeException("Organizaciona celina ne postoji"));
        Korisnik korisnik = new Korisnik();
        korisnik.setIme(zahtev.getIme());
        korisnik.setImeOca(zahtev.getImeOca());
        korisnik.setPrezime(zahtev.getPrezime());
        korisnik.setJmbg(zahtev.getJmbg());
        korisnik.setRadnoMesto(zahtev.getRadnoMesto());
        korisnik.setKontaktTelefonPosao(zahtev.getKontaktTelefonPosao());
        korisnik.setMobilniTelefon(zahtev.getMobilniTelefon());
        korisnik.setMejl(zahtev.getMejl());
        korisnik.setKorisnickoIme(zahtev.getKorisnickoIme());
        korisnik.setLozinkaHash(passwordEncoder.encode(zahtev.getLozinka()));
        korisnik.setOrganizacionaCelina(celina);

        return korisnikRepository.save(korisnik);
    }

    //čuva u bazi novu ulogu korisnika
    public KorisnikUloga dodeliUlogu(DodelaUlogeZahtev zahtev) {
        Korisnik korisnik = korisnikRepository.findById(zahtev.getKorisnikId())
                .orElseThrow(() -> new RuntimeException("Korisnik ne postoji!"));
        Uloga uloga = ulogaRepository.findById(zahtev.getUlogaId())
                .orElseThrow(() -> new RuntimeException("Uloga ne postoji!"));
        OrganizacionaCelina celina = organizacionaCelinaRepository.findById(zahtev.getOrganizacionaCelinaId())
                .orElseThrow(() -> new RuntimeException("Ne posotji organizaciona celina sa tim imenom!"));

        KorisnikUloga korisnikUloga = new KorisnikUloga();
        korisnikUloga.setKorisnik(korisnik);
        korisnikUloga.setUloga(uloga);
        korisnikUloga.setOrganizacionaCelina(celina);
        korisnikUloga.setTipUloge(zahtev.getTip());
        korisnikUloga.setNapomena(zahtev.getNapomena());

        return korisnikUlogaRepository.save(korisnikUloga);
    }
    public List<Korisnik> getSviKorisnici(){
        return korisnikRepository.findAll();
    }
}
