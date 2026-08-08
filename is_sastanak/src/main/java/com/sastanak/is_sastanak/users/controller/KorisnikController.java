package com.sastanak.is_sastanak.users.controller;


import com.sastanak.is_sastanak.users.model.Korisnik;
import com.sastanak.is_sastanak.users.model.KorisnikUloga;
import com.sastanak.is_sastanak.users.service.KorisnikService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/korisnici")
public class KorisnikController {
    private final KorisnikService korisnikService;
    public KorisnikController(KorisnikService korisnikService){
        this.korisnikService = korisnikService;
    }
    @PostMapping
    public Korisnik registruj(@RequestBody RegistracijaZahtev zahtev){
        return korisnikService.registruj(zahtev);
    }
    @PostMapping("/dodeli-ulogu")
    private KorisnikUloga dodeliUlogu(@RequestBody DodelaUlogeZahtev zahtev){
        return korisnikService.dodeliUlogu(zahtev);
    }

    @GetMapping
    public List<Korisnik> getSviKorisnici() {
        return korisnikService.getSviKorisnici();
    }
}
