package com.sastanak.is_sastanak.users.controller;


import com.sastanak.is_sastanak.users.model.OrganizacionaCelina;
import com.sastanak.is_sastanak.users.repository.OrganizacionaCelinaRepository;
import com.sastanak.is_sastanak.users.service.OrganizacionaCelinaService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/celine")
public class OrganizacionaCelinaController {
    private final OrganizacionaCelinaService celinaService;

    public OrganizacionaCelinaController(OrganizacionaCelinaService celinaService) {
        this.celinaService = celinaService;
    }

    @GetMapping
    public List<OrganizacionaCelina> getSveCeline(){
        return celinaService.getSveCeline();
    }
}
