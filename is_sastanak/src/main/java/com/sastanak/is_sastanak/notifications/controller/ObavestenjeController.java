package com.sastanak.is_sastanak.notifications.controller;

import com.sastanak.is_sastanak.notifications.model.Obavestenje;
import com.sastanak.is_sastanak.notifications.service.ObavestenjaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/obavestenja")
public class ObavestenjeController {
    private final ObavestenjaService obavestenjaService;

    public ObavestenjeController(ObavestenjaService obavestenjaService) {
        this.obavestenjaService = obavestenjaService;
    }

    @GetMapping("/korisnik/{korisnikId}")
    public List<Obavestenje> getObavestenjaKorisnika(@PathVariable Integer korisnikId){
        return obavestenjaService.getObavestenjaKorisnika(korisnikId);
    }

    @PutMapping("/{obavestenjeId}/procitano")
    public Obavestenje oznaciProcitano(@PathVariable Integer obavestenjeId){
        return obavestenjaService.oznaciProcitano(obavestenjeId);
    }
}
