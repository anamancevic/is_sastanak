package com.sastanak.is_sastanak.notifications.controller;

import com.sastanak.is_sastanak.notifications.model.Obavestenje;
import com.sastanak.is_sastanak.notifications.service.ObavestenjaService;
import org.springframework.data.domain.Page;
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

    @GetMapping("/korisnik/{korisnikId}/stranica")
    public Page<Obavestenje> getObavestenjaStranica(
            @PathVariable Integer korisnikId,
            @RequestParam(defaultValue = "0") int strana,
            @RequestParam(defaultValue = "5") int velicina){
        return obavestenjaService.getObavestenjaStranica(korisnikId, strana, velicina);
    }
}
