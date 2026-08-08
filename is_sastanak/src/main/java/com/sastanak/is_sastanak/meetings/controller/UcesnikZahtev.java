package com.sastanak.is_sastanak.meetings.controller;

import com.sastanak.is_sastanak.meetings.repository.SastanakUcesnikRepository;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UcesnikZahtev {

    private Integer sastanakId;
    private Integer korisnikId;
}
