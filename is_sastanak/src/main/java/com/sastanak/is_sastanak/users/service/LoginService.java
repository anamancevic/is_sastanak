package com.sastanak.is_sastanak.users.service;

import com.sastanak.is_sastanak.users.controller.KorisnikOdgovor;
import com.sastanak.is_sastanak.users.model.Korisnik;
import com.sastanak.is_sastanak.users.repository.KorisnikRepository;
import com.sastanak.is_sastanak.users.repository.KorisnikUlogaRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LoginService {
    private final KorisnikRepository korisnikRepository;
    private final PasswordEncoder passwordEncoder;
    private final KorisnikUlogaRepository korisnikUlogaRepository;

    public LoginService(KorisnikRepository korisnikRepository,
                        PasswordEncoder passwordEncoder,
                        KorisnikUlogaRepository korisnikUlogaRepository) {
        this.korisnikRepository = korisnikRepository;
        this.passwordEncoder = passwordEncoder;
        this.korisnikUlogaRepository = korisnikUlogaRepository;
    }

    public KorisnikOdgovor prijava(String korisnickoIme, String lozinka){
        Korisnik korisnik = korisnikRepository.findByKorisnickoIme(korisnickoIme).
                orElseThrow(() -> new RuntimeException("Pogrešno korisničko ime ili lozinka"));
        if (!passwordEncoder.matches(lozinka, korisnik.getLozinkaHash())){
            throw new RuntimeException("Pogrešno korisničko ime ili lozinka");
        }
    KorisnikOdgovor odgovor = new KorisnikOdgovor();
        odgovor.setId(korisnik.getId());
        odgovor.setIme(korisnik.getIme());
        odgovor.setPrezime(korisnik.getPrezime());
        odgovor.setKorisnickoIme(korisnik.getKorisnickoIme());
        odgovor.setOrganizacionaCelina(korisnik.getOrganizacionaCelina().getNaziv());

        List<String> uloge = korisnikUlogaRepository.findByKorisnikId(korisnik.getId())
                .stream()
                .map(ku->ku.getUloga().getNaziv())
                .toList();
        odgovor.setUloge(uloge);
        return odgovor;
    }
}
