package com.sastanak.is_sastanak.meetings.controller;

import com.sastanak.is_sastanak.meetings.model.Prisustvo;
import com.sastanak.is_sastanak.meetings.model.Sastanak;
import com.sastanak.is_sastanak.meetings.model.SastanakUcesnik;
import com.sastanak.is_sastanak.meetings.model.TackaDnevnogReda;
import com.sastanak.is_sastanak.meetings.service.SastanakService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sastanci")
public class SastanakController {
    private final SastanakService sastanakService;

    public SastanakController(SastanakService sastanakService) {
        this.sastanakService = sastanakService;
    }

    @PostMapping
    public Sastanak zakaziSastanak(@RequestBody ZakazivanjeZahtev zahtev){
        return sastanakService.zakaziSastanak(zahtev);
    }
    @GetMapping
    public List<Sastanak> getSviSastanci(){
        return sastanakService.getSviSastanci();
    }

    @PostMapping("/dodaj-ucesnika")
    public SastanakUcesnik dodajUcesnika(@RequestBody UcesnikZahtev zahtev){
        return sastanakService.dodajUcesnika(zahtev);
    }

    @GetMapping("/{sastanakId}/ucesnici")
    public List<SastanakUcesnik> getUcesnici(@PathVariable Integer sastanakId){
        return sastanakService.getUcesnici(sastanakId);
    }
    @PostMapping("/evidentiraj-prisustvo")
    public Prisustvo evidentirajPrisustvo(@RequestBody PrisustvoZahtev zahtev){
        return sastanakService.evidentirajPrisustvo(zahtev);
    }
    @GetMapping("/{sastanakId}/prisustvo")
    public List<Prisustvo> getPrisustvo(@PathVariable Integer sastanakId){
        return sastanakService.getPrisustvo(sastanakId);
    }

    @GetMapping("/{sastanakId}/tacke")
    public List<TackaDnevnogReda> getTacke(@PathVariable Integer sastanakId){
        return sastanakService.getTacke(sastanakId);
    }

    @PutMapping("/{sastanakId}/status")
    public Sastanak izmeniStatus(@PathVariable Integer sastanakId,
                                 @RequestBody IzmenaStatusaZahtev zahtev){
        return sastanakService.izmeniStaus(sastanakId, zahtev);
    }
}
