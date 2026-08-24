package com.sastanak.is_sastanak.notifications.repository;

import com.sastanak.is_sastanak.notifications.model.Obavestenje;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ObavestenjeRepository extends JpaRepository<Obavestenje, Integer> {
    List<Obavestenje> findByKorisnikIdOrderByDatumVremeDesc(Integer korisnikId);
}
