package com.sastanak.is_sastanak.meetings.controller;

import com.sastanak.is_sastanak.meetings.model.Predlog;
import com.sastanak.is_sastanak.meetings.service.PredlogService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/predlozi")
public class PredlogController {
    private final PredlogService predlogService;

    public PredlogController(PredlogService predlogService) {
        this.predlogService = predlogService;
    }

    @PostMapping
    public Predlog dodajPredlog(@RequestBody PredlogZahtev zahtev){
        return predlogService.dodajPredlog(zahtev);
    }

    @GetMapping("/tacka/{tackaId}")
    private List<Predlog> getPredloziZaTacku(@PathVariable Integer tackaId){
        return predlogService.getPredloziZaTacku(tackaId);
    }
}
