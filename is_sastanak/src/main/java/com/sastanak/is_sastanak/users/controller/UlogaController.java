package com.sastanak.is_sastanak.users.controller;

import com.sastanak.is_sastanak.users.model.Uloga;
import com.sastanak.is_sastanak.users.service.UlogaService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/uloge")

public class UlogaController {
    public final UlogaService ulogaService;

    public UlogaController(UlogaService ulogaService){
        this.ulogaService = ulogaService;
    }

   @GetMapping
    public List<Uloga> getSveUloge() {
        return ulogaService.getSveUloge();
    }
}
