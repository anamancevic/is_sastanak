package com.sastanak.is_sastanak.meetings.controller;


import com.sastanak.is_sastanak.meetings.model.StatusPrisustva;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PrisustvoZahtev {
    private Integer sastanakId;
    private Integer korisnikId;
    private StatusPrisustva status;
}
