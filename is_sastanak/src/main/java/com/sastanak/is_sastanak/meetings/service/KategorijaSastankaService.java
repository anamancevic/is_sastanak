package com.sastanak.is_sastanak.meetings.service;

import com.sastanak.is_sastanak.meetings.model.KategorijaSastanka;
import com.sastanak.is_sastanak.meetings.repository.KategorijaSastankaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KategorijaSastankaService {
    private  final KategorijaSastankaRepository kategorijaSastankaRepository;

    public KategorijaSastankaService(KategorijaSastankaRepository kategorijaSastankaRepository) {
        this.kategorijaSastankaRepository = kategorijaSastankaRepository;
    }

    public List<KategorijaSastanka> getSveKategorije(){
        return kategorijaSastankaRepository.findAll();
    }
}
