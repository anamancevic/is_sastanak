package com.sastanak.is_sastanak.users.service;

import com.sastanak.is_sastanak.users.model.OrganizacionaCelina;
import com.sastanak.is_sastanak.users.repository.OrganizacionaCelinaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrganizacionaCelinaService {
    private final OrganizacionaCelinaRepository celinaRepository;

    public OrganizacionaCelinaService(OrganizacionaCelinaRepository celinaRepository) {
        this.celinaRepository = celinaRepository;
    }

    public List<OrganizacionaCelina> getSveCeline() {
        return celinaRepository.findAll();
    }
}
