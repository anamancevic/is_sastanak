package com.sastanak.is_sastanak.meetings.controller;

import com.sastanak.is_sastanak.meetings.model.StatusSastanka;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class IzmenaStatusaZahtev {
    public StatusSastanka status;
    private  String zakljucak;
}
