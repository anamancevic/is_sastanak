package com.sastanak.is_sastanak.meetings.repository;

import com.sastanak.is_sastanak.meetings.model.Sastanak;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SastanakRepository extends JpaRepository<Sastanak, Integer> {
    List<Sastanak> findByOrganizacionaCelinaId(Integer celinaId);

    @Query("SELECT DISTINCT s FROM Sastanak s " +
            "LEFT JOIN SastanakUcesnik su ON su.sastanak = s " +
            "WHERE s.rukovodilac.id = :korisnikId " +
            "OR s.zapisnicar.id = :korisnikId " +
            "OR su.korisnik.id = :korisnikId")
    List<Sastanak> findSastanciKorisnika(Integer korisnikId);
}
