package com.sastanak.is_sastanak.meetings.controller;

import com.sastanak.is_sastanak.meetings.model.TipSastanka;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class ZakazivanjeZahtev {
    private String tema;
    private LocalDateTime datumOdrzavanja;
    private String prostorija;
    private TipSastanka tip;
    private Integer kategorijaId;
    private Integer rukovodilacId;
    private Integer zapisnicarId;
    private Integer organizacionaCelinaId;
    private List<TackaZahtev> tacke;
}
