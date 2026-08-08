package com.sastanak.is_sastanak.users.controller;


import com.sastanak.is_sastanak.users.model.TipUloge;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DodelaUlogeZahtev {
    private Integer korisnikId;
    private Integer ulogaId;
    private Integer organizacionaCelinaId;
    private TipUloge tip;
    private String napomena;
}
