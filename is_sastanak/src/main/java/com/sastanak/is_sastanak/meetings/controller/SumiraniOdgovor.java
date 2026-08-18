package com.sastanak.is_sastanak.meetings.controller;

import com.sastanak.is_sastanak.users.model.Korisnik;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SumiraniOdgovor {
    private Integer korisnikId;
    private String ime;
    private String prezime;
    private long brojUcesca;

    public SumiraniOdgovor(Integer korisnikId, String ime, String prezime, Long brojUcesca) {
        this.korisnikId = korisnikId;
        this.ime = ime;
        this.prezime = prezime;
        this.brojUcesca = brojUcesca;
    }
}
