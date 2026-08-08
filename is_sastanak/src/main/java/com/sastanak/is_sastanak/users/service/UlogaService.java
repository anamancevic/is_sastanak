package com.sastanak.is_sastanak.users.service;

import com.sastanak.is_sastanak.users.model.Uloga;
import com.sastanak.is_sastanak.users.repository.UlogaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class UlogaService {
    private final UlogaRepository ulogaRepository;

    public UlogaService(UlogaRepository ulogaRepository){
        this.ulogaRepository = ulogaRepository;
    }

    public List<Uloga> getSveUloge(){
        return ulogaRepository.findAll();
    }

}
