package com.sastanak.is_sastanak.meetings.repository;

import com.sastanak.is_sastanak.meetings.model.Prisustvo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PrisustvoRepository extends JpaRepository<Prisustvo, Integer> {
    List<Prisustvo> findBySastanakId(Integer sastanakId);
    Optional<Prisustvo> findBySastanakIdAndKorisnikId(Integer sastanakId, Integer korisnikId);
    @Query("SELECT p.korisnik.id, p.korisnik.ime, p.korisnik.prezime, COUNT(p) " +
    "FROM Prisustvo p WHERE p.status = 'PRISUTAN' " +
    "GROUP BY p.korisnik.id, p.korisnik.ime, p.korisnik.prezime")
    List<Object[]> brojUcescaPoKorisniku();

    //broji samo prisustva čiji sastanak je od datog datuma
    @Query("SELECT p.korisnik.id, p.korisnik.ime, p.korisnik.prezime, COUNT(p) " +
            "FROM Prisustvo p WHERE p.status = 'PRISUTAN' " +
            "AND p.sastanak.datumOdrzavanja >= :odDatuma " +
            "GROUP BY p.korisnik.id, p.korisnik.ime, p.korisnik.prezime")
    List<Object[]> brojUcescaOdDatuma(java.time.LocalDateTime odDatuma);
}
