package com.sastanak.is_sastanak.meetings.repository;

import com.sastanak.is_sastanak.meetings.model.Sastanak;
import com.sastanak.is_sastanak.meetings.model.SastanakUcesnik;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SastanakUcesnikRepository extends JpaRepository<SastanakUcesnik, Integer> {
    List<SastanakUcesnik> findBySastanakId(Integer sastanakId);

    @Query("SELECT DISTINCT su.sastanak FROM SastanakUcesnik su " +
            "WHERE su.korisnik.organizacionaCelina.id = :celinaId")
    List<Sastanak> findSastanciByCelinaUcesnika(Integer celinaId);
}
