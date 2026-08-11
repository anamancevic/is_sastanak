package com.sastanak.is_sastanak.meetings.repository;

import com.sastanak.is_sastanak.meetings.model.Prisustvo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PrisustvoRepository extends JpaRepository<Prisustvo, Integer> {
    List<Prisustvo> findBySastanakId(Integer sastanakId);
    Optional<Prisustvo> findBySastanakIdAndKorisnikId(Integer sastanakId, Integer korisnikId);
}
