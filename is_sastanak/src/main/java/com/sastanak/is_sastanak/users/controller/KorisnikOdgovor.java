package com.sastanak.is_sastanak.users.controller;


import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
//samo ono što sme da se vidi
public class KorisnikOdgovor {
    private Integer id;
    private String ime;
    private String prezime;
    private String korisnickoIme;
    private String organizacionaCelina;
    private List<String> uloge;
}
