package com.sastanak.is_sastanak.meetings.controller;

import com.sastanak.is_sastanak.meetings.model.KategorijaSastanka;
import com.sastanak.is_sastanak.meetings.service.KategorijaSastankaService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/kategorije")
public class KategorijaSastankaController {
    private final KategorijaSastankaService kategorijaSastankaService;

    public KategorijaSastankaController(KategorijaSastankaService kategorijaSastankaService) {
        this.kategorijaSastankaService = kategorijaSastankaService;
    }

    @GetMapping
    public List<KategorijaSastanka> getSveKategorije(){
        return kategorijaSastankaService.getSveKategorije();
    }
}
