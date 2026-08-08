package com.sastanak.is_sastanak.users.controller;

import com.sastanak.is_sastanak.users.model.Korisnik;
import com.sastanak.is_sastanak.users.service.LoginService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/login")

public class LoginController {
    private final LoginService loginService;
    public LoginController(LoginService loginService){
    this.loginService = loginService;
    }

    @PostMapping
    public KorisnikOdgovor prijava(@RequestBody LoginZahtev zahtev){
        return loginService.prijava(zahtev.getKorisnickoIme(), zahtev.getLozinka());
    }
}
